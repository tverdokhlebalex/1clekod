import { useEffect, useId, useState } from "react";
import { leadSchema, type LeadInput } from "@/lib/schema";

type Option = { slug: string; name: string };

type ContactFormProps = {
  formTitle: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  tariffs: Option[];
  services: Option[];
  defaultFormat?: string;
  defaultService?: string;
  metrikaId?: string;
  metrikaGoal?: string;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
  format: string;
  service: string;
  website: string;
  consent: boolean;
};

const empty: FormState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  message: "",
  format: "",
  service: "",
  website: "",
  consent: false
};

const fieldClass =
  "h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white px-4 text-base text-[var(--color-ink)] shadow-[var(--shadow-xs)] outline-none transition placeholder:text-[var(--color-subtle)] focus:border-[var(--color-gold)] focus:shadow-[var(--shadow-focus)] sm:text-sm";

function readAttribution() {
  try {
    const raw = sessionStorage.getItem("lekod-attribution");
    return raw ? (JSON.parse(raw) as LeadInput["utm"]) : undefined;
  } catch {
    return undefined;
  }
}

function reachGoal(id?: string, goal?: string) {
  if (!id || !goal) return;
  const ym = (window as Window & { ym?: (...args: unknown[]) => void }).ym;
  if (typeof ym === "function") {
    ym(Number(id), "reachGoal", goal);
  }
}

export function ContactForm({
  formTitle,
  submitLabel,
  successTitle,
  successText,
  tariffs,
  services,
  defaultFormat = "",
  defaultService = "",
  metrikaId = "",
  metrikaGoal = "lead_submit"
}: ContactFormProps) {
  const id = useId();
  const [values, setValues] = useState<FormState>({ ...empty, format: defaultFormat, service: defaultService });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const format = params.get("format") || defaultFormat;
    const service = params.get("usluga") || defaultService;
    setValues((current) => ({ ...current, format, service }));
  }, [defaultFormat, defaultService]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setFormError("");
    const parsed = leadSchema.safeParse({
      ...values,
      page: window.location.href,
      referrer: document.referrer,
      utm: readAttribution()
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !payload?.ok) {
        setFormError(payload?.message || "Не удалось отправить заявку. Позвоните нам, если вопрос срочный.");
        return;
      }
      reachGoal(metrikaId, metrikaGoal);
      setDone(true);
    } catch {
      setFormError("Нет связи с сервером. Проверьте интернет или позвоните.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[rgb(226_177_0_/_0.35)] bg-[var(--color-gold-soft)] p-6" role="status">
        <h3 className="text-2xl font-semibold">{successTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{successText}</p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={onSubmit}>
      <h3 className="text-xl font-semibold">{formTitle}</h3>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-name`}>
        Имя
        <input className={fieldClass} id={`${id}-name`} name="name" autoComplete="name" value={values.name} onChange={(event) => set("name", event.target.value)} />
        {errors.name && <span className="text-sm font-normal text-[#9a3412]">{errors.name}</span>}
      </label>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-phone`}>
        Телефон
        <input className={fieldClass} id={`${id}-phone`} name="phone" autoComplete="tel" inputMode="tel" value={values.phone} onChange={(event) => set("phone", event.target.value)} />
        {errors.phone && <span className="text-sm font-normal text-[#9a3412]">{errors.phone}</span>}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-email`}>
          Email, если удобно
          <input className={fieldClass} id={`${id}-email`} name="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} />
          {errors.email && <span className="text-sm font-normal text-[#9a3412]">{errors.email}</span>}
        </label>
        <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-company`}>
          Компания
          <input className={fieldClass} id={`${id}-company`} name="company" autoComplete="organization" value={values.company} onChange={(event) => set("company", event.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-format`}>
          Формат
          <select className={fieldClass} id={`${id}-format`} name="format" value={values.format} onChange={(event) => set("format", event.target.value)}>
            <option value="">Пока не выбрал</option>
            {tariffs.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-service`}>
          Услуга
          <select className={fieldClass} id={`${id}-service`} name="service" value={values.service} onChange={(event) => set("service", event.target.value)}>
            <option value="">Не важно</option>
            {services.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-medium" htmlFor={`${id}-message`}>
        Что случилось
        <textarea
          className={`${fieldClass} h-28 py-3`}
          id={`${id}-message`}
          name="message"
          value={values.message}
          onChange={(event) => set("message", event.target.value)}
        />
        {errors.message && <span className="text-sm font-normal text-[#9a3412]">{errors.message}</span>}
      </label>
      <div className="hp" aria-hidden="true" inert>
        <label htmlFor={`${id}-website`}>
          Сайт
          <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => set("website", event.target.value)} />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-muted)]">
        <input
          className="mt-1 size-4 accent-[var(--color-gold-deep)]"
          checked={values.consent}
          name="consent"
          type="checkbox"
          onChange={(event) => set("consent", event.target.checked)}
        />
        <span>
          Соглашаюсь на обработку персональных данных и принимаю{" "}
          <a className="font-semibold text-[var(--color-gold-deep)] underline" href="/privacy">
            политику
          </a>{" "}
          и{" "}
          <a className="font-semibold text-[var(--color-gold-deep)] underline" href="/consent">
            согласие
          </a>
          .
        </span>
      </label>
      {errors.consent && <p className="text-sm text-[#9a3412]">{errors.consent}</p>}
      {formError && (
        <p className="text-sm text-[#9a3412]" role="alert">
          {formError}
        </p>
      )}
      <button
        className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] bg-brand px-6 font-semibold text-[var(--color-ink)] shadow-[0_14px_36px_rgb(184_134_11_/_0.28)] transition hover:-translate-y-0.5 disabled:opacity-60 motion-reduce:hover:translate-y-0"
        disabled={pending}
        type="submit"
      >
        {pending ? "Отправляем" : submitLabel}
      </button>
    </form>
  );
}
