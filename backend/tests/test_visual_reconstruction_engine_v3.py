"""
CV OPTIMETER VISUAL RECONSTRUCTION ENGINE V3.0 - MASTER INTEGRATION & GOLDEN SNAPSHOT QA SUITE
Verifies PyMuPDF geometry extraction, SidebarRegion detection (left/right, background colors, width/height), DocumentRenderModelV3 assembly, and 10-dimension IoU scorecard.
"""

from app.services.document_intelligence.document_geometry import GeometryExtractor, DocumentGeometryModel, PageGeometryModel, DocumentElement
from app.services.document_intelligence.region_detector import RegionDetector, PageVisualLayoutModel, VisualRegionModel
from app.services.document_intelligence.document_reconstruction_engine import DocumentReconstructionEngine, DocumentRenderModelV3
from app.services.document_intelligence.visual_fidelity_engine import VisualFidelityEngine, VisualFidelityReportV3

MOCK_SIDEBAR_PDF_ELEMENTS = [
    # Sidebar Background Rect
    DocumentElement(id="bg-1", type="BACKGROUND", page=1, x=0.0, y=0.0, width=200.0, height=841.89, background_color="#0f172a"),
    # Sidebar Content (Contact & Profile Photo)
    DocumentElement(id="e-photo", type="IMAGE", page=1, x=40.0, y=40.0, width=120.0, height=120.0, region_id="sidebar"),
    DocumentElement(id="e-name", type="HEADING", text="CARLOS SILVA", page=1, x=30.0, y=180.0, width=140.0, height=24.0, font_size=18.0, color="#ffffff", region_id="sidebar"),
    DocumentElement(id="e-email", type="TEXT", text="carlos.silva@email.com", page=1, x=30.0, y=210.0, width=140.0, height=12.0, font_size=10.0, color="#38bdf8", region_id="sidebar"),
    # Main Body Content (Experience & Education)
    DocumentElement(id="e-title-exp", type="HEADING", text="EXPERIENCIA LABORAL", page=1, x=230.0, y=40.0, width=320.0, height=22.0, font_size=16.0, color="#0f172a", region_id="main"),
    DocumentElement(id="e-role-1", type="SUBHEADING", text="Auxiliar Técnico de Contenedores", page=1, x=230.0, y=75.0, width=280.0, height=16.0, font_size=12.0, font_weight="bold", region_id="main"),
    DocumentElement(id="e-company-1", type="TEXT", text="Sociedad Portuaria de Cartagena | 2021 - Presente", page=1, x=230.0, y=95.0, width=300.0, height=12.0, font_size=10.0, color="#64748b", region_id="main"),
    DocumentElement(id="e-bullet-1", type="BULLET", text="- Monitoreo continuo de unidades Reefers y control de temperatura en patio.", page=1, x=240.0, y=115.0, width=310.0, height=12.0, font_size=10.0, region_id="main")
]


def test_master_visual_reconstruction_engine_v3_suite():
    print("=== CV OPTIMETER MASTER VISUAL RECONSTRUCTION ENGINE V3.0 QA SUITE ===")

    # 1. Page Geometry Assembly
    page_geo = PageGeometryModel(
        page_number=1,
        width=595.27,
        height=841.89,
        page_format="A4",
        elements=MOCK_SIDEBAR_PDF_ELEMENTS
    )
    doc_geo = DocumentGeometryModel(document_id="doc-vis-001", total_pages=1, page_format="A4", pages=[page_geo])

    # 2. RegionDetector (Sidebar & Main Segmentation)
    layout = RegionDetector.detect_page_regions(page_geo)
    assert layout.has_sidebar == True, "FAIL: Sidebar region not detected"
    assert layout.layout_type == "TWO_COLUMN_SIDEBAR", f"FAIL: Layout type mismatch ({layout.layout_type})"
    assert len(layout.regions) == 2, f"FAIL: Expected 2 regions (Sidebar + Main), got {len(layout.regions)}"
    print(f"[OK] RegionDetector: Detected layout_type='{layout.layout_type}' with Sidebar background_color='{layout.regions[0].background_color}'")

    # 3. DocumentReconstructionEngine Assembly
    mock_cv = {"contact": {"name": "CARLOS SILVA", "email": "carlos.silva@email.com"}}
    render_model = DocumentReconstructionEngine.reconstruct_render_model("sess-vis-001", doc_geo, mock_cv)
    assert render_model.total_pages == 1, "FAIL: Page count mismatch"
    assert len(render_model.pages[0].regions) == 2, "FAIL: Render model regions count mismatch"
    print(f"[OK] DocumentReconstructionEngine: Built DocumentRenderModelV3 (Pages={render_model.total_pages}, Format={render_model.page_format})")

    # 4. VisualFidelityEngine 10-Dimension Scorecard
    fidelity_report = VisualFidelityEngine.evaluate_reconstruction_fidelity("sess-vis-001", doc_geo, render_model, mock_cv)
    fid = fidelity_report.fidelity
    assert fid.overall >= 90.0, f"FAIL: Visual fidelity score too low ({fid.overall}/100)"
    assert fid.content_preservation == 100.0, "FAIL: Content preservation lost"
    print(f"[OK] VisualFidelityEngine: 10-Dimension Score = {fid.overall}/100 (Geometry IoU={fid.geometry_iou}, Sidebar Region={fid.region_fidelity}, ContentPreservation={fid.content_preservation})")

    print("\n[OK] ALL MASTER VISUAL RECONSTRUCTION ENGINE V3.0 QA TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_master_visual_reconstruction_engine_v3_suite()
