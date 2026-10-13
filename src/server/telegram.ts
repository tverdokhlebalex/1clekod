function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const hits = new Map<string, number[]>();

export function allowRequest(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function sendTelegram(text: string) {
  const token = import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false as const, status: 503, message: "Приём заявок ещё не подключён. Позвоните или напишите на почту." };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    return { ok: false as const, status: 502, message: "Не удалось отправить заявку. Позвоните, если вопрос срочный." };
  }

  return { ok: true as const };
}

export function formatLead(input: {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
  format: string;
  service: string;
  page?: string;
  referrer?: string;
  utm?: Record<string, string | undefined>;
}) {
  const lines = [
    "<b>Заявка с сайта Лёгкий код</b>",
    `Имя: ${escapeHtml(input.name)}`,
    `Телефон: ${escapeHtml(input.phone)}`,
    input.email ? `Email: ${escapeHtml(input.email)}` : "",
    input.company ? `Компания: ${escapeHtml(input.company)}` : "",
    input.format ? `Формат: ${escapeHtml(input.format)}` : "",
    input.service ? `Услуга: ${escapeHtml(input.service)}` : "",
    "",
    escapeHtml(input.message),
    "",
    input.page ? `Страница: ${escapeHtml(input.page)}` : "",
    input.referrer ? `Реферер: ${escapeHtml(input.referrer)}` : ""
  ];

  const utm = Object.entries(input.utm ?? {}).filter((entry) => entry[1]);
  if (utm.length) {
    lines.push("", ...utm.map(([key, value]) => `${key}: ${escapeHtml(value ?? "")}`));
  }

  return lines.filter(Boolean).join("\n");
}
