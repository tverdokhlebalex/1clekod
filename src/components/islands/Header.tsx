import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoMark } from "@/components/ui/LogoMark";
import { buttonClass } from "@/lib/ui";
import { cn } from "@/lib/cn";
import { withBase } from "@/lib/path";

type Item = { label: string; href: string };

type HeaderProps = {
  name: string;
  tagline: string;
  logo?: string;
  nav: Item[];
  cta: Item;
};

export function Header({ name, tagline, logo, nav, cta }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full max-w-[100vw] border-b transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none",
        scrolled
          ? "border-[var(--color-line)] bg-white/92 shadow-[var(--shadow-sm)] backdrop-blur-xl"
          : "border-transparent bg-[var(--color-page)]/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a className="flex min-w-0 items-center gap-2.5" href={withBase("/")}>
          {logo ? <img alt="" className="size-9 shrink-0 rounded-[8px] object-contain" src={withBase(logo)} /> : <LogoMark />}
          <span className="min-w-0">
            <span className="block text-base font-semibold tracking-tight text-[var(--color-ink)]">{name}</span>
            <span className="block truncate text-xs text-[var(--color-muted)]">{tagline}</span>
          </span>
        </a>

        <nav
          aria-label="Основная навигация"
          className="hidden items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-line)]/80 bg-white/80 p-1 shadow-[var(--shadow-xs)] backdrop-blur lg:flex"
        >
          {nav.map((item) => (
            <a
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-gold-soft)] hover:text-[var(--color-ink)] focus-visible:shadow-[var(--shadow-focus)]"
              href={withBase(item.href)}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a className={cn(buttonClass({ size: "md" }), "hidden sm:inline-flex")} href={withBase(cta.href)}>
            {cta.label}
            <ArrowRight aria-hidden size={18} />
          </a>
          <button
            aria-controls={menuId}
            aria-expanded={open}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white/90 text-[var(--color-ink)] shadow-[var(--shadow-xs)] lg:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            animate={reducedMotion ? undefined : { opacity: 1, height: "auto" }}
            className="overflow-hidden border-t border-[var(--color-line)] bg-white/95 backdrop-blur-xl lg:hidden"
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            id={menuId}
            initial={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto grid w-full max-w-7xl gap-1 px-4 py-3">
              {nav.map((item) => (
                <a
                  className="rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-gold-soft)]"
                  href={withBase(item.href)}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a className={cn(buttonClass({ size: "lg" }), "mt-2 w-full")} href={withBase(cta.href)} onClick={() => setOpen(false)}>
                {cta.label}
                <ArrowRight aria-hidden size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
