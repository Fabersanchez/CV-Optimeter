"""
CV OPTIMETER DATA-FIRST ARCHITECTURE - RESUME RENDER ENGINE
Consumes CandidateCVSchema + TemplateDefinition -> generates clean HTML/CSS preview & PDF export payload.
Decouples visual template design from candidate text data.
"""

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.services.template_engine.template_registry import template_registry, TemplateDefinition


class RenderSettingsModel(BaseModel):
    page_format: str = "A4"  # A4 | Letter
    font_scale: float = 1.0
    theme_color: str = "#2563eb"
    show_photo: bool = True
    ats_mode: bool = False


class RenderedDocumentOutput(BaseModel):
    session_id: str
    template_id: str
    html_content: str
    css_rules: str
    page_format: str = "A4"
    total_pages_estimate: int = 1
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ResumeRenderEngine:
    @staticmethod
    def render_candidate_cv(
        session_id: str,
        candidate_cv: Dict[str, Any],
        template_id: str = "ats-professional",
        settings: Optional[RenderSettingsModel] = None
    ) -> RenderedDocumentOutput:
        settings = settings or RenderSettingsModel()
        template_def = template_registry.get_template(template_id) or template_registry.get_template("ats-professional")

        contact = candidate_cv.get("contact", {}) or candidate_cv.get("basics", {})
        summary = candidate_cv.get("summary", "")
        experiences = candidate_cv.get("experience", [])
        educations = candidate_cv.get("education", [])
        skill_groups = candidate_cv.get("skillGroups", [])

        primary_color = template_def.colors.primary if template_def else "#0284c7"
        text_color = template_def.colors.text if template_def else "#0f172a"
        secondary_color = template_def.colors.secondary if template_def else "#64748b"

        # Build Clean Semantic HTML
        html_parts = []

        # 1. Header Section
        name = contact.get("name") or "Candidate Name"
        title = contact.get("title") or contact.get("headline") or ""
        email = contact.get("email") or ""
        phone = contact.get("phone") or ""
        location = contact.get("location") or ""

        html_parts.append(f"""
        <header className="cv-header border-b pb-4 mb-6" style="border-color: {primary_color}">
          <h1 className="text-3xl font-bold tracking-tight" style="color: {text_color}">{name}</h1>
          {f'<h2 className="text-lg font-medium mt-1" style="color: {primary_color}">{title}</h2>' if title else ''}
          <div className="flex flex-wrap gap-4 text-xs mt-2" style="color: {secondary_color}">
            {f'<span>📧 {email}</span>' if email else ''}
            {f'<span>📱 {phone}</span>' if phone else ''}
            {f'<span>📍 {location}</span>' if location else ''}
          </div>
        </header>
        """)

        # 2. Professional Summary
        if summary:
            html_parts.append(f"""
            <section className="cv-section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style="color: {primary_color}">Perfil Profesional</h3>
              <p className="text-xs leading-relaxed" style="color: {text_color}">{summary}</p>
            </section>
            """)

        # 3. Work Experience
        if experiences:
            exp_items_html = []
            for exp in experiences:
                comp = exp.get("company", "")
                role = exp.get("position") or exp.get("role", "")
                dates = f"{exp.get('startDate', '')} - {exp.get('endDate', '')}"
                bullets = exp.get("bullets") or exp.get("responsibilities", [])
                
                bullets_html = "".join([f'<li className="text-xs leading-snug mb-1">{b}</li>' for b in bullets])

                exp_items_html.append(f"""
                <div className="exp-item mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs" style="color: {text_color}">{role}</span>
                    <span className="text-[11px] font-mono" style="color: {secondary_color}">{dates}</span>
                  </div>
                  <div className="text-xs font-medium mb-1.5" style="color: {primary_color}">{comp}</div>
                  {f'<ul className="list-disc pl-4 space-y-1">{bullets_html}</ul>' if bullets_html else ''}
                </div>
                """)

            html_parts.append(f"""
            <section className="cv-section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style="color: {primary_color}">Experiencia Laboral</h3>
              {"".join(exp_items_html)}
            </section>
            """)

        # 4. Education
        if educations:
            edu_items_html = []
            for edu in educations:
                inst = edu.get("institution", "")
                deg = edu.get("degree", "")
                dates = f"{edu.get('startDate', '')} - {edu.get('endDate', '')}"
                edu_items_html.append(f"""
                <div className="edu-item mb-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{inst}</span>
                    <span className="text-[11px] font-mono text-slate-500">{dates}</span>
                  </div>
                  <div className="text-xs text-slate-700">{deg}</div>
                </div>
                """)

            html_parts.append(f"""
            <section className="cv-section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style="color: {primary_color}">Educación</h3>
              {"".join(edu_items_html)}
            </section>
            """)

        # 5. Skills
        if skill_groups:
            all_skills = []
            for sg in skill_groups:
                all_skills.extend(sg.get("skills", []))
            skills_tags = "".join([f'<span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-mono border">{s}</span>' for s in all_skills])

            html_parts.append(f"""
            <section className="cv-section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style="color: {primary_color}">Habilidades</h3>
              <div className="flex flex-wrap gap-1.5">{skills_tags}</div>
            </section>
            """)

        full_html = f"""
        <div className="cv-document p-8 max-w-4xl mx-auto bg-white font-sans text-slate-900" style="min-height: 1123px">
          {"".join(html_parts)}
        </div>
        """

        heading_font = template_def.typography.heading_font if template_def else "Inter"
        body_font = template_def.typography.body_font if template_def else "Inter"

        css_rules = f"""
        @page {{ size: {settings.page_format}; margin: 20mm; }}
        body {{ font-family: {body_font}, sans-serif; }}
        h1, h2, h3 {{ font-family: {heading_font}, sans-serif; }}
        """

        return RenderedDocumentOutput(
            session_id=session_id,
            template_id=template_def.id if template_def else "ats-professional",
            html_content=full_html,
            css_rules=css_rules,
            page_format=settings.page_format,
            total_pages_estimate=1
        )
