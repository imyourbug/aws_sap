// Cloudflare Pages Function: trạng thái bài thi đang làm (đáp án, đánh dấu, thời gian còn lại…)
// của từng bộ đề, dùng chung cho mọi máy, lưu trong Workers KV (binding HISTORY, khóa "state:<quizKey>").
//
//   GET /api/state             -> { <quizKey>: state, ... } tất cả bộ đề đã có trạng thái
//   GET /api/state?key=<quiz>  -> state của một bộ đề ({} nếu chưa có)
//   PUT /api/state?key=<quiz>  -> lưu state (kèm baseAt = updatedAt của bản trên server mà nó dựa vào);
//                                 409 + bản đang lưu nếu baseAt không khớp

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

  // Chỉ ghi khi máy gửi đã thấy bản đang lưu (baseAt trùng updatedAt của nó). Nếu không, máy khác
  // đã lưu bản mà máy này chưa tải về (vd. điện thoại vừa xóa cache bấm "Bắt đầu" trước khi kịp tải):
  // trả 409 kèm bản đang lưu để máy đó nạp lại, thay vì ghi đè mất tiến độ của máy kia.
  const current = await env.HISTORY.get(PREFIX + key, "json");
  if (current && current.updatedAt && String(current.updatedAt) !== String(incoming.baseAt || ""))
    return json(current, 409);
  delete incoming.baseAt;
  const stored = JSON.stringify(incoming);
  await env.HISTORY.put(PREFIX + key, stored);
  return json(stored);
}
