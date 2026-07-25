import {
  getTextDecorationLine,
  TEXT_LEADING,
  TEXT_SIZES,
  TEXT_WEIGHTS,
} from './Text';

describe('Text tokens', () => {
  it('maps size tokens to font sizes', () => {
    expect(TEXT_SIZES.xs).toBe(11);
    expect(TEXT_SIZES.sm).toBe(12);
    expect(TEXT_SIZES.md).toBe(14);
    expect(TEXT_SIZES.lg).toBe(16);
    expect(TEXT_SIZES.xl).toBe(20);
    expect(TEXT_SIZES['2xl']).toBe(24);
    expect(TEXT_SIZES['3xl']).toBe(28);
  });

  it('maps weight tokens to fontWeight values', () => {
    expect(TEXT_WEIGHTS.regular).toBe('400');
    expect(TEXT_WEIGHTS.medium).toBe('500');
    expect(TEXT_WEIGHTS.semibold).toBe('600');
    expect(TEXT_WEIGHTS.bold).toBe('700');
  });

  it('maps leading tokens to line-height multipliers', () => {
    expect(TEXT_LEADING.tight).toBe(1.15);
    expect(TEXT_LEADING.normal).toBe(1.4);
    expect(TEXT_LEADING.relaxed).toBe(1.65);
  });
});

describe('getTextDecorationLine', () => {
  it('returns underline line-through when both flags are set', () => {
    expect(getTextDecorationLine(true, true)).toBe('underline line-through');
  });

  it('returns underline when only underline is set', () => {
    expect(getTextDecorationLine(true, false)).toBe('underline');
  });

  it('returns line-through when only strike is set', () => {
    expect(getTextDecorationLine(false, true)).toBe('line-through');
  });

  it('returns undefined when neither flag is set', () => {
    expect(getTextDecorationLine()).toBeUndefined();
  });
});
