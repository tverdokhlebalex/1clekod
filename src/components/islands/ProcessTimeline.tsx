import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/icons";

export type ProcessStep = {
  number: string;
  icon: IconName;
  title: string;
  text: string;
  deliverable: string;
};

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"]
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative" ref={ref}>
      {!reducedMotion && (
        <div className="absolute bottom-4 left-[1.125rem] top-4 hidden w-px overflow-hidden bg-[var(--color-gold-soft)] sm:block">
          <motion.div className="h-full w-full origin-top bg-brand" style={{ scaleY }} />
        </div>
      )}
      <ol className="grid gap-5">
        {steps.map((step, index) => (
          <li className="reveal relative sm:pl-14" key={step.number}>
            <span className="mb-3 grid size-9 place-items-center rounded-full border-4 border-white bg-brand text-xs font-bold text-[var(--color-ink)] shadow-[var(--shadow-sm)] sm:absolute sm:left-0 sm:top-6 sm:mb-0">
              {step.number}
            </span>
            <article className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:border-[var(--color-amber)] hover:shadow-[var(--shadow-glow)] motion-reduce:hover:translate-y-0">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-gold-soft)] text-[var(--color-gold-deep)]">
                  <Icon name={step.icon} size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">
                    Этап {String(index + 1).padStart(2, "0")}. {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{step.text}</p>
                  <p className="mt-3 text-sm font-medium text-[var(--color-gold-deep)]">{step.deliverable}</p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
