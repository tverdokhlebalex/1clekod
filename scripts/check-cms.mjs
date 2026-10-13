import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";

const root = process.cwd();
const config = parse(readFileSync(join(root, ".pages.yml"), "utf8"));
const mediaInput = typeof config.media === "string" ? config.media : config.media?.input;

if (!mediaInput || !existsSync(join(root, mediaInput))) {
  throw new Error("В .pages.yml не найдена папка медиа");
}

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
        for (const field of entry.fields ?? []) {
          if (!field.required) continue;
          const value = field.name === "body" ? body : data?.[field.name];
          if (value === undefined || value === null || value === "") {
            throw new Error(`${entry.path}/${file}: заполните «${field.label || field.name}»`);
          }
        }
      }
    }

    if (entry.type === "file" && entry.path.endsWith(".json")) {
      const data = JSON.parse(readFileSync(join(root, entry.path), "utf8"));
      const sample = entry.list ? data[0] : data;
      if (entry.list && !Array.isArray(data)) {
        throw new Error(`${entry.path} должен быть списком`);
      }
      if (!entry.list && (!sample || Array.isArray(sample))) {
        throw new Error(`${entry.path} должен быть карточкой настроек`);
      }
      for (const field of entry.fields ?? []) {
        if (field.required && sample && !(field.name in sample)) {
          throw new Error(`${entry.path}: нет обязательного поля «${field.label || field.name}»`);
        }
      }
    }
  }
}

walk(config.content);
console.log("Pages CMS: разделы, пути и обязательные поля на месте");
