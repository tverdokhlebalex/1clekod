import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createJiti } from "jiti";
import { parse } from "yaml";

const root = process.cwd();
const config = parse(readFileSync(join(root, ".pages.yml"), "utf8"));
const mediaInput = typeof config.media === "string" ? config.media : config.media?.input;

if (!mediaInput || !existsSync(join(root, mediaInput))) {
  throw new Error("В .pages.yml не найдена папка медиа");
}

const components = config.components ?? {};

function isBlank(value) {
  return value === undefined || value === null || value === "";
}

function fieldSpec(field) {
  if (!field.component) return field;
  return { ...components[field.component], ...field };
}

function checkFields(fields, data, location) {
  if (!data || typeof data !== "object") return;
  for (const field of fields ?? []) {
    const spec = fieldSpec(field);
    const value = field.name === "body" ? data.body : data[field.name];
    if (field.required && isBlank(value)) {
      throw new Error(`${location}: заполните «${field.label || field.name}»`);
    }
    if (!spec.fields || value == null) continue;
    const listed = Boolean(field.list || spec.list);
    const items = listed ? value : [value];
    if (!Array.isArray(items)) continue;
    items.forEach((item, index) => {
      checkFields(spec.fields, item, `${location} / ${field.label || field.name}${listed ? ` ${index + 1}` : ""}`);
    });
  }
}

function omitEmptyStrings(value) {
  if (Array.isArray(value)) return value.map(omitEmptyStrings);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== "")
      .map(([key, item]) => [key, omitEmptyStrings(item)])
  );
}

function omitOptionalText(data, fields) {
  if (!data || typeof data !== "object") return;
  for (const field of fields ?? []) {
    const spec = fieldSpec(field);
    const kind = spec.type;
    const textual = kind === "string" || kind === "text" || kind === "image";
    if (textual && !field.required && field.name !== "slug" && field.name in data) {
      delete data[field.name];
      continue;
    }
    if (!spec.fields || data[field.name] == null) continue;
    const listed = Boolean(field.list || spec.list);
    const items = listed ? data[field.name] : [data[field.name]];
    if (!Array.isArray(items)) continue;
    for (const item of items) omitOptionalText(item, spec.fields);
  }
}

const records = [];

function walk(entries) {
  for (const entry of entries ?? []) {
    if (entry.type === "group") {
      walk(entry.items);
      continue;
    }

    if (!entry.path || !existsSync(join(root, entry.path))) {
      throw new Error(`Нет файла или папки для раздела «${entry.label || entry.name}»: ${entry.path}`);
    }

    if (entry.type === "collection" && !statSync(join(root, entry.path)).isDirectory()) {
      throw new Error(`Раздел «${entry.label}» должен быть папкой`);
    }

    if (entry.type === "collection") {
      const files = readdirSync(join(root, entry.path)).filter((name) => name.endsWith(".md"));
      if (files.length === 0) throw new Error(`В разделе «${entry.label}» нет страниц`);
      for (const file of files) {
        const raw = readFileSync(join(root, entry.path, file), "utf8");
        const matched = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (!matched) throw new Error(`${entry.path}/${file}: нет шапки страницы`);
        const data = parse(matched[1]);
        const body = matched[2].trim();
        checkFields(entry.fields, { ...data, body }, `${entry.path}/${file}`);
        records.push({ entry, location: `${entry.path}/${file}`, data });
      }
    }

    if (entry.type === "file" && entry.path.endsWith(".json")) {
      const data = JSON.parse(readFileSync(join(root, entry.path), "utf8"));
      if (entry.list && !Array.isArray(data)) {
        throw new Error(`${entry.path} должен быть списком`);
      }
      if (!entry.list && (!data || Array.isArray(data))) {
        throw new Error(`${entry.path} должен быть карточкой настроек`);
      }
      const items = entry.list ? data : [data];
      items.forEach((item, index) => {
        checkFields(entry.fields, item, `${entry.path}${entry.list ? ` / ${index + 1}` : ""}`);
      });
      records.push({ entry, location: entry.path, data });
    }
  }
}

walk(config.content);

const jiti = createJiti(import.meta.url);
const schemas = await jiti.import("../src/lib/schema.ts");
const schemaByName = {
  site: schemas.siteSchema,
  home: schemas.homeSchema,
  tariffs: schemas.tariffSchema.array(),
  faq: schemas.faqSchema.array(),
  redirects: schemas.redirectSchema.array(),
  services: schemas.serviceSchema,
  cases: schemas.caseSchema,
  legal: schemas.legalSchema
};

function parseRecord(record, data) {
  const schema = schemaByName[record.entry.name];
  if (!schema) throw new Error(`Нет схемы для раздела «${record.entry.label || record.entry.name}»`);
  schema.parse(data);
}

for (const record of records) {
  parseRecord(record, record.data);
  parseRecord(record, omitEmptyStrings(structuredClone(record.data)));
  const withoutOptionalText = structuredClone(record.data);
  omitOptionalText(withoutOptionalText, record.entry.fields);
  parseRecord(record, withoutOptionalText);
}

const home = records.find((record) => record.entry.name === "home");
const brokenHome = structuredClone(home.data);
delete brokenHome.hero.titleBefore;
if (schemas.homeSchema.safeParse(brokenHome).success) {
  throw new Error("Пустой обязательный заголовок H1 не должен проходить проверку");
}

console.log("Pages CMS: разделы, пути и обязательные поля на месте");
