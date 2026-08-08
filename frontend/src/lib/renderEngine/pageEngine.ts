/**
 * CV OPTIMETER AI — PAGE ENGINE & PAGINATION BREAK DETECTOR (RENDER ENGINE V2 2026)
 * Calculates A4 page bounds (794px x 1123px @ 96 DPI), handles page overflow,
 * and enforces pagination rules preventing orphan section titles or split bullets.
 */

export interface PageBounds {
  pageWidthPx: number;  // 794px for A4
  pageHeightPx: number; // 1123px for A4
  maxContentHeightPx: number; // ~1040px accounting for top/bottom margins
}

export const A4_PAGE_BOUNDS: PageBounds = {
  pageWidthPx: 794,
  pageHeightPx: 1123,
  maxContentHeightPx: 1040
};

export interface PageBreakRule {
  preventOrphanHeadings: boolean;
  preventSplitBullets: boolean;
  pageBreakClass: string;
}

export function getPaginationCSSRules(): string {
  return `
    /* CV OPTIMETER ENTERPRISE PRINT & PAGINATION RULES */
    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .cv-document-root {
        box-shadow: none !important;
        border: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
    }

    /* Page Break Prevention Utilities */
    .cv-section-heading {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    .cv-experience-item, .cv-education-item {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .cv-bullet-item {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
  `;
}
