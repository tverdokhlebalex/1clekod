import type { APIRoute } from "astro";
import { leadSchema } from "@/lib/schema";
import { allowRequest, formatLead, sendTelegram } from "@/server/telegram";

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json({ ok: false, message: "Заявка отправлена не с сайта." }, 403);
      }
    } catch {
      return json({ ok: false, message: "Заявка отправлена не с сайта." }, 403);
    }
  }

  const raw = await request.text();
  if (raw.length > 20_000) {
    return json({ ok: false, message: "Слишком длинное сообщение." }, 413);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Некорректная заявка." }, 400);
  }

  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) {
    return json({ ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте поля формы." }, 400);
  }

  if (parsed.data.website.trim()) {
    return json({ ok: true });
  }

  if (!allowRequest(clientAddress || "unknown")) {
    return json({ ok: false, message: "Слишком много заявок подряд. Позвоните или напишите чуть позже." }, 429);
  }

  const result = await sendTelegram(formatLead(parsed.data));
  if (!result.ok) {
    return json({ ok: false, message: result.message }, result.status);
  }

  return json({ ok: true });
};
