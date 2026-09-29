import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from '../../src/utils/color';

const palette = {
  ink: '#071E3D',
  cobalt: '#174EA6',
  indigo: '#3346A8',
  paper: '#F4F7FB',
  white: '#FFFFFF',
  onDark: '#E7EDF8',
  onDarkMuted: '#B9C9E1',
};

describe('contraste de la identidad Atlas cobalto', () => {
  it.each([
    ['tinta sobre papel', palette.ink, palette.paper],
    ['cobalto sobre papel', palette.cobalt, palette.paper],
    ['índigo sobre papel', palette.indigo, palette.paper],
    ['blanco sobre índigo', palette.white, palette.indigo],
    ['texto claro sobre tinta', palette.onDark, palette.ink],
    ['texto secundario sobre tinta', palette.onDarkMuted, palette.ink],
  ])('%s supera WCAG AA para texto normal', (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it('rechaza valores que no sean hexadecimales de seis dígitos', () => {
    expect(() => relativeLuminance('#1234')).toThrow('Color hexadecimal inválido');
  });
});
