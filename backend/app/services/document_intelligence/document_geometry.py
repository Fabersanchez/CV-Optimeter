"""
CV OPTIMETER VISUAL RECONSTRUCTION ENGINE - DOCUMENT GEOMETRY PARSER V3.0
Extracts element-level bounding box geometry, fonts, colors, drawings, backgrounds, and images using PyMuPDF (fitz).
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DocumentElement(BaseModel):
    id: str
    type: str = "TEXT"  # TEXT | HEADING | SUBHEADING | PARAGRAPH | BULLET | IMAGE | RECTANGLE | LINE | DIVIDER | BACKGROUND | ICON | SHAPE | SIDEBAR | HEADER | FOOTER
    page: int = 1
    x: float = 0.0
    y: float = 0.0
    width: float = 0.0
    height: float = 0.0
    rotation: float = 0.0
    text: str = ""
    font_family: str = "Inter"
    font_size: float = 10.0
    font_weight: str = "normal"  # normal | bold | medium
    font_style: str = "normal"  # normal | italic
    color: str = "#0f172a"
    background_color: Optional[str] = None
    alignment: str = "left"  # left | center | right | justify
    z_index: int = 0
    parent_id: Optional[str] = None
    region_id: str = "main"  # sidebar | main | header | footer
    source_id: str = ""
    bounding_box: List[float] = Field(default_factory=lambda: [0.0, 0.0, 0.0, 0.0])


class PageGeometryModel(BaseModel):
    page_number: int
    width: float = 595.27  # A4 width in pt
    height: float = 841.89  # A4 height in pt
    page_format: str = "A4"  # A4 | Letter | Legal | Custom
    margins: Dict[str, float] = Field(default_factory=lambda: {"top": 36.0, "bottom": 36.0, "left": 36.0, "right": 36.0})
    background_color: Optional[str] = None
    elements: List[DocumentElement] = Field(default_factory=list)


class DocumentGeometryModel(BaseModel):
    document_id: str
    total_pages: int = 1
    page_format: str = "A4"
    pages: List[PageGeometryModel] = Field(default_factory=list)


# Backward Compatibility Aliases
DocumentGeometry = DocumentGeometryModel
DocumentPageGeometry = PageGeometryModel


class GeometryExtractor:
    @staticmethod
    def extract_pdf_geometry(pdf_bytes: bytes, document_id: str = "doc-geo-001") -> DocumentGeometryModel:
        pages_geo: List[PageGeometryModel] = []
        doc_format = "A4"

        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            for page_idx, page in enumerate(doc):
                rect = page.rect
                p_width = rect.width
                p_height = rect.height

                if abs(p_width - 612) < 15 and abs(p_height - 792) < 15:
                    doc_format = "Letter"
                elif abs(p_width - 595.27) < 15 and abs(p_height - 841.89) < 15:
                    doc_format = "A4"
                else:
                    doc_format = "Custom"

                elements: List[DocumentElement] = []
                elem_idx = 0

                # 1. Extract Vector Drawings / Background Rectangles
                try:
                    drawings = page.get_drawings()
                    for drw in drawings:
                        r = drw.get("rect")
                        fill = drw.get("fill")
                        if r and fill:
                            fill_hex = f"#{int(fill[0]*255):02x}{int(fill[1]*255):02x}{int(fill[2]*255):02x}" if isinstance(fill, (list, tuple)) and len(fill) >= 3 else "#38bdf8"
                            w = r[2] - r[0]
                            h = r[3] - r[1]
                            if w > 20 and h > 20:
                                elements.append(
                                    DocumentElement(
                                        id=f"p{page_idx+1}-bg-{elem_idx}",
                                        type="BACKGROUND" if w > 100 and h > 200 else "RECTANGLE",
                                        page=page_idx + 1,
                                        x=round(r[0], 2),
                                        y=round(r[1], 2),
                                        width=round(w, 2),
                                        height=round(h, 2),
                                        background_color=fill_hex,
                                        z_index=0,
                                        bounding_box=[round(c, 2) for c in r]
                                    )
                                )
                                elem_idx += 1
                except Exception as e_drw:
                    print(f"[GeometryExtractor Drawings Warning]: {e_drw}")

                # 2. Extract Text Spans & Bounding Boxes
                page_dict = page.get_text("dict", flags=fitz.TEXT_DEHYPHENATE)
                blocks = page_dict.get("blocks", [])

                for b in blocks:
                    if b.get("type") == 0:  # Text block
                        for line in b.get("lines", []):
                            line_bbox = line.get("bbox", [0, 0, 0, 0])
                            line_text = "".join(span.get("text", "") for span in line.get("spans", [])).strip()
                            if not line_text:
                                continue

                            first_span = line["spans"][0] if line.get("spans") else {}
                            font_size = float(first_span.get("size", 10.0))
                            font_name = str(first_span.get("font", "Inter"))
                            color_int = first_span.get("color", 0)
                            color_hex = f"#{color_int:06x}" if isinstance(color_int, int) else "#0f172a"

                            is_bold = "bold" in font_name.lower() or bool(first_span.get("flags", 0) & 2)
                            is_italic = "italic" in font_name.lower() or bool(first_span.get("flags", 0) & 1)

                            x0, y0, x1, y1 = line_bbox
                            width = x1 - x0
                            height = y1 - y0

                            elem_type = "TEXT"
                            if font_size >= 16.0 or is_bold and font_size >= 14.0:
                                elem_type = "HEADING"
                            elif font_size >= 12.0 and is_bold:
                                elem_type = "SUBHEADING"
                            elif line_text.startswith(("-", "•", "*", "–", "◦", "▪")):
                                elem_type = "BULLET"

                            # Region classification by X-coordinate
                            region_id = "sidebar" if x0 < p_width * 0.35 and width < p_width * 0.38 else "main"

                            elements.append(
                                DocumentElement(
                                    id=f"p{page_idx+1}-elem-{elem_idx}",
                                    type=elem_type,
                                    text=line_text,
                                    page=page_idx + 1,
                                    x=round(x0, 2),
                                    y=round(y0, 2),
                                    width=round(width, 2),
                                    height=round(height, 2),
                                    font_size=round(font_size, 1),
                                    font_family=font_name,
                                    font_weight="bold" if is_bold else "normal",
                                    font_style="italic" if is_italic else "normal",
                                    color=color_hex,
                                    region_id=region_id,
                                    z_index=1,
                                    bounding_box=[round(c, 2) for c in line_bbox]
                                )
                            )
                            elem_idx += 1
                    elif b.get("type") == 1:  # Image block
                        img_bbox = b.get("bbox", [0, 0, 100, 100])
                        w = img_bbox[2] - img_bbox[0]
                        h = img_bbox[3] - img_bbox[1]
                        region_id = "sidebar" if img_bbox[0] < p_width * 0.35 else "main"

                        elements.append(
                            DocumentElement(
                                id=f"p{page_idx+1}-img-{elem_idx}",
                                type="IMAGE",
                                page=page_idx + 1,
                                x=round(img_bbox[0], 2),
                                y=round(img_bbox[1], 2),
                                width=round(w, 2),
                                height=round(h, 2),
                                region_id=region_id,
                                z_index=2,
                                bounding_box=[round(c, 2) for c in img_bbox]
                            )
                        )
                        elem_idx += 1

                pages_geo.append(
                    PageGeometryModel(
                        page_number=page_idx + 1,
                        width=p_width,
                        height=p_height,
                        page_format=doc_format,
                        elements=elements
                    )
                )

            doc.close()
            if pages_geo:
                return DocumentGeometryModel(
                    document_id=document_id,
                    total_pages=len(pages_geo),
                    page_format=doc_format,
                    pages=pages_geo
                )
        except Exception as e:
            print(f"[GeometryExtractor Exception]: {e}")

        # Fallback default geometry
        return DocumentGeometryModel(
            document_id=document_id,
            total_pages=1,
            page_format="A4",
            pages=[
                PageGeometryModel(
                    page_number=1,
                    elements=[
                        DocumentElement(
                            id="p1-fallback",
                            type="TEXT",
                            text="Extracted Document Text",
                            x=36.0,
                            y=36.0,
                            width=523.27,
                            height=20.0
                        )
                    ]
                )
            ]
        )
