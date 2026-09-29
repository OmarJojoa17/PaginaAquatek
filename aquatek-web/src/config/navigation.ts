export type NavigationItem = {
  href: string;
  label: string;
};

export function getPrimaryNavigation(base: string): NavigationItem[] {
  return [
    { href: `${base}especialidades/`, label: 'Especialidades' },
    { href: `${base}proyectos/`, label: 'Proyectos' },
    { href: `${base}capacidades/`, label: 'Capacidades' },
    { href: `${base}empresa/`, label: 'Empresa' },
  ];
}

export function getContactHref(base: string): string {
  return `${base}contacto/`;
}
