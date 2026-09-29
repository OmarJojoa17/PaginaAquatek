import type { Discipline } from './disciplines';

export type ProjectSummary = {
  slug?: string;
  title: string;
  summary?: string;
  discipline: Discipline;
  relatedDisciplines?: Discipline[];
  publicationStatus: 'draft' | 'published';
  approvedForPublication: boolean;
  featured?: boolean;
  year?: number;
  mediaTypes?: Array<'image' | 'video' | 'plan' | 'document'>;
};

export type ProjectPublicationState = Pick<
  ProjectSummary,
  'publicationStatus' | 'approvedForPublication'
>;

export function isPublicProject(project: ProjectPublicationState): boolean {
  return project.publicationStatus === 'published' && project.approvedForPublication;
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function filterProjects(
  projects: ProjectSummary[],
  options: {
    discipline?: Discipline;
    medium?: 'image' | 'video' | 'plan' | 'document';
    query?: string;
  } = {},
): ProjectSummary[] {
  const normalizedQuery = options.query?.trim().toLocaleLowerCase('es');

  return projects
    .filter(isPublicProject)
    .filter(
      (project) =>
        !options.discipline ||
        project.discipline === options.discipline ||
        project.relatedDisciplines?.includes(options.discipline),
    )
    .filter((project) => !options.medium || project.mediaTypes?.includes(options.medium))
    .filter(
      (project) =>
        !normalizedQuery ||
        `${project.title} ${project.summary ?? ''}`
          .toLocaleLowerCase('es')
          .includes(normalizedQuery),
    )
    .sort(
      (a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        (b.year ?? 0) - (a.year ?? 0) ||
        a.title.localeCompare(b.title, 'es'),
    );
}
