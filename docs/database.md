# Database Schema & Data Models

**CV Optimeter AI** utilizes PostgreSQL as its relational data store managed via SQLAlchemy ORM models.

---

## Entity Relationship Diagram

```
+-------------------+       +-----------------------+       +---------------------+
|      Users        |       |        Resumes        |       |    ResumeVersions   |
+-------------------+       +-----------------------+       +---------------------+
| id (UUID, PK)     | 1   * | id (UUID, PK)         | 1   * | id (UUID, PK)       |
| email (VARCHAR)   |-------| user_id (FK)          |-------| cv_id (FK)          |
| password_hash     |       | title (VARCHAR)       |       | version (VARCHAR)   |
| plan (VARCHAR)    |       | raw_text (TEXT)       |       | ats_score (INT)     |
| created_at        |       | created_at            |       | changes_summary     |
+-------------------+       +-----------------------+       +---------------------+
                                        | 1
                                        |
                                        | *
                            +-----------------------+
                            |     ATSAnalyses       |
                            +-----------------------+
                            | id (UUID, PK)         |
                            | cv_id (FK)            |
                            | overall_score (INT)   |
                            | diagnostics (JSONB)   |
                            | created_at            |
                            +-----------------------+
```

---

## Data Model Specifications

- **Users:** Stores user profiles, authentication metadata, and subscription tiers (Free, Pro Candidate, Enterprise).
- **Resumes:** Stores original uploaded resume text, parsed contact details, and current section JSON.
- **ResumeVersions:** Historical version audit log tracking ATS score evolution across revisions.
- **ATSAnalyses:** Audit log of ATS evaluation breakdowns, missing keywords, and recommendations.
