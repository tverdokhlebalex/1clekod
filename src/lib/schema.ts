import { z } from "zod";
import { iconNames, layouts } from "./icons";

export const iconSchema = z.enum(iconNames);

export const buttonSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1)
});

export const seoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1)
});

export const cardSchema = z.object({
  icon: iconSchema,
  title: z.string().min(1),
  text: z.string().min(1)
});

export const siteSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional().default(""),
  tagline: z.string().min(1),
  url: z.url(),
  locale: z.string().min(1),
  email: z.email(),
  legalName: z.string(),
  inn: z.string(),
  ogrn: z.string(),
  city: z.string(),
  metrikaId: z.string(),
  metrikaGoal: z.string().min(1),
  yandexVerification: z.string(),
  googleVerification: z.string(),
  ogImage: z.string(),
  headerButton: buttonSchema,
  nav: z.array(z.object({ label: z.string().min(1), href: z.string().min(1) })).min(1),
  phones: z.array(
    z.object({
      label: z.string().min(1),
      display: z.string().min(1),
      href: z.string().min(1)
    })
  ),
  messengers: z.array(
    z.object({
      label: z.string().min(1),
      display: z.string().min(1),
      href: z.string().min(1)
    })
  ),
  addresses: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })),
  footerText: z.string().min(1),
  cookieText: z.string().min(1),
  seo: seoSchema.extend({
    keywords: z.array(z.string())
  })
});

const panelRowSchema = z.object({
  title: z.string(),
  meta: z.string(),
  state: z.string(),
  progress: z.number().min(0).max(100)
});

export const homeSchema = z.object({
  seo: seoSchema,
  hero: z.object({
    eyebrow: z.string(),
    titleBefore: z.string(),
    titleAccent: z.string(),
    titleAfter: z.string(),
    description: z.string(),
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
    stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
    panel: z.object({
      title: z.string(),
      status: z.string(),
      noticeTitle: z.string(),
      noticeText: z.string(),
      rows: z.array(panelRowSchema),
      lanes: z.array(z.object({ label: z.string(), value: z.string() })),
      taskTitle: z.string(),
      taskText: z.string(),
      channels: z.array(z.object({ label: z.string(), icon: iconSchema }))
    })
  }),
  problems: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(cardSchema)
  }),
  areas: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(cardSchema)
  }),
  services: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string()
  }),
  integrations: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(
      cardSchema.extend({
        tag: z.string(),
        layout: z.enum(layouts),
        href: z.string(),
        outcome: z.string()
      })
    )
  }),
  process: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    sideBadge: z.string(),
    sideTitle: z.string(),
    sideText: z.string(),
    sideNote: z.string(),
    button: buttonSchema,
    steps: z.array(
      z.object({
        number: z.string(),
        icon: iconSchema,
        title: z.string(),
        text: z.string(),
        deliverable: z.string()
      })
    )
  }),
  tariffs: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string()
  }),
  tasks: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(z.string())
  }),
  reasons: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    items: z.array(cardSchema)
  }),
  related: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string()
  }),
  cases: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    button: buttonSchema
  }),
  faq: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string()
  }),
  cta: z.object({
    title: z.string(),
    description: z.string(),
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    points: z.array(z.string()),
    formTitle: z.string(),
    submitLabel: z.string(),
    successTitle: z.string(),
    successText: z.string()
  })
});

export const tariffSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.string().optional().default(""),
  priceLabel: z.string().min(1),
  priceNote: z.string(),
  description: z.string().min(1),
  features: z.array(z.string()),
  hourPacks: z.array(z.string()),
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
  comment: z.string()
});

export const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  tag: z.string(),
  summary: z.string(),
  outcome: z.string(),
  layout: z.enum(layouts),
  icon: iconSchema,
  group: z.enum(["primary", "related"]),
  order: z.number(),
  published: z.boolean().default(true),
  featuredOnHome: z.boolean().default(true),
  heroLead: z.string(),
  benefits: z.array(z.object({ title: z.string(), text: z.string() })),
  steps: z.array(z.object({ title: z.string(), text: z.string() })),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  seoTitle: z.string(),
  seoDescription: z.string(),
  cover: z.string().default(""),
  primaryButton: buttonSchema,
  secondaryButton: buttonSchema
});

export const caseSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  client: z.string(),
  industry: z.string(),
  summary: z.string(),
  result: z.string(),
  serviceSlug: z.string(),
  order: z.number(),
  published: z.boolean().default(true),
  cover: z.string().default(""),
  seoTitle: z.string(),
  seoDescription: z.string()
});

export const legalSchema = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string()
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
