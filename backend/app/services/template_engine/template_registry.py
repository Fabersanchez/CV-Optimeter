"""
CV OPTIMETER TEMPLATE REGISTRY - CORE TEMPLATE REGISTRY (28 CATALOG)
Manages registration, discovery, search, filtering, and license manifests for 28 production templates.
"""

from typing import Dict, Any, List, Optional
from .template_definition import (
    TemplateDefinition,
    TemplateMetadata,
    TemplateState,
    LayoutGridConfig,
    TypographyConfig,
    ColorPalette,
    ATSRules,
    TemplateQualityScore,
    LicenseManifest,
    SourceType
)


def _build_default_templates() -> Dict[str, TemplateDefinition]:
    templates: Dict[str, TemplateDefinition] = {}

    def add_template(
        t_id: str,
        name: str,
        category: str,
        desc: str,
        roles: List[str],
        industries: List[str],
        badge: str,
        gradient: str,
        columns: int = 1,
        header_style: str = "left-aligned",
        font_pairing: str = "inter",
        ats_score: int = 98,
        visual_score: int = 95,
        primary_color: str = "#0284c7",
        source_type: SourceType = SourceType.ORIGINAL,
        source_repo: Optional[str] = None,
        source_author: Optional[str] = None,
        source_license: str = "CV Optimeter Enterprise License",
        adaptation_notes: Optional[str] = None,
        attribution_required: bool = False
    ):
        license_manifest = LicenseManifest(
            source_type=source_type,
            license_type=source_license,
            author=source_author or "CV Optimeter AI Engineering Team",
            source_repository=source_repo,
            source_author=source_author,
            source_license=source_license,
            adaptation_notes=adaptation_notes,
            attribution_required=attribution_required,
            commercial_use=True,
            modification_allowed=True,
            redistribution_allowed=True,
            verified=True
        )

        templates[t_id] = TemplateDefinition(
            id=t_id,
            name=name,
            slug=t_id,
            version="1.0.0",
            description=desc,
            state=TemplateState.PUBLISHED,
            license=license_manifest,
            metadata=TemplateMetadata(
                categories=[category],
                recommended_roles=roles,
                target_industries=industries,
                badge=badge,
                preview_gradient=gradient
            ),
            layout=LayoutGridConfig(
                columns=columns,
                header_style=header_style
            ),
            typography=TypographyConfig(
                font_pairing=font_pairing
            ),
            colors=ColorPalette(
                primary=primary_color,
                secondary="#0f172a",
                accent="#38bdf8"
            ),
            ats=ATSRules(
                safe=ats_score >= 90,
                parse_rate_rating=ats_score
            ),
            quality=TemplateQualityScore(
                ats=ats_score,
                visual=visual_score,
                readability=96,
                density=92,
                hierarchy=95,
                overall=round((ats_score + visual_score + 96 + 92 + 95) / 5.0, 1)
            )
        )

    # --- 5 ATS TEMPLATES ---
    add_template(
        "ats-professional", "01 ATS Professional", "ATS",
        "Ultra-clean single column layout guaranteed for 99%+ ATS parser pass rates.",
        ["Software Engineers", "Data Scientists", "General Industry"],
        ["Technology", "Engineering", "Finance", "Healthcare"],
        "99% ATS Pass Rate", "from-sky-600 to-indigo-600", 1, "left-aligned", "inter", 99, 90, "#0284c7",
        SourceType.ADAPTED, "https://github.com/jsonresume/jsonresume.org", "JSON Resume Open Source Community", "MIT License",
        "Adapted section hierarchy and JSON Schema structure into CandidateCVSchema.", True
    )

    add_template(
        "ats-compact", "02 ATS Compact", "ATS",
        "High-density compact ATS layout designed to fit extensive career histories into a tight single page.",
        ["Mid-Level Engineers", "Project Leads"], ["Technology", "Operations"],
        "Compact ATS", "from-slate-700 to-slate-900", 1, "left-aligned", "inter", 99, 91, "#0f172a"
    )

    add_template(
        "ats-academic", "03 ATS Academic", "ATS",
        "Structured single-column academic ATS template with zero graphic table elements.",
        ["Researchers", "Professors"], ["Academia", "Research"],
        "ATS Safe Academic", "from-amber-800 to-slate-900", 1, "left-aligned", "merriweather", 98, 92, "#475569"
    )

    add_template(
        "ats-technical", "04 ATS Technical", "ATS",
        "ATS-safe layout with monospace skill tag sections and clean career timeline dividers.",
        ["Backend Developers", "DevOps"], ["Software", "DevOps"],
        "ATS Tech Matrix", "from-cyan-700 to-slate-900", 1, "left-aligned", "fira-code", 98, 93, "#0284c7"
    )

    add_template(
        "ats-executive", "05 ATS Executive", "ATS",
        "Executive single-column layout maintaining 98%+ ATS parser pass rate for C-level candidates.",
        ["VPs", "Directors"], ["Enterprise", "Banking"],
        "ATS Executive", "from-slate-900 to-indigo-950", 1, "left-aligned", "inter", 98, 94, "#0f172a"
    )

    # --- 5 PROFESSIONAL TEMPLATES ---
    add_template(
        "modern-professional", "06 Modern Professional", "Professional",
        "Modern sleek header with subtle grid dividers and elegant typography.",
        ["Product Managers", "Consultants", "Operations Leads"],
        ["SaaS", "Consulting", "Corporate Services"],
        "Modern Choice", "from-blue-600 to-slate-800", 1, "left-aligned", "roboto", 97, 95, "#2563eb",
        SourceType.ADAPTED, "https://github.com/jsonresume/jsonresume.org", "JSON Resume Open Source Community", "MIT License",
        "Adapted modern header composition into CV Optimeter Design System.", True
    )

    add_template(
        "corporate", "07 Corporate Standard", "Corporate",
        "Structured corporate grid layout with subtle vertical accent bars.",
        ["Project Managers", "Consultants", "Business Analysts"],
        ["Banking", "Insurance", "Corporate"],
        "Corporate Choice", "from-blue-700 to-slate-800", 1, "left-aligned", "roboto", 96, 92, "#1e293b"
    )

    add_template(
        "clean-hybrid", "08 Clean Hybrid", "Professional",
        "Hybrid single/dual section layout balancing visual flair with strong ATS parser compatibility.",
        ["Marketing Leads", "Account Executives"], ["Agencies", "Tech"],
        "Hybrid Layout", "from-teal-600 to-slate-800", 1, "left-aligned", "inter", 96, 94, "#0d9488"
    )

    add_template(
        "strategic-lead", "09 Strategic Lead", "Professional",
        "High-impact layout with executive summary highlight block and metric indicators.",
        ["Strategy Consultants", "Program Leads"], ["Management Consulting"],
        "Strategic Impact", "from-indigo-600 to-slate-900", 1, "left-aligned", "inter", 96, 95, "#4f46e5"
    )

    add_template(
        "operations-lead", "10 Operations Lead", "Professional",
        "Structured grid highlighting operational KPIs, budget allocations, and team scaling.",
        ["COOs", "Operations Directors"], ["Supply Chain", "Logistics"],
        "Ops Matrix", "from-slate-800 to-blue-900", 1, "left-aligned", "roboto", 96, 93, "#334155"
    )

    # --- 3 EXECUTIVE TEMPLATES ---
    add_template(
        "executive", "11 Executive Leadership", "Executive",
        "Deep navy banner header tailored for Vice Presidents, Directors, and Senior Executives.",
        ["VPs", "Directors", "CEOs", "C-Level Leadership"],
        ["Enterprise", "Finance", "Healthcare", "Manufacturing"],
        "Executive Favorite", "from-slate-900 to-slate-800", 1, "banner", "inter", 95, 96, "#0f172a"
    )

    add_template(
        "senior-executive", "12 Senior C-Suite Leader", "Executive",
        "Formal executive composition with executive summary banner and board membership block.",
        ["CEOs", "COOs", "CFOs", "Board Members"],
        ["Enterprise", "Global Operations"],
        "C-Suite Ready", "from-slate-950 to-slate-900", 1, "banner", "inter", 96, 97, "#0f172a"
    )

    add_template(
        "board-director", "13 Board Director", "Executive",
        "Ultra-formal serif executive layout tailored for Board of Directors and Managing Partners.",
        ["Board Directors", "Managing Partners"], ["Venture Capital", "Governance"],
        "Board Standard", "from-amber-950 to-slate-900", 1, "centered", "merriweather", 95, 98, "#1e293b"
    )

    # --- 3 TECHNOLOGY TEMPLATES ---
    add_template(
        "technology", "14 Technology Stack", "Technology",
        "Monospace code headers with framework pills and GitHub repository tags.",
        ["Full Stack Developers", "Backend Engineers"],
        ["Technology", "Open Source", "Developer Tools"],
        "Code Stack", "from-cyan-600 to-blue-800", 1, "left-aligned", "fira-code", 96, 95, "#0284c7",
        SourceType.ADAPTED, "https://github.com/anurag3407/career-pilot", "Anurag3407 (Career Pilot)", "MIT License",
        "Adapted tech stack badge component and code typography into TemplateDefinition.", True
    )

    add_template(
        "technical-specialist", "15 Technical Specialist Matrix", "Technology",
        "Specialized architecture matrix layout for Principal Engineers and Systems Architects.",
        ["Principal Engineers", "Architects", "CTOs"],
        ["Deep Tech", "Infrastructure", "AI Research"],
        "Architect Focus", "from-cyan-700 to-slate-900", 1, "left-aligned", "fira-code", 97, 96, "#0284c7"
    )

    add_template(
        "data-ai", "16 Data Science & AI", "Technology",
        "Specialized matrix highlighting machine learning models, research papers, and data pipelines.",
        ["Data Scientists", "AI Engineers", "MLOps"],
        ["AI & ML", "Data Analytics", "Research"],
        "AI Matrix", "from-purple-700 to-sky-700", 1, "left-aligned", "fira-code", 97, 97, "#7c3aed"
    )

    # --- 2 ENGINEERING TEMPLATES ---
    add_template(
        "engineering", "17 Engineering & DevOps", "Engineering",
        "Structured layout with technical infrastructure matrix and metrics highlights.",
        ["DevOps Engineers", "Cloud Architects", "Site Reliability"],
        ["Cloud", "DevOps", "Infrastructure"],
        "Tech Matrix", "from-indigo-700 to-blue-900", 1, "left-aligned", "fira-code", 97, 94, "#4338ca",
        SourceType.ADAPTED, "https://github.com/anurag3407/career-pilot", "Anurag3407 (Career Pilot)", "MIT License",
        "Adapted infrastructure matrix layout into CV Optimeter Design System.", True
    )

    add_template(
        "cloud-infrastructure", "18 Cloud & Infrastructure", "Engineering",
        "Specialized cloud engineering layout highlighting AWS/GCP certifications and uptime SLAs.",
        ["Cloud Engineers", "SREs"], ["Cloud", "Telecom"],
        "SLA Matrix", "from-blue-900 to-cyan-900", 1, "left-aligned", "fira-code", 97, 95, "#0284c7"
    )

    # --- 2 ACADEMIC TEMPLATES ---
    add_template(
        "academic", "19 Academic & Research CV", "Academic",
        "Formal serif layout tailored for professors, researchers, and PhD candidates.",
        ["Researchers", "Professors", "PhD Candidates"],
        ["Academia", "Research Institutes", "Higher Education"],
        "Research Ready", "from-amber-700 to-slate-800", 1, "centered", "merriweather", 98, 91, "#475569",
        SourceType.ADAPTED, "https://github.com/jsonresume/jsonresume.org", "JSON Resume Open Source Community", "MIT License",
        "Adapted publication section layout into CandidateCVSchema contract.", True
    )

    add_template(
        "publication-heavy", "20 Publication Heavy CV", "Academic",
        "Specialized multi-page academic layout tailored for extensive peer-reviewed publication lists.",
        ["Postdocs", "Research Fellows"], ["Academia", "Biotech"],
        "Publication Focus", "from-slate-800 to-amber-900", 1, "centered", "merriweather", 98, 90, "#334155"
    )

    # --- 2 CREATIVE TEMPLATES ---
    add_template(
        "creative", "21 Creative Split 2-Column", "Creative",
        "Split 2-column layout with dark left sidebar for contact details and skills.",
        ["UI/UX Designers", "Animators", "Marketing Leads"],
        ["Creative Agencies", "Design Studios", "Gaming"],
        "Visual Impact", "from-purple-600 to-pink-600", 2, "split", "outfit", 88, 99, "#38bdf8"
    )

    add_template(
        "portfolio-design", "22 Portfolio & Design", "Creative",
        "Dynamic split layout with portfolio URL tags and visual skill proficiency badges.",
        ["Product Designers", "Art Directors"], ["Design", "Media"],
        "Portfolio Ready", "from-rose-600 to-purple-800", 2, "split", "outfit", 88, 98, "#e11d48"
    )

    # --- 2 MINIMALIST TEMPLATES ---
    add_template(
        "minimalist", "23 Minimalist Clean", "Minimal",
        "High-contrast typography with generous whitespace and elegant divider lines.",
        ["UX Designers", "Architects", "Writers"],
        ["Design", "Architecture", "Publishing"],
        "Ultra Clean", "from-slate-700 to-slate-900", 1, "left-aligned", "inter", 97, 95, "#0f172a",
        SourceType.ADAPTED, "https://github.com/mattyHerzig/mattys_resume", "Matty Herzig", "MIT License",
        "Adapted typography hierarchy and minimal spacing scale into TemplateDefinition.", True
    )

    add_template(
        "high-contrast-minimal", "24 High-Contrast Typography", "Minimal",
        "Monochrome layout emphasizing typography weights and clean vertical lines.",
        ["Content Strategists", "Copywriters"], ["Publishing", "Media"],
        "Monochrome", "from-slate-900 to-black", 1, "left-aligned", "inter", 98, 96, "#0f172a"
    )

    # --- 2 STARTUP TEMPLATES ---
    add_template(
        "startup", "25 Startup Founder & Growth", "Startup",
        "Vibrant gradient headers emphasizing rapid growth metrics and product scaling.",
        ["Startup Founders", "Growth Leads", "Head of Product"],
        ["Venture Backed", "High Growth", "Startups"],
        "Growth Focus", "from-sky-500 to-indigo-600", 1, "banner", "outfit", 95, 98, "#0284c7",
        SourceType.ADAPTED, "https://github.com/mattyHerzig/mattys_resume", "Matty Herzig", "MIT License",
        "Adapted banner header layout and gradient accent bar into RenderEngine.", True
    )

    add_template(
        "high-growth-scaleup", "26 High-Growth Scaleup", "Startup",
        "Vibrant layout tailored for early hires and growth engineers highlighting ARR metrics.",
        ["Growth Engineers", "Product Managers"], ["Startups", "Fintech"],
        "Scaleup Focus", "from-indigo-600 to-cyan-600", 1, "banner", "outfit", 95, 97, "#4f46e5"
    )

    # --- 2 SPECIALIZED TEMPLATES ---
    add_template(
        "medical", "27 Medical Practitioner", "Medical",
        "Clean emerald tones tailored for medical practitioners, physicians, and nurses.",
        ["Physicians", "Nurses", "Medical Specialists"],
        ["Healthcare", "Hospitals", "Biotech"],
        "Clinical Focus", "from-emerald-600 to-teal-800", 1, "left-aligned", "roboto", 98, 93, "#059669"
    )

    add_template(
        "legal", "28 Legal Counsel & Compliance", "Legal",
        "Balanced indigo layout highlighting strategic legal initiatives, litigation, and compliance.",
        ["Attorneys", "Legal Counsel", "Compliance Officers"],
        ["Legal", "Corporate Law", "Government"],
        "Strategic Impact", "from-indigo-600 to-purple-800", 1, "left-aligned", "inter", 96, 93, "#4338ca"
    )

    return templates


class TemplateRegistry:
    def __init__(self):
        self._templates: Dict[str, TemplateDefinition] = _build_default_templates()
        self._favorites: Dict[str, List[str]] = {}  # user_id -> template_ids

    def register(self, definition: TemplateDefinition):
        self._templates[definition.id] = definition

    def get(self, template_id: str) -> Optional[TemplateDefinition]:
        return self._templates.get(template_id)

    def get_template(self, template_id: str) -> Optional[TemplateDefinition]:
        return self.get(template_id)

    def list_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[TemplateDefinition]:
        result = list(self._templates.values())

        if category and category.lower() != "all" and category.lower() != "todas":
            result = [t for t in result if any(c.lower() == category.lower() for c in t.metadata.categories)]

        if search:
            q = search.lower()
            result = [
                t for t in result
                if q in t.name.lower() or q in t.description.lower() or any(q in r.lower() for r in t.metadata.recommended_roles)
            ]

        return result

    def get_categories(self) -> List[str]:
        cats = set()
        for t in self._templates.values():
            for c in t.metadata.categories:
                cats.add(c)
        return ["All", "ATS", "Professional", "Executive", "Corporate", "Technology", "Engineering", "Finance", "Medical", "Legal", "Academic", "Minimal", "Creative", "Startup"]

    def add_favorite(self, user_id: str, template_id: str) -> List[str]:
        if user_id not in self._favorites:
            self._favorites[user_id] = []
        if template_id not in self._favorites[user_id] and template_id in self._templates:
            self._favorites[user_id].append(template_id)
        return self._favorites[user_id]

    def remove_favorite(self, user_id: str, template_id: str) -> List[str]:
        if user_id in self._favorites and template_id in self._favorites[user_id]:
            self._favorites[user_id].remove(template_id)
        return self._favorites.get(user_id, [])

    def get_favorites(self, user_id: str) -> List[TemplateDefinition]:
        fav_ids = self._favorites.get(user_id, [])
        return [self._templates[tid] for tid in fav_ids if tid in self._templates]


# Global Singleton Registry Instance
template_registry = TemplateRegistry()
