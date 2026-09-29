import { describe, expect, it } from 'vitest';
import {
  filterProjects,
  isPublicProject,
  slugify,
  type ProjectSummary,
} from '../../src/utils/content';

const projects: ProjectSummary[] = [
  {
    title: 'Red hidrosanitaria',
    discipline: 'hydrosanitary',
    approvedForPublication: true,
    publicationStatus: 'published',
    year: 2024,
  },
  {
    title: 'Sistema contra incendio',
    discipline: 'fire-protection',
    approvedForPublication: true,
    publicationStatus: 'published',
    year: 2025,
  },
  {
    title: 'Proyecto reservado',
    discipline: 'hydrology',
    approvedForPublication: false,
    publicationStatus: 'draft',
    year: 2026,
  },
];

describe('slugify', () => {
  it('normaliza tildes y separadores para una URL estable', () => {
    expect(slugify('Hidráulica e Ingeniería de Ríos')).toBe('hidraulica-e-ingenieria-de-rios');
  });
});

describe('filterProjects', () => {
  it('exige publicación y autorización al mismo tiempo', () => {
    expect(isPublicProject({ publicationStatus: 'published', approvedForPublication: true })).toBe(
      true,
    );
    expect(isPublicProject({ publicationStatus: 'published', approvedForPublication: false })).toBe(
      false,
    );
    expect(isPublicProject({ publicationStatus: 'draft', approvedForPublication: true })).toBe(
      false,
    );
  });

  it('excluye borradores y ordena los publicados por año', () => {
    expect(filterProjects(projects).map((project) => project.title)).toEqual([
      'Sistema contra incendio',
      'Red hidrosanitaria',
    ]);
  });

  it('filtra por disciplina sin exponer borradores', () => {
    expect(filterProjects(projects, { discipline: 'hydrosanitary' })).toHaveLength(1);
    expect(filterProjects(projects, { discipline: 'hydrology' })).toHaveLength(0);
  });

  it('incluye disciplinas relacionadas y exige aprobación', () => {
    const relatedProject: ProjectSummary = {
      title: 'Proyecto multidisciplinario',
      discipline: 'aqueducts',
      relatedDisciplines: ['hydrology'],
      publicationStatus: 'published',
      approvedForPublication: true,
      year: 2023,
    };
    const unapprovedProject: ProjectSummary = {
      title: 'Proyecto sin autorización',
      discipline: 'hydrology',
      publicationStatus: 'published',
      approvedForPublication: false,
      year: 2025,
    };

    expect(
      filterProjects([...projects, relatedProject, unapprovedProject], {
        discipline: 'hydrology',
      }),
    ).toEqual([relatedProject]);
  });

  it('combina búsqueda y tipo de evidencia', () => {
    const projectWithMedia: ProjectSummary = {
      title: 'Optimización de red matriz',
      summary: 'Análisis hidráulico y comparación de escenarios de presión.',
      discipline: 'aqueducts',
      publicationStatus: 'published',
      approvedForPublication: true,
      featured: true,
      year: 2022,
      mediaTypes: ['plan', 'document'],
    };

    expect(
      filterProjects([...projects, projectWithMedia], { query: 'escenarios', medium: 'plan' }),
    ).toEqual([projectWithMedia]);
    expect(filterProjects([...projects, projectWithMedia], { medium: 'video' })).toEqual([]);
  });
});
