export interface TypographyConfig {
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontSizeBasePx: number;
  lineHeight: number;
  letterSpacingEm: number;
  paragraphGapPx: number;
  headingScaleRatio: number;
  headingWeight: number;
  bodyWeight: number;
}

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamilyHeading: "Inter",
  fontFamilyBody: "Inter",
  fontSizeBasePx: 14,
  lineHeight: 1.5,
  letterSpacingEm: 0,
  paragraphGapPx: 12,
  headingScaleRatio: 1.25,
  headingWeight: 700,
  bodyWeight: 400
};

export class TypographyEngine {
  static generateStyles(config: Partial<TypographyConfig> = {}): React.CSSProperties {
    const merged = { ...DEFAULT_TYPOGRAPHY, ...config };
    return {
      fontFamily: merged.fontFamilyBody,
      fontSize: `${merged.fontSizeBasePx}px`,
      lineHeight: merged.lineHeight,
      letterSpacing: `${merged.letterSpacingEm}em`,
      fontWeight: merged.bodyWeight
    };
  }
}
