import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { disciplineValues } from './utils/disciplines';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3),
    summary: z.string().min(30).max(220),
    headline: z.string().min(20).max(100),
    intro: z.string().min(40).max(320),
    discipline: z.enum(disciplineValues),
    order: z.number().int().positive(),
    featured: z.boolean().default(false),
    problems: z.array(z.string().min(15)).min(2).max(5),
    scope: z
      .array(
        z.object({
          title: z.string().min(3).max(60),
          description: z.string().min(20).max(220),
        }),
      )
      .min(3)
      .max(6),
    deliverables: z.array(z.string().min(10)).min(3).max(6),
    flow: z.object({
      input: z.string().min(3).max(50),
      analysis: z.string().min(3).max(50),
      output: z.string().min(3).max(50),
    }),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z
    .object({
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      title: z.string().min(5),
      headline: z.string().min(20).max(110).optional(),
      summary: z.string().min(30).max(260),
      discipline: z.enum(disciplineValues),
      relatedDisciplines: z.array(z.enum(disciplineValues)).default([]),
      publicationStatus: z.enum(['draft', 'published']).default('draft'),
      approvedForPublication: z.boolean().default(false),
      featured: z.boolean().default(false),
      year: z.number().int().min(1900).max(2100).optional(),
      location: z.string().optional(),
      client: z.string().optional(),
      need: z.string().min(30).max(500).optional(),
      scope: z.array(z.string().min(15).max(220)).min(2).max(8).optional(),
      methodology: z.array(z.string().min(15).max(220)).min(2).max(8).optional(),
      results: z.array(z.string().min(15).max(220)).min(1).max(8).optional(),
      tools: z.array(z.string().min(2).max(80)).max(12).default([]),
      standards: z.array(z.string().min(2).max(120)).max(12).default([]),
      media: z
        .array(
          z.object({
            type: z.enum(['image', 'video', 'plan', 'document']),
            src: z.string().startsWith('/'),
            alt: z.string().min(10).max(240),
            caption: z.string().min(10).max(300).optional(),
            width: z.number().int().positive().optional(),
            height: z.number().int().positive().optional(),
            layout: z.enum(['standard', 'wide']).default('standard'),
            poster: z.string().startsWith('/').optional(),
            captionsSrc: z.string().startsWith('/').optional(),
            transcript: z.string().min(30).optional(),
          }),
        )
        .default([]),
    })
    .superRefine((project, context) => {
      if (project.publicationStatus !== 'published' || !project.approvedForPublication) return;

      const requiredFields = [
        'headline',
        'year',
        'need',
        'scope',
        'methodology',
        'results',
      ] as const;
      for (const field of requiredFields) {
        if (project[field] === undefined) {
          context.addIssue({
            code: 'custom',
            path: [field],
            message: `El campo ${field} es obligatorio para publicar un proyecto autorizado.`,
          });
        }
      }

      project.media.forEach((medium, index) => {
        if (medium.type === 'image' && (!medium.width || !medium.height)) {
          context.addIssue({
            code: 'custom',
            path: ['media', index],
            message: 'Cada imagen publicada necesita ancho y alto para evitar saltos de contenido.',
          });
        }

        if (medium.type === 'video' && !medium.captionsSrc && !medium.transcript) {
          context.addIssue({
            code: 'custom',
            path: ['media', index],
            message: 'Cada video publicado necesita subtítulos o una transcripción.',
          });
        }
      });
    }),
});

export const collections = { services, projects };
