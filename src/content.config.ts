import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { caseSchema, legalSchema, serviceSchema } from "./lib/schema";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: serviceSchema
});

const cases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: caseSchema
});

const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: legalSchema
});

export const collections = { services, cases, legal };
