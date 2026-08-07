from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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

class WorkExperienceModel(BaseModel):
    id: str
    company: str
    role: str
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    current: bool = False
    description: str = ""
    bullets: List[str] = Field(default_factory=list)

class EducationItemModel(BaseModel):
    id: str
    institution: str
    degree: str
    field: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    gpa: Optional[str] = None

class SkillGroupModel(BaseModel):
    id: str
    category: str
    skills: List[str] = Field(default_factory=list)

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
    proficiency: str = "Professional"

class AchievementItemModel(BaseModel):
    id: str
    title: str
    impact: str = ""
    metric: str = ""

class PublicationItemModel(BaseModel):
    id: str
    title: str
    publisher: str = ""
    date: str = ""
    link: Optional[str] = None

class DocumentMetadataModel(BaseModel):
    sourceFormat: str = "PDF"
    parsedTimestamp: str = ""
    totalWordCount: int = 0
    estimatedPageCount: int = 1
    languageDetected: str = "en"

class CandidateCVSchema(BaseModel):
    id: str = "cv-001"
    title: str = "Candidate CV"
    contact: ContactInfoModel = Field(default_factory=ContactInfoModel)
    summary: str = ""
    experience: List[WorkExperienceModel] = Field(default_factory=list)
    education: List[EducationItemModel] = Field(default_factory=list)
    skillGroups: List[SkillGroupModel] = Field(default_factory=list)
    projects: List[ProjectItemModel] = Field(default_factory=list)
    certifications: List[CertificationItemModel] = Field(default_factory=list)
    languages: List[LanguageItemModel] = Field(default_factory=list)
    achievements: List[AchievementItemModel] = Field(default_factory=list)
    publications: List[PublicationItemModel] = Field(default_factory=list)
    sectionOrder: List[str] = Field(
        default_factory=lambda: ["summary", "experience", "skills", "education", "projects", "certifications"]
    )
    metadata: DocumentMetadataModel = Field(default_factory=DocumentMetadataModel)
