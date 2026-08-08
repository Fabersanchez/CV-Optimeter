"""
CV OPTIMETER DATA-FIRST ARCHITECTURE - CANDIDATE CV SCHEMA (SINGLE SOURCE OF TRUTH)
Schema representing structured candidate data independently of visual styling.
Supports JSON Resume compatibility, field confidence, source tracking, and custom sections.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class FieldMetadata(BaseModel):
    value: Any = ""
    source: str = "document_extraction"
    confidence: float = 1.0
    normalized_value: Optional[str] = None


class BasicsModel(BaseModel):
    name: str = ""
    headline: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    city: Optional[str] = None
    country: Optional[str] = None
    linkedin: str = ""
    github: str = ""
    website: str = ""
    photo: Optional[str] = None  # Base64 or URL


class ContactInfoModel(BaseModel):
    name: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    city: Optional[str] = None
    country: Optional[str] = None
    linkedin: str = ""
    github: str = ""
    website: str = ""
    photoUrl: Optional[str] = None


class WorkExperienceModel(BaseModel):
    id: str
    company: str
    position: str = ""
    role: str = ""  # Alias for position
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""
    achievements: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)


class EducationItemModel(BaseModel):
    id: str
    institution: str
    degree: str
    field: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    description: str = ""
    gpa: Optional[str] = None


class SkillItemModel(BaseModel):
    name: str
    level: str = "Proficient"  # Beginner | Intermediate | Proficient | Expert


class SkillGroupModel(BaseModel):
    id: str
    category: str
    skills: List[str] = Field(default_factory=list)
    skill_items: List[SkillItemModel] = Field(default_factory=list)


class ProjectItemModel(BaseModel):
    id: str
    title: str
    role: str = ""
    link: str = ""
    startDate: str = ""
    endDate: str = ""
    description: str = ""
    bullets: List[str] = Field(default_factory=list)


class CertificationItemModel(BaseModel):
    id: str
    name: str
    issuer: str = ""
    date: str = ""
    link: Optional[str] = None


class LanguageItemModel(BaseModel):
    id: str
    language: str
    proficiency: str = "Native / Full Professional"


class AwardItemModel(BaseModel):
    id: str
    title: str
    issuer: str = ""
    date: str = ""
    summary: str = ""


class VolunteerItemModel(BaseModel):
    id: str
    organization: str
    position: str = ""
    startDate: str = ""
    endDate: str = ""
    summary: str = ""


class ReferenceItemModel(BaseModel):
    id: str
    name: str
    reference: str = ""


class SourceMetadataModel(BaseModel):
    filename: str = "document.pdf"
    file_type: str = "PDF"
    extraction_method: str = "PyMuPDF + MultilingualSectionClassifier"
    confidence: float = 1.0
    page_count: int = 1
    total_word_count: int = 0


class CandidateCVSchema(BaseModel):
    id: str = "cv-schema-001"
    title: str = "Candidate CV"
    basics: BasicsModel = Field(default_factory=BasicsModel)
    contact: ContactInfoModel = Field(default_factory=ContactInfoModel)
    summary: str = ""
    experience: List[WorkExperienceModel] = Field(default_factory=list)
    education: List[EducationItemModel] = Field(default_factory=list)
    skillGroups: List[SkillGroupModel] = Field(default_factory=list)
    projects: List[ProjectItemModel] = Field(default_factory=list)
    certifications: List[CertificationItemModel] = Field(default_factory=list)
    languages: List[LanguageItemModel] = Field(default_factory=list)
    awards: List[AwardItemModel] = Field(default_factory=list)
    volunteer: List[VolunteerItemModel] = Field(default_factory=list)
    references: List[ReferenceItemModel] = Field(default_factory=list)
    sectionOrder: List[str] = Field(
        default_factory=lambda: ["summary", "experience", "skills", "education", "projects", "certifications"]
    )
    source_metadata: SourceMetadataModel = Field(default_factory=SourceMetadataModel)
    semantic_confidence: float = 1.0
    requires_review: bool = False
