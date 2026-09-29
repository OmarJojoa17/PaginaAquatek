export const disciplineValues = [
  'hydrology',
  'aqueducts',
  'sewerage',
  'river-engineering',
  'road-drainage',
  'fire-protection',
  'hydrosanitary',
] as const;

export type Discipline = (typeof disciplineValues)[number];

export const disciplineLabels: Record<Discipline, string> = {
  hydrology: 'Hidrología',
  aqueducts: 'Acueductos y redes a presión',
  sewerage: 'Alcantarillado sanitario y pluvial',
  'river-engineering': 'Hidráulica e ingeniería de ríos',
  'road-drainage': 'Drenaje vial',
  'fire-protection': 'Redes contra incendio',
  hydrosanitary: 'Redes hidrosanitarias',
};
