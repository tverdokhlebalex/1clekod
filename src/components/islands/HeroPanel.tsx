import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { BellRing } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/cn";

type Row = { title: string; meta: string; state: string; progress: number };
type Lane = { label: string; value: string };
type Channel = { label: string; icon: IconName };

export type HeroPanelData = {
  title: string;
  status: string;
  noticeTitle: string;
  noticeText: string;
  rows: Row[];
  lanes: Lane[];
  taskTitle: string;
  taskText: string;
  channels: Channel[];
};

export function HeroPanel({ panel }: { panel: HeroPanelData }) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useTransform(pointerY, [-0.5, 0.5], reducedMotion ? [0, 0] : [6, -6]);
  const rotateY = useTransform(pointerX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-8, 8]);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
      aria-label="Пример экрана контура 1С: обмены, документы и заявка программисту. Это не показатели конкретного клиента."
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
      onMouseLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      onMouseMove={onMove}
      role="img"
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-[rgb(255_212_59_/_0.45)] blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-6 h-44 w-44 rounded-full bg-[rgb(77_107_255_/_0.4)] blur-3xl" />
      <motion.div
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-[#111827] p-3 text-white shadow-[0_30px_80px_rgb(17_24_39_/_0.28)]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-line" />
        <div className="rounded-[var(--radius-lg)] border border-white/10 bg-[#0f1623]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#ffd43b]" />
              <span className="size-2.5 rounded-full bg-[#4d6bff]" />
            </div>
            <p className="truncate text-xs font-semibold text-white/80">{panel.title}</p>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#ffd43b]">
              <span className="relative flex size-2">
                <span className="status-ping absolute inline-flex size-full rounded-full bg-[#ffd43b]" />
                <span className="relative size-2 rounded-full bg-[#ffd43b]" />
              </span>
              {panel.status}
            </span>
          </div>

          <div className="grid gap-3 p-3 sm:p-4">
            <div className="flex gap-3 rounded-[var(--radius-md)] border border-[#ffd43b]/30 bg-[#ffd43b]/10 p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[#ffd43b] text-[#111827]">
                <BellRing aria-hidden size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{panel.noticeTitle}</p>
                <p className="text-xs leading-5 text-white/75">{panel.noticeText}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {panel.rows.map((row, index) => {
                const live = row.progress < 100;
                return (
                  <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] px-3 py-2.5" key={row.title}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{row.title}</p>
                        <p className="mt-0.5 text-xs text-white/60">{row.meta}</p>
                      </div>
                      <p className={cn("shrink-0 text-xs font-semibold", live ? "text-[#8ea2ff]" : "text-[#ffd43b]")}>{row.state}</p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className={cn("h-full rounded-full", live ? "bg-[#4d6bff]" : "bg-[#ffd43b]")}
                        initial={reducedMotion ? false : { width: 0 }}
                        style={reducedMotion ? { width: `${row.progress}%` } : undefined}
                        transition={{ delay: 0.2 + index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        whileInView={reducedMotion ? undefined : { width: `${row.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] p-3">
                <p className="text-sm font-semibold">{panel.taskTitle}</p>
                <p className="mt-1 text-xs leading-5 text-white/70">{panel.taskText}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {panel.lanes.map((lane) => (
                  <div className="rounded-[var(--radius-sm)] bg-white/[0.05] px-2.5 py-2" key={lane.label}>
                    <p className="text-lg font-semibold leading-none tracking-tight text-[#ffd43b]">{lane.value}</p>
                    <p className="mt-1 text-[11px] text-white/65">{lane.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative grid grid-cols-3 gap-2 sm:grid-cols-5">
              <div className="pointer-events-none absolute left-6 right-6 top-1/2 hidden h-px -translate-y-3 bg-gradient-to-r from-transparent via-[#4d6bff]/80 to-transparent sm:block" />
              {panel.channels.map((item, index) => (
                <div className="relative flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border border-white/10 bg-[#111827] px-2 py-2.5 text-center" key={item.label}>
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-[var(--radius-sm)]",
                      index % 2 === 0 ? "bg-[#ffd43b] text-[#111827]" : "bg-[#4d6bff]/20 text-[#c9d4ff]"
                    )}
                  >
                    <Icon name={item.icon} size={16} />
                  </span>
                  <span className="text-[11px] font-semibold leading-4">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
