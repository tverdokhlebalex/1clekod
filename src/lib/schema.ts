import { z } from "zod";
import { iconNames, layouts } from "./icons";

// Pages CMS не записывает пустую строку и удаляет ключ. Необязательное поле тогда читается как "".
const optionalText = z.string().optional().default("");
const requiredText = z.string().min(1);

export const iconSchema = z.enum(iconNames);

export const buttonSchema = z.object({
  label: optionalText,
  href: optionalText
});

export const seoSchema = z.object({
  title: optionalText,
  description: optionalText
});

export const cardSchema = z.object({
  icon: iconSchema,
  title: optionalText,
  text: optionalText
});

export const siteSchema = z.object({
  name: requiredText,
  logo: optionalText,
  tagline: requiredText,
  url: z.url().optional().default("https://1clekod.ru"),
  locale: z.string().optional().default("ru_RU"),
  email: z.email(),
  legalName: optionalText,
  inn: optionalText,
  ogrn: optionalText,
  city: optionalText,
  metrikaId: optionalText,
  metrikaGoal: z.string().optional().default("lead_submit"),
  yandexVerification: optionalText,
  googleVerification: optionalText,
  ogImage: optionalText,
  headerButton: buttonSchema,
  nav: z.array(z.object({ label: optionalText, href: optionalText })).min(1),
  phones: z.array(
    z.object({
      label: optionalText,
      display: optionalText,
      href: optionalText
    })
  ),
  messengers: z.array(
    z.object({
      label: optionalText,
      display: optionalText,
      href: optionalText
    })
  ),
  addresses: z.array(z.object({ label: optionalText, value: optionalText })),
  footerText: requiredText,
  cookieText: optionalText,
  seo: seoSchema.extend({
    keywords: z.array(z.string()).optional().default([])
  })
});

const panelRowSchema = z.object({
  title: optionalText,
  meta: optionalText,
  state: optionalText,
  progress: z.number().min(0).max(100)
});

export const homeSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    eyebrow: optionalText,
    titleBefore: requiredText,
    titleAccent: requiredText,
    titleAfter: optionalText,
    description: requiredText,
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
    stats: z.array(z.object({ value: optionalText, label: optionalText })).min(1),
    panel: z.object({
      title: optionalText,
      status: optionalText,
      noticeTitle: optionalText,
      noticeText: optionalText,
      rows: z.array(panelRowSchema),
      lanes: z.array(z.object({ label: optionalText, value: optionalText })),
      taskTitle: optionalText,
      taskText: optionalText,
      channels: z.array(z.object({ label: optionalText, icon: iconSchema }))
    })
  }),
  problems: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    items: z.array(cardSchema)
  }),
  areas: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    items: z.array(cardSchema)
  }),
  services: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText
  }),
  integrations: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    items: z.array(
      cardSchema.extend({
        tag: optionalText,
        layout: z.enum(layouts),
        href: optionalText,
        outcome: optionalText
      })
    )
  }),
  process: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    sideBadge: optionalText,
    sideTitle: optionalText,
    sideText: optionalText,
    sideNote: optionalText,
    button: buttonSchema,
    steps: z.array(
      z.object({
        number: optionalText,
        icon: iconSchema,
        title: optionalText,
        text: optionalText,
        deliverable: optionalText
      })
    )
  }),
  tariffs: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText
  }),
  tasks: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    items: z.array(z.string()).optional().default([])
  }),
  reasons: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    items: z.array(cardSchema)
  }),
  related: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText
  }),
  cases: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    button: buttonSchema
  }),
  faq: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText
  }),
  cta: z.object({
    title: optionalText,
    description: optionalText,
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema
  }),
  contact: z.object({
    eyebrow: optionalText,
    title: optionalText,
    description: optionalText,
    points: z.array(z.string()).optional().default([]),
    formTitle: optionalText,
    submitLabel: optionalText,
    successTitle: optionalText,
    successText: optionalText
  })
});

export const tariffSchema = z.object({
  slug: requiredText,
  name: requiredText,
  price: optionalText,
  priceLabel: requiredText,
  priceNote: optionalText,
  description: optionalText,
  features: z.array(z.string()).optional().default([]),
  hourPacks: z.array(z.string()).optional().default([]),
  accent: z.boolean(),
  order: z.number(),
  button: buttonSchema
});

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number()
});

export const redirectSchema = z.object({
  from: z.string().startsWith("/"),
  to: z.string().min(1),
  status: z.union([z.literal(301), z.literal(302)]),
  enabled: z.boolean(),
  comment: optionalText
});

export const serviceSchema = z.object({
  title: requiredText,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tag: optionalText,
  summary: requiredText,
  outcome: optionalText,
  layout: z.enum(layouts),
  icon: iconSchema,
  group: z.enum(["primary", "related"]),
  order: z.number(),
  published: z.boolean().default(true),
  featuredOnHome: z.boolean().default(true),
  heroLead: optionalText,
  benefits: z.array(z.object({ title: optionalText, text: optionalText })).optional().default([]),
  steps: z.array(z.object({ title: optionalText, text: optionalText })).optional().default([]),
  faq: z.array(z.object({ question: optionalText, answer: optionalText })).optional().default([]),
  seoTitle: requiredText,
  seoDescription: requiredText,
  cover: optionalText,
  primaryButton: buttonSchema,
  secondaryButton: buttonSchema
});

export const caseSchema = z.object({
  title: requiredText,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: optionalText,
  industry: optionalText,
  summary: optionalText,
  result: optionalText,
  serviceSlug: optionalText,
  order: z.number(),
  published: z.boolean().default(true),
  cover: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText
});

export const legalSchema = z.object({
  title: requiredText,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Укажите телефон")
    .refine((value) => value.replace(/\D/g, "").length >= 10, "Укажите телефон целиком"),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((value) => value === "" || z.email().safeParse(value).success, "Укажите корректный email"),
  company: z.string().trim().max(120),
  message: z.string().trim().min(10, "Опишите задачу хотя бы в нескольких словах").max(2000),
  format: z.string().trim().max(80),
  service: z.string().trim().max(120),
  website: z.string().max(200),
  consent: z.literal(true, { error: "Нужно согласие на обработку данных" }),
  page: z.string().max(300).optional(),
  referrer: z.string().max(300).optional(),
  utm: z
    .object({
      utm_source: z.string().max(120).optional(),
      utm_medium: z.string().max(120).optional(),
      utm_campaign: z.string().max(120).optional(),
      utm_content: z.string().max(120).optional(),
      utm_term: z.string().max(120).optional(),
      yclid: z.string().max(120).optional(),
      landing: z.string().max(300).optional()
    })
    .optional()
});

export type LeadInput = z.infer<typeof leadSchema>;
export type SiteContent = z.infer<typeof siteSchema>;
export type HomeContent = z.infer<typeof homeSchema>;
export type Tariff = z.infer<typeof tariffSchema>;
export type FaqItem = z.infer<typeof faqSchema>;
