// Inhaltsmodell. Jede Sammlung entspricht einem Bereich in /admin.
// Bilder liegen unter public/uploads/ und werden als Pfad (/uploads/…) gespeichert.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Alte Adressen der WordPress-Seite, die auf diesen Eintrag umleiten sollen (z. B. "/light-table/").
const legacyPaths = z.array(z.string()).default([]);

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),              // Reihenfolge in der Liste, 1 = oben
    year: z.number().optional(),    // Jahr, aus dem WordPress-Datum übernommen
    semester: z.string().optional(),
    demo: z.string().optional(),    // Pfad zu einer interaktiven Demo unter public/demos/
    draft: z.boolean().default(false),
    legacyPaths,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    legacyPaths,
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    label: z.string().optional(),   // kurze Angabe unter dem Namen, sonst die Domain
    logo: z.string().optional(),
    order: z.number(),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.json', base: './src/content/settings' }),
  schema: z.object({
    introDe: z.string(),
    introEn: z.string(),
    cards: z.array(z.object({ title: z.string(), text: z.string() })),
    highlight: z.string(),
    motto: z.string(),
  }),
});

const projectsPage = defineCollection({
  loader: glob({ pattern: 'projects.json', base: './src/content/settings' }),
  schema: z.object({
    opportunitiesTitle: z.string(),
    opportunities: z.array(z.string()),
    opportunitiesCta: z.string(),
  }),
});

export const collections = { projects, pages, partners, home, projectsPage };
