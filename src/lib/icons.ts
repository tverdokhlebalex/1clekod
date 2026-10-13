export const iconNames = [
  "headset",
  "wrench",
  "arrow-left-right",
  "plug",
  "clipboard-check",
  "siren",
  "globe",
  "warehouse",
  "rocket",
  "messages",
  "shield",
  "timer",
  "database",
  "file-check",
  "workflow",
  "chart",
  "users",
  "badge",
  "gauge",
  "building",
  "phone",
  "mail",
  "spark",
  "search",
  "boxes",
  "link",
  "server",
  "circle-dollar"
] as const;

export type IconName = (typeof iconNames)[number];

export const layouts = ["featured", "tall", "default", "banner"] as const;
export type BentoLayout = (typeof layouts)[number];
