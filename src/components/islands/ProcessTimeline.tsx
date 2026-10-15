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
    offset: ["start 0.82", "end 0.42"]
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.06, 1]);

  return (
    <div className="home-process" ref={ref}>
      <span aria-hidden="true" className="home-process__rail">
        {reducedMotion ? (
          <span className="home-process__fill home-process__fill--static" />
        ) : (
          <motion.span className="home-process__fill" style={{ scaleY }} />
        )}
      </span>
      <ol className="home-process__list">
      {steps.map((step) => (
        <li className="home-process__item" key={step.number}>
          <span className="home-process__mark">{step.number}</span>
          <div className="home-process__body">
            <div className="home-process__heading">
              <span aria-hidden="true" className="home-process__icon">
                <Icon name={step.icon} size={18} />
              </span>
              <h3>{step.title}</h3>
            </div>
            <p className="home-process__text">{step.text}</p>
            <p className="home-process__out">{step.deliverable}</p>
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
