import { getCollection } from "astro:content";
import faqData from "../data/faq.json";
import homeData from "../data/home.json";
import redirectsData from "../data/redirects.json";
import siteData from "../data/site.json";
import tariffsData from "../data/tariffs.json";
import { caseSchema, faqSchema, homeSchema, legalSchema, redirectSchema, serviceSchema, siteSchema, tariffSchema } from "./schema";

function parse<T>(schema: { parse: (value: unknown) => T }, data: unknown, file: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "неизвестная ошибка";
    throw new Error(`Проверьте ${file}: ${message}`);
  }
}

export function getSite() {
  return parse(siteSchema, siteData, "src/data/site.json");
}

export function getHome() {
  return parse(homeSchema, homeData, "src/data/home.json");
}

export function getTariffs() {
  return tariffSchema.array().parse(tariffsData).sort((a, b) => a.order - b.order);
}

export function getFaq() {
  return faqSchema.array().parse(faqData).sort((a, b) => a.order - b.order);
}

export function getRedirects() {
  return redirectSchema.array().parse(redirectsData);
}

type RawEntry = {
  id: string;
  data: unknown;
  body?: string;
  collection: string;
  filePath?: string;
};

function withData<T>(entries: RawEntry[], schema: { parse: (value: unknown) => T }) {
  return entries.map((entry) => ({ ...entry, data: schema.parse(entry.data) }));
}

export async function getServices() {
  const entries = (await getCollection("services")) as RawEntry[];
  return withData(entries, serviceSchema)
    .filter((entry) => entry.data.published)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getCases() {
  const entries = (await getCollection("cases")) as RawEntry[];
  return withData(entries, caseSchema)
    .filter((entry) => entry.data.published)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getLegalPages() {
  const entries = (await getCollection("legal")) as RawEntry[];
  return withData(entries, legalSchema);
}

export function metrikaId(site = getSite()) {
  return import.meta.env.PUBLIC_YANDEX_METRIKA_ID || site.metrikaId;
}
