import { cn } from "./cn";

type ButtonStyle = {
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "md" | "lg";
  className?: string;
};

const variants = {
  primary:
    "bg-brand text-[var(--color-ink)] shadow-[0_12px_30px_rgb(245_184_0_/_0.35)] hover:shadow-[0_16px_36px_rgb(255_212_59_/_0.45)]",
  secondary:
    "border border-[var(--color-line)] bg-white text-[var(--color-ink)] shadow-[var(--shadow-xs)] hover:border-[var(--color-amber)] hover:bg-[var(--color-gold-soft)]",
  ghost: "text-[var(--color-gold-deep)] hover:bg-[var(--color-gold-soft)]",
  glass:
    "border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] shadow-[var(--shadow-xs)] backdrop-blur-md hover:border-[var(--color-amber)] hover:bg-white"
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base"
};

export function buttonClass({ variant = "primary", size = "md", className }: ButtonStyle = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition duration-300 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none",
    sizes[size],
    variants[variant],
    variant !== "glass" && "hover:-translate-y-0.5 active:translate-y-0 motion-reduce:hover:translate-y-0",
    className
  );
}
