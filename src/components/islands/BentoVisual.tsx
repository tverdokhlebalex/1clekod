import { ArrowRight, Check, Database } from "lucide-react";

type Kind = "queue" | "exchange" | "deal" | "audit" | "urgent";

const queue = [
  { title: "Проведение реализации", state: "В работе", live: true },
  { title: "Обновление УТ на копии", state: "В очереди", live: false },
  { title: "Обмен заказов с сайтом", state: "Готово", live: false }
];

const audit = [
  { title: "Доступы к базе", state: "Есть" },
  { title: "Журнал обменов", state: "Смотрим" },
  { title: "Резервная копия", state: "Свежая" }
];

export function BentoVisual({ kind }: { kind: Kind }) {
  if (kind === "queue") {
    return (
      <div aria-hidden className="rounded-[var(--radius-lg)] border border-white/10 bg-[#111827] p-4 text-white">
        <p className="text-xs font-medium text-white/60">Очередь задач · пример</p>
        <div className="mt-3 grid gap-2">
          {queue.map((item) => (
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-white/[0.05] px-3 py-2.5" key={item.title}>
              <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
              <span className={item.live ? "shrink-0 whitespace-nowrap text-xs font-semibold text-[#8ea2ff]" : "shrink-0 whitespace-nowrap text-xs font-semibold text-[#ffd43b]"}>{item.state}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "exchange") {
    return (
      <div aria-hidden className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[#f8fafc] p-4">
        <p className="text-xs font-medium text-[var(--color-muted)]">Передача данных · пример</p>
        <div className="mt-4 grid gap-3">
          <Flow from="1С" to="Сайт" />
          <Flow from="Сайт" to="Склад" blue />
        </div>
      </div>
    );
  }

  if (kind === "deal") {
    return (
      <div aria-hidden className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[#f8fafc] p-4">
        <p className="text-xs font-medium text-[var(--color-muted)]">Сделка уходит в учёт · пример</p>
        <div className="mt-4 flex items-center gap-2">
          <Chip label="Битрикс24" text="Сделка" />
          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#e2e8f0] [container-type:inline-size]">
            <span className="packet absolute left-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#4d6bff] shadow-[0_0_12px_rgb(77_107_255_/_0.8)]" />
          </div>
          <Chip label="1С" text="Заказ" gold />
        </div>
      </div>
    );
  }

  if (kind === "audit") {
    return (
      <div aria-hidden className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-4">
        <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[#4d6bff]/15 to-transparent" />
        <p className="text-xs font-medium text-[var(--color-muted)]">Проверка контура · пример</p>
        <div className="mt-3 grid gap-2">
          {audit.map((item) => (
            <div className="flex items-center justify-between gap-3 text-sm" key={item.title}>
              <span>{item.title}</span>
              <span className="rounded-full bg-[var(--color-gold-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-gold-deep)]">{item.state}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className="flex flex-wrap items-center gap-2">
      {["Не проводится", "Обмен встал", "Смотрим симптом"].map((item) => (
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold" key={item}>
          {item}
        </span>
      ))}
      <ArrowRight aria-hidden className="text-[#ffd43b]" size={16} />
    </div>
  );
}

function Flow({ from, to, blue = false }: { from: string; to: string; blue?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-14 shrink-0 items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
        {from === "1С" && <Database aria-hidden size={14} />}
        {from}
      </span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[#e2e8f0] [container-type:inline-size]">
        <span className={`packet absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full ${blue ? "bg-[#4d6bff]" : "bg-[#f5b800]"}`} />
      </div>
      <span className="w-14 shrink-0 text-right text-xs font-semibold text-[var(--color-ink)]">{to}</span>
    </div>
  );
}

function Chip({ label, text, gold = false }: { label: string; text: string; gold?: boolean }) {
  return (
    <div className={`min-w-24 rounded-[var(--radius-md)] border px-3 py-2 ${gold ? "border-[#f5b800]/50 bg-[#fff8d6]" : "border-[var(--color-line)] bg-white"}`}>
      <p className="text-[11px] text-[var(--color-muted)]">{label}</p>
      <p className="flex items-center gap-1 text-sm font-semibold">
        {gold && <Check aria-hidden size={14} />}
        {text}
      </p>
    </div>
  );
}
