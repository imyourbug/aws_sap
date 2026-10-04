// Cloudflare Pages Function: trạng thái bài thi đang làm (đáp án, đánh dấu, thời gian còn lại…)
// của từng bộ đề, dùng chung cho mọi máy, lưu trong Workers KV (binding HISTORY, khóa "state:<quizKey>").
//
//   GET /api/state             -> { <quizKey>: state, ... } tất cả bộ đề đã có trạng thái
//   GET /api/state?key=<quiz>  -> state của một bộ đề ({} nếu chưa có)
//   PUT /api/state?key=<quiz>  -> lưu state; chỉ ghi khi updatedAt mới hơn bản đang có, trả về bản thắng

const PREFIX = "state:";
const KEY_RE = /^[\w-]{1,64}$/;
const MAX_BYTES = 1024 * 1024;

const json = (body, status = 200) =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const missingKv = () => json({ error: "Chưa gắn KV namespace với tên biến HISTORY." }, 500);

function quizKey(request) {
  const key = new URL(request.url).searchParams.get("key") || "";
  return KEY_RE.test(key) ? key : null;
}

export async function onRequestGet({ request, env }) {
  if (!env.HISTORY) return missingKv();
  if (new URL(request.url).searchParams.has("key")) {
    const key = quizKey(request);
    if (!key) return json({ error: "key không hợp lệ." }, 400);
    return json((await env.HISTORY.get(PREFIX + key)) || "{}");
  }

  const all = {};
  let cursor;
  do {
    const page = await env.HISTORY.list({ prefix: PREFIX, cursor });
    await Promise.all(page.keys.map(async (k) => {
      const value = await env.HISTORY.get(k.name, "json");
      if (value) all[k.name.slice(PREFIX.length)] = value;
    }));
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return json(all);
}

export async function onRequestPut({ request, env }) {
  if (!env.HISTORY) return missingKv();
  const key = quizKey(request);
  if (!key) return json({ error: "key không hợp lệ." }, 400);
  const text = await request.text();
  if (!text || text.length > MAX_BYTES) return json({ error: "Kích thước không hợp lệ." }, 400);
  let incoming;
  try {
    incoming = JSON.parse(text);
  } catch (e) {
    return json({ error: "JSON không hợp lệ." }, 400);
  }
  if (!incoming || typeof incoming.answers !== "object" || !incoming.updatedAt)
    return json({ error: "Thiếu answers hoặc updatedAt." }, 400);

  // Máy nào thao tác sau cùng thì thắng; bản cũ hơn gửi tới muộn không ghi đè bản mới.
  const current = await env.HISTORY.get(PREFIX + key, "json");
  if (current && current.updatedAt && String(current.updatedAt) > String(incoming.updatedAt)) return json(current);
  await env.HISTORY.put(PREFIX + key, text);
  return json(text);
}
