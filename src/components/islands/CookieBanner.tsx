import { useEffect, useState } from "react";

const STORAGE_KEY = "lekod-cookie-consent";

export function CookieBanner({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Уведомление об использовании cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--color-line)] bg-white/95 p-4 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:p-5"
      role="dialog"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          {text}{" "}
          <a className="font-semibold text-[var(--color-gold-deep)] underline" href="/cookies">
            Подробнее
          </a>
        </p>
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-[var(--color-ink)]"
          onClick={() => {
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* остаётся скрытым до перезагрузки */
            }
            setVisible(false);
          }}
          type="button"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
