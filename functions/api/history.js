// Cloudflare Pages Function: một bản lịch sử thi dùng chung, lưu dạng JSON trong Workers KV.
// Không cần mã hay đăng nhập: ai mở trang cũng đọc và ghi vào cùng một bản.
//
//   GET /api/history  -> lịch sử hiện có ({} nếu chưa có)
//   PUT /api/history  -> gộp lịch sử gửi lên với bản đang lưu, trả về bản sau khi gộp
//
// Cấu hình trong Cloudflare dashboard (Pages project > Settings > Bindings):
//   KV namespace, tên biến HISTORY.
//
// Khi KV còn trống, GET trả về file tĩnh history/quiz-history.json trong repo (nếu có)
// để lịch sử cũ được chuyển lên KV ở lần lưu đầu tiên.

const KEY = "quiz-history";
const MAX_BYTES = 20 * 1024 * 1024;

const json = (body, status = 200) =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const missingKv = () => json({ error: "Chưa gắn KV namespace với tên biến HISTORY." }, 500);

export async function onRequestGet({ request, env }) {
  if (!env.HISTORY) return missingKv();
  const stored = await env.HISTORY.get(KEY);
  if (stored) return json(stored);

  if (env.ASSETS) {
    const seed = await env.ASSETS.fetch(new URL("/history/quiz-history.json", request.url));
    if (seed.ok && (seed.headers.get("Content-Type") || "").includes("json")) return json(await seed.text());
  }
  return json({});
}

export async function onRequestPut({ request, env }) {
  if (!env.HISTORY) return missingKv();
  const text = await request.text();
  if (!text || text.length > MAX_BYTES) return json({ error: "Kích thước không hợp lệ." }, 400);
  let payload;
  try {
    payload = JSON.parse(text);
  } catch (e) {
    return json({ error: "JSON không hợp lệ." }, 400);
  }
  if (!Array.isArray(payload.attempts)) return json({ error: "Thiếu attempts." }, 400);

  // Gộp với bản đang lưu thay vì ghi đè: một máy đọc phải bản cũ (KV cần tới ~60 giây để đồng bộ
  // giữa các vùng) cũng không xóa mất lần thi mà máy khác vừa lưu. Chỉ bỏ những lần thi có trong "deleted".
  let current = {};
  try {
    current = JSON.parse((await env.HISTORY.get(KEY)) || "{}");
  } catch (e) { }
  const deleted = new Set([...(current.deleted || []), ...(payload.deleted || [])]);
  const byId = new Map();
  for (const a of [...(current.attempts || []), ...payload.attempts]) {
    if (a && a.id && !deleted.has(a.id)) byId.set(a.id, a);
  }
  payload.attempts = [...byId.values()].sort((x, y) => String(x.submittedAt).localeCompare(String(y.submittedAt)));
  payload.deleted = [...deleted];

  const merged = JSON.stringify(payload);
  await env.HISTORY.put(KEY, merged);
  return json(merged);
}
