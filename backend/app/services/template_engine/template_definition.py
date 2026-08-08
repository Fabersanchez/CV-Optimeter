"""
CV OPTIMETER TEMPLATE REGISTRY - TEMPLATE DEFINITION SCHEMA
Typed Pydantic contracts for TemplateDefinition, Metadata, LicenseManifest, LayoutGrid, and QualityScores.
"""

import time
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class TemplateState(str, Enum):
    DRAFT = "DRAFT"
    VALIDATING = "VALIDATING"
    READY = "READY"
    PUBLISHED = "PUBLISHED"
    DEPRECATED = "DEPRECATED"
    DISABLED = "DISABLED"
    LICENSE_REVIEW_REQUIRED = "LICENSE_REVIEW_REQUIRED"


class SourceType(str, Enum):
    ORIGINAL = "ORIGINAL"
    ADAPTED = "ADAPTED"
    EXTERNAL = "EXTERNAL"


class LicenseManifest(BaseModel):
    source_type: SourceType = SourceType.ORIGINAL
    license_type: str = "CV Optimeter Enterprise License"  # MIT | Apache-2.0 | CC-BY-4.0 | Proprietary
    author: str = "CV Optimeter AI Engineering Team"
    source_repository: Optional[str] = None
    source_author: Optional[str] = None
    source_license: Optional[str] = None
    source_version: Optional[str] = None
    adaptation_notes: Optional[str] = None
    source_url: Optional[str] = None
    license_url: Optional[str] = None
    attribution_required: bool = False
    commercial_use: bool = True
    modification_allowed: bool = True
    redistribution_allowed: bool = True
    verified: bool = True


class TypographyConfig(BaseModel):
    font_pairing: str = "inter"  # inter | roboto | fira-code | merriweather | outfit
    heading_font: str = "Inter"
    body_font: str = "Inter"
    font_size_scale: str = "normal"  # compact | normal | spacious
    line_height: float = 1.45


class ColorPalette(BaseModel):
    primary: str = "#0284c7"
    secondary: str = "#0f172a"
    accent: str = "#38bdf8"
    background: str = "#ffffff"
    text: str = "#0f172a"
    sidebar_bg: Optional[str] = None


class LayoutGridConfig(BaseModel):
    columns: int = 1  # 1 | 2
    column_ratio: str = "100%"  # 100% | 30%-70% | 35%-65%
    margins: str = "normal"  # compact | normal | spacious
    spacing_density: str = "normal"  # compact | normal | spacious
    header_style: str = "left-aligned"  # left-aligned | centered | banner | split


class ATSRules(BaseModel):
    safe: bool = True
    parse_rate_rating: int = 98  # 0 - 100
    multi_column_safe: bool = True
    custom_fonts_allowed: bool = True
    table_less: bool = True


class TemplateQualityScore(BaseModel):
    ats: int = 98
    visual: int = 95
    readability: int = 96
    density: int = 92
    hierarchy: int = 96
    overall: float = 95.4


class TemplateMetadata(BaseModel):
    categories: List[str] = Field(default_factory=lambda: ["Professional"])
    recommended_roles: List[str] = Field(default_factory=list)
    target_industries: List[str] = Field(default_factory=list)
    seniority_levels: List[str] = Field(default_factory=lambda: ["Junior", "Mid", "Senior", "Executive"])
    density_level: str = "balanced"  # compact | balanced | spacious
    recommended_pages: int = 1
    badge: str = "99% ATS Pass Rate"
    badge_color: str = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    preview_gradient: str = "from-sky-600 to-indigo-600"


class TemplateDefinition(BaseModel):
    id: str
    name: str
    slug: str
    version: str = "1.0.0"
    description: str
    state: TemplateState = TemplateState.PUBLISHED
    license: LicenseManifest = Field(default_factory=LicenseManifest)
    metadata: TemplateMetadata = Field(default_factory=TemplateMetadata)
    layout: LayoutGridConfig = Field(default_factory=LayoutGridConfig)
    typography: TypographyConfig = Field(default_factory=TypographyConfig)
    colors: ColorPalette = Field(default_factory=ColorPalette)
    ats: ATSRules = Field(default_factory=ATSRules)
    quality: TemplateQualityScore = Field(default_factory=TemplateQualityScore)
    created_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)
