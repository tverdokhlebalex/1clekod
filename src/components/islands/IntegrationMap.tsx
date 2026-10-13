import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";

type Node = {
  title: string;
  tag: string;
  text: string;
  outcome: string;
  href: string;
  icon: IconName;
};

const spots = [
  { left: "8%", top: "8%" },
  { left: "62%", top: "4%" },
  { left: "0%", top: "40%" },
  { left: "72%", top: "38%" },
  { left: "10%", top: "74%" },
  { left: "60%", top: "72%" }
];

export function IntegrationMap({ items }: { items: Node[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);
  const [active, setActive] = useState(0);
  const labelId = useId();
  const current = items[active] ?? items[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const hub = hubRef.current;
      const bounds = root.getBoundingClientRect();
      if (!hub || bounds.width === 0) return;
      const hubBox = hub.getBoundingClientRect();
      const next = items.map((_, index) => {
        const node = nodeRefs.current[index];
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return {
          x1: hubBox.left + hubBox.width / 2 - bounds.left,
          y1: hubBox.top + hubBox.height / 2 - bounds.top,
          x2: box.left + box.width / 2 - bounds.left,
          y2: box.top + box.height / 2 - bounds.top
        };
      });
      setLines(next.filter((line): line is { x1: number; y1: number; x2: number; y2: number } => line !== null));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  return (
    <div>
      <div className="relative mx-auto hidden h-[34rem] max-w-5xl lg:block" ref={rootRef}>
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          {lines.map((line, index) => (
            <line
              className={index === active ? "dash-flow" : undefined}
              key={`${line.x2}-${line.y2}`}
              stroke={index === active ? "#FFD43B" : "#4D6BFF"}
              strokeLinecap="round"
              strokeOpacity={index === active ? 0.95 : 0.45}
              strokeWidth={index === active ? 2.4 : 1.4}
              x1={line.x1}
              x2={line.x2}
              y1={line.y1}
              y2={line.y2}
            />
          ))}
        </svg>
        <div
          className="absolute left-1/2 top-1/2 z-10 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[var(--radius-xl)] bg-[#ffd43b] text-[#111827] shadow-[0_0_48px_rgb(255_212_59_/_0.35)]"
          ref={hubRef}
        >
          <div className="text-center">
            <p className="text-3xl font-semibold tracking-tight">1С</p>
            <p className="text-xs font-medium">учёт</p>
          </div>
        </div>
        {items.slice(0, 6).map((item, index) => (
          <a
            className={`absolute z-10 w-48 rounded-[var(--radius-lg)] border px-4 py-3 transition focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] ${
              active === index ? "border-[#ffd43b] bg-[#1c2636]" : "border-white/10 bg-[#161e2e] hover:border-white/30"
            }`}
            href={item.href}
            key={item.href + item.title}
            onBlur={() => setActive(index)}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
            style={{ left: spots[index]?.left, top: spots[index]?.top }}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Icon className={index === active ? "text-[#ffd43b]" : "text-[#9aafff]"} name={item.icon} size={16} />
              {item.title}
            </span>
            <span className="mt-1 block text-xs text-white/65">{item.tag}</span>
          </a>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
        <div className="grid place-items-center rounded-[var(--radius-lg)] bg-[#ffd43b] px-4 py-5 text-center text-[#111827] sm:col-span-2">
          <p className="text-2xl font-semibold">1С</p>
          <p className="text-sm">учёт в центре</p>
        </div>
        {items.map((item, index) => (
          <a
            className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] px-4 py-3"
            href={item.href}
            key={item.title}
            onClick={() => setActive(index)}
          >
            <span className="font-semibold">{item.title}</span>
            <span className="mt-1 block text-sm text-white/70">{item.outcome}</span>
          </a>
        ))}
      </div>

      {current && (
        <div aria-live="polite" className="mx-auto mt-6 hidden max-w-2xl text-center lg:block" id={labelId}>
          <p className="text-base text-white/80">{current.text}</p>
          <p className="mt-2 text-sm font-medium text-[#ffd43b]">{current.outcome}</p>
        </div>
      )}
    </div>
  );
}
