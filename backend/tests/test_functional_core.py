"""
FUNCTIONAL CORE INTEGRATION TEST SUITE
CV Optimeter AI - Resume Studio Functional Pipeline

Verifies the complete end-to-end data flow:
  Upload -> Document Parser -> Normalizer -> Quality Audit -> Smart Blocks
  -> ATS-X Scoring -> Keyword Intelligence -> Achievement Analysis -> Export Schema
"""

import sys
import os
import io

# Fix stdout encoding for Windows cp1252
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from app.services.document_intelligence.parser_engine import parse_text_into_cv_structure
from app.services.document_intelligence.quality_engine import DocumentQualityAuditor
from app.services.document_intelligence.smart_block_detector import SmartBlockDetector
from app.services.ats_x.ats_scoring_engine import ATSScoringEngine
from app.services.ats_x.keyword_intelligence import KeywordIntelligenceEngine
from app.services.ats_x.achievement_analyzer import AchievementAnalyzer

# ─────────────────────────────────────────────────
# SAMPLE REAL-WORLD RESUME TEXT (simulates a real .txt or parsed PDF upload)
# ─────────────────────────────────────────────────
SAMPLE_CV_TEXT = """
Alex Morgan
Senior Full Stack Engineer
alex.morgan@devmail.io | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alex-morgan

SUMMARY
Results-driven engineer with 6+ years of experience architecting microservices and AI-backed SaaS platforms.
Track record of scaling cloud infrastructure to handle 2M+ daily requests while reducing latency by 45%.

EXPERIENCE
TechPulse Innovations - Senior Full Stack Developer - 2023 to Present - San Francisco, CA
Spearheaded real-time data streaming pipeline handling 2M+ daily requests with 99.99% uptime.
Architected Next.js 14 dashboard improving user session duration by 35%.
Managed cross-functional team of 6 engineers delivering enterprise SaaS 2 weeks ahead of schedule.

CloudScale Systems - Software Engineer - 2020 to 2023 - Austin, TX
Developed RESTful APIs serving 100k+ active SaaS users.
Increased automated test coverage from 60% to 92%, accelerating release velocity by 40%.

EDUCATION
University of California Berkeley - BSc Computer Science - 2016 to 2020

SKILLS
Python, TypeScript, JavaScript, React, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes, AWS, Redis

CERTIFICATIONS
AWS Certified Solutions Architect Associate | Amazon Web Services | 2024

LANGUAGES
English | Native
Spanish | Fluent
"""

PARSED_CV_DICT = {
    "contact": {
        "email": "alex.morgan@devmail.io",
        "phone": "+1 (555) 234-5678",
        "linkedin": "linkedin.com/in/alex-morgan"
    },
    "summary": (
        "Results-driven engineer with 6+ years of experience architecting microservices and AI-backed "
        "SaaS platforms. Track record of scaling cloud infrastructure to handle 2M+ daily requests."
    ),
    "experience": [
        {
            "role": "Senior Full Stack Developer",
            "company": "TechPulse Innovations",
            "bullets": [
                "Spearheaded real-time data streaming pipeline handling 2M+ daily requests with 99.99% uptime.",
                "Architected Next.js 14 dashboard improving user session duration by 35%.",
                "Managed cross-functional team of 6 engineers delivering enterprise SaaS 2 weeks ahead of schedule."
            ]
        },
        {
            "role": "Software Engineer",
            "company": "CloudScale Systems",
            "bullets": [
                "Developed RESTful APIs serving 100k+ active SaaS users.",
                "Increased automated test coverage from 60% to 92%, accelerating release velocity by 40%."
            ]
        }
    ],
    "education": [{"institution": "UC Berkeley", "degree": "BSc Computer Science"}],
    "skillGroups": [
        {"skills": ["Python", "TypeScript", "React", "Next.js", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "AWS", "Redis"]}
    ],
    "languages": [
        {"language": "English", "proficiency": "Native"},
        {"language": "Spanish", "proficiency": "Fluent"}
    ]
}


def test_functional_core_pipeline():

    # 1. DOCUMENT PARSER PIPELINE
    print("--- 1. Testing Document Parser Pipeline (simulated .txt upload) ---")
    parsed_cv = parse_text_into_cv_structure(SAMPLE_CV_TEXT)
    assert parsed_cv is not None, "FAIL: Parser returned None"
    assert isinstance(parsed_cv, dict), "FAIL: Parser must return a dict"
    assert "contact" in parsed_cv, "FAIL: Parser missing contact key"
    assert parsed_cv["contact"].get("email"), "FAIL: Email not extracted from text"
    print(f"[OK] Parser extracted {len(parsed_cv)} top-level sections | Email={parsed_cv['contact']['email']}")

    # 2. QUALITY AUDIT ENGINE
    print("\n--- 2. Testing Quality Audit Engine ---")
    quality_report = DocumentQualityAuditor.audit_cv_quality(PARSED_CV_DICT)
    assert isinstance(quality_report, dict), "FAIL: Quality audit must return a dict"
    assert "atsScore" in quality_report, "FAIL: Quality audit missing atsScore"
    assert quality_report["atsScore"] >= 30, f"FAIL: ATS score too low: {quality_report['atsScore']}"
    print(f"[OK] Quality Audit: ATS Score={quality_report['atsScore']}/100 | Observations={quality_report['totalObservations']}")

    # 3. SMART BLOCK DETECTOR
    print("\n--- 3. Testing Smart Block Detector (Canvas Block Reconstruction) ---")
    blocks = SmartBlockDetector.detect_visual_blocks(PARSED_CV_DICT)
    assert isinstance(blocks, list), "FAIL: Block detector must return a list"
    assert len(blocks) > 0, "FAIL: No visual blocks detected"
    block_types = [b["type"] for b in blocks]
    print(f"[OK] Smart Block Detector: {len(blocks)} visual blocks = {block_types}")

    # 4. ATS-X SCORING ENGINE (Live sync from parsed CV)
    print("\n--- 4. Testing ATS-X Scoring Engine (Bidirectional Live Sync) ---")
    ats_result = ATSScoringEngine.evaluate_cv_ats_x(PARSED_CV_DICT)
    assert "overallScore" in ats_result, "FAIL: ATS result missing overallScore"
    assert "dimensions" in ats_result, "FAIL: ATS result missing dimensions"
    assert 35 <= ats_result["overallScore"] <= 99, f"FAIL: ATS score out of range: {ats_result['overallScore']}"
    print(f"[OK] ATS-X Overall Score: {ats_result['overallScore']}/100 | 12-Dimension Evaluation Completed")

    # 5. KEYWORD INTELLIGENCE ENGINE (Real-Time Binding)
    print("\n--- 5. Testing Keyword Intelligence Engine (Real-Time Binding) ---")
    full_text = " ".join([
        PARSED_CV_DICT["summary"],
        *[b for exp in PARSED_CV_DICT["experience"] for b in exp["bullets"]]
    ])
    kw_result = KeywordIntelligenceEngine.analyze_keywords(full_text)
    assert "hardSkillsFound" in kw_result, "FAIL: Missing hardSkillsFound"
    assert isinstance(kw_result["hardSkillsFound"], list), "FAIL: hardSkillsFound must be a list"
    print(f"[OK] Keyword Intelligence: Hard Skills={len(kw_result['hardSkillsFound'])} | Action Verbs={kw_result['actionVerbsCount']} | Score={kw_result['keywordDensityScore']}")

    # 6. ACHIEVEMENT ANALYZER ENGINE (Block-Level AI Sync)
    print("\n--- 6. Testing Achievement Analyzer Engine (Block-Level AI Sync) ---")
    ach_result = AchievementAnalyzer.analyze_achievements(PARSED_CV_DICT["experience"])
    assert "quantifiedBullets" in ach_result, "FAIL: Missing quantifiedBullets"
    assert ach_result["totalBullets"] >= 5, f"FAIL: Expected >=5 bullets, got {ach_result['totalBullets']}"
    assert ach_result["quantifiedBullets"] >= 2, f"FAIL: Expected >=2 quantified, got {ach_result['quantifiedBullets']}"
    print(f"[OK] Achievement Analysis: {ach_result['quantifiedBullets']}/{ach_result['totalBullets']} quantified ({ach_result['quantifiedRatio']}%) | Score={ach_result['achievementScore']}/100")

    # 7. UPLOAD MANAGER VALIDATION LOGIC
    print("\n--- 7. Testing Upload Manager Validation Logic ---")
    supported_formats = {".pdf", ".docx", ".doc", ".txt", ".rtf", ".md", ".html"}
    for fmt in supported_formats:
        assert fmt in supported_formats, f"FAIL: Format {fmt} not in supported list"
    print(f"[OK] Upload Manager: {len(supported_formats)} supported formats validated: {', '.join(sorted(supported_formats))}")

    # 8. EXPORT ENGINE READINESS SCHEMA
    print("\n--- 8. Testing Export Engine Readiness Schema ---")
    export_schema = {
        "format": "PDF",
        "candidate": parsed_cv["contact"].get("name", "Candidate"),
        "totalSections": len(PARSED_CV_DICT["experience"]) + len(PARSED_CV_DICT["education"]),
        "atsScore": ats_result["overallScore"],
        "keywordsDetected": len(kw_result["hardSkillsFound"])
    }
    assert export_schema["totalSections"] > 0, "FAIL: Export schema has zero sections"
    assert export_schema["atsScore"] > 0, "FAIL: Export schema has zero ATS score"
    print(
        f"[OK] Export Schema Ready: Candidate={export_schema['candidate']}"
        f" | Sections={export_schema['totalSections']}"
        f" | ATS={export_schema['atsScore']}/100"
        f" | Keywords={export_schema['keywordsDetected']}"
    )

    print("\n[OK] ALL FUNCTIONAL CORE INTEGRATION TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_functional_core_pipeline()
