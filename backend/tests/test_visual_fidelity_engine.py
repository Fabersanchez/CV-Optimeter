"""
CV OPTIMETER VISUAL FIDELITY ENGINE - GOLDEN TEST SUITE V2
Executes QA suite against Golden Document Fixtures (1-page PDF, 2-page PDF, 2-column sidebar PDF) and tests 7-dimension visual fidelity scores.
"""

from app.services.document_intelligence.document_geometry import GeometryExtractor, DocumentGeometry, DocumentElement, DocumentPageGeometry
from app.services.document_intelligence.layout_analyzer import LayoutAnalyzer, LayoutAnalysisResult
from app.services.document_intelligence.spacing_typography_analyzer import SpacingTypographyAnalyzer
from app.services.document_intelligence.page_balance_engine import PageBalanceEngine, PageBalanceResult
from app.services.document_intelligence.space_utilization_engine import SpaceUtilizationEngine
from app.services.document_intelligence.visual_diff_engine import VisualDiffEngine
from app.services.document_intelligence.document_render_model import DocumentRenderModel
from app.services.document_intelligence.visual_fidelity_engine import VisualFidelityEngine, VisualFidelityReport
from tests.fixtures.golden_documents.golden_cv_fixtures import GOLDEN_FIXTURES


def test_visual_fidelity_golden_suite():
    print("=== CV OPTIMETER GOLDEN DOCUMENT VISUAL FIDELITY QA SUITE ===")

    for fix_key, fix_data in GOLDEN_FIXTURES.items():
        print(f"\n--- Testing Golden Fixture: '{fix_key}' ({fix_data['filename']}) ---")
        cv = fix_data["candidate_cv"]

        # 1. Geometry Building
        mock_elements = [
            DocumentElement(id="e-1", type="text", text=cv["contact"]["name"], page=1, x=36.0, y=40.0, width=200.0, height=24.0, font_size=18.0, font_weight="bold"),
            DocumentElement(id="e-2", type="text", text=cv["contact"]["title"], page=1, x=36.0, y=68.0, width=180.0, height=14.0, font_size=12.0),
            DocumentElement(id="e-3", type="text", text="EXPERIENCIA LABORAL", page=1, x=36.0, y=100.0, width=220.0, height=16.0, font_size=14.0, font_weight="bold")
        ]
        if fix_data["expected_layout"] == "2-column-sidebar":
            mock_elements.append(
                DocumentElement(id="e-4", type="text", text="Sidebar Skills", page=1, x=420.0, y=100.0, width=120.0, height=14.0, font_size=11.0)
            )

        geo = DocumentGeometry(
            document_id=f"geo-{fix_key}",
            total_pages=fix_data["expected_pages"],
            pages=[DocumentPageGeometry(page_number=1, width=595.27, height=841.89, elements=mock_elements)]
        )

        # 2. Layout Analyzer
        layout_res = LayoutAnalyzer.analyze_layout(geo)
        print(f"[OK] LayoutAnalyzer: Detected '{layout_res.layout_type}' ({layout_res.column_count} cols)")

        # 3. Spacing & Typography Analyzer
        sp_typo = SpacingTypographyAnalyzer.analyze_spacing_and_typography(geo)
        print(f"[OK] Spacing & Typography: Margin Top={sp_typo['spacing']['page_margin_top']}pt | Font Pairing='{sp_typo['typography']['fallback_font_pairing']}'")

        # 4. Page Balance Engine (Keep-Together Rules)
        balance_res = PageBalanceEngine.calculate_page_balance(cv, layout_res.layout_type)
        print(f"[OK] PageBalanceEngine: Calculated {balance_res.total_pages} page(s) | Keep-Together Applied={balance_res.keep_together_applied_count}")

        # 5. Space Utilization Engine
        util_res = SpaceUtilizationEngine.calculate_space_utilization(geo)
        print(f"[OK] SpaceUtilizationEngine: Utilization={util_res.utilization_percentage}% | Status={util_res.density_status}")

        # 6. Render Model & Visual Diff
        render_model = DocumentRenderModel.build_from_cv_schema(f"sess-{fix_key}", cv)
        diff_report = VisualDiffEngine.compare_geometry_vs_render(f"sess-{fix_key}", geo, render_model)
        print(f"[OK] VisualDiffEngine: Accuracy={diff_report.positional_accuracy_percentage}% | Aligned={diff_report.aligned_count}/{diff_report.total_elements_compared}")

        # 7. 7-Dimension Visual Fidelity Report
        fidelity_report = VisualFidelityEngine.evaluate_visual_fidelity(
            session_id=f"sess-{fix_key}",
            geometry=geo,
            layout=layout_res,
            candidate_cv=cv,
            page_balance=balance_res
        )
        fid = fidelity_report.fidelity
        assert fid.overall >= 85.0, f"FAIL: Golden fixture '{fix_key}' overall fidelity too low ({fid.overall}/100)"
        assert fid.content_preservation == 100.0, f"FAIL: Content preservation lost on '{fix_key}'"
        print(f"[OK] VisualFidelityEngine: Overall Score = {fid.overall}/100 across 7 dimensions")

    print("\n[OK] ALL GOLDEN DOCUMENT VISUAL FIDELITY QA TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_visual_fidelity_golden_suite()
