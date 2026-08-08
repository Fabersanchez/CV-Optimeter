"""
CV OPTIMETER GOLDEN DOCUMENT FIXTURES
Controlled test document fixtures representing real-world PDF/DOCX layouts:
1. single_column_1page_pdf
2. multi_page_2page_pdf
3. two_column_split_pdf
4. sidebar_photo_pdf
5. table_technical_docx
6. academic_serif_docx
"""

from typing import Dict, Any, List

GOLDEN_FIXTURES: Dict[str, Dict[str, Any]] = {
    "single_column_1page_pdf": {
        "filename": "golden_single_col_1p.pdf",
        "format": "PDF",
        "expected_pages": 1,
        "expected_layout": "1-column",
        "expected_sections": 5,
        "candidate_cv": {
            "id": "cv-golden-01",
            "title": "Ana Martinez Resume",
            "contact": {
                "name": "Ana Martínez",
                "title": "Senior Frontend Engineer",
                "email": "ana.martinez@devmail.io",
                "phone": "+34 611 222 333",
                "location": "Valencia, Spain"
            },
            "summary": "Ingeniera Frontend con 6+ años de experiencia construyendo interfaces reactivas en Next.js y React.",
            "experience": [
                {
                    "id": "exp-1",
                    "company": "Vortex Software",
                    "role": "Senior Frontend Developer",
                    "startDate": "2021",
                    "endDate": "Present",
                    "bullets": ["Optimización de renderizado reduciendo First Contentful Paint en un 45%."]
                }
            ],
            "education": [
                {
                    "id": "edu-1",
                    "institution": "Universidad de Valencia",
                    "degree": "Grado en Ingeniería Multimedia",
                    "startDate": "2015",
                    "endDate": "2019"
                }
            ],
            "skillGroups": [
                {
                    "id": "sg-1",
                    "category": "Frontend",
                    "skills": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "Jest"]
                }
            ]
        }
    },
    "two_column_sidebar_pdf": {
        "filename": "golden_two_col_sidebar.pdf",
        "format": "PDF",
        "expected_pages": 1,
        "expected_layout": "2-column-sidebar",
        "expected_sections": 6,
        "candidate_cv": {
            "id": "cv-golden-02",
            "title": "Luis Fernandez Resume",
            "contact": {
                "name": "Luis Fernández",
                "title": "UX/UI Product Designer",
                "email": "luis.fernandez@designmail.io",
                "phone": "+34 622 333 444",
                "location": "Madrid, Spain"
            },
            "summary": "Diseñador de Producto especialista en Design Systems y prototipado Figma para plataformas SaaS.",
            "experience": [
                {
                    "id": "exp-1",
                    "company": "PixelCraft Studios",
                    "role": "Lead Product Designer",
                    "startDate": "2020",
                    "endDate": "Present",
                    "bullets": ["Creó el Design System global consumido por 12 equipos de ingeniería."]
                }
            ],
            "education": [
                {
                    "id": "edu-1",
                    "institution": "IED Madrid",
                    "degree": "Máster en Diseño UI/UX",
                    "startDate": "2017",
                    "endDate": "2018"
                }
            ],
            "skillGroups": [
                {
                    "id": "sg-1",
                    "category": "Design",
                    "skills": ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"]
                }
            ]
        }
    },
    "multi_page_2page_pdf": {
        "filename": "golden_multipage_2p.pdf",
        "format": "PDF",
        "expected_pages": 2,
        "expected_layout": "1-column",
        "expected_sections": 7,
        "candidate_cv": {
            "id": "cv-golden-03",
            "title": "Javier Gomez Executive Resume",
            "contact": {
                "name": "Javier Gómez",
                "title": "Vice President of Technology & Infrastructure",
                "email": "javier.gomez@enterprisemail.io",
                "phone": "+34 633 444 555",
                "location": "Barcelona, Spain"
            },
            "summary": "Vicepresidente de Tecnología con 15+ años liderando transformación digital y equipos globales de 150+ ingenieros.",
            "experience": [
                {
                    "id": "exp-1",
                    "company": "Global Tech Corp",
                    "role": "VP of Engineering",
                    "startDate": "2018",
                    "endDate": "Present",
                    "bullets": ["Gestión de presupuesto anual de $12M USD y roadmap de infraestructura global."]
                },
                {
                    "id": "exp-2",
                    "company": "CloudMatrix Systems",
                    "role": "Director of Cloud Operations",
                    "startDate": "2013",
                    "endDate": "2018",
                    "bullets": ["Redujo costos operativos en un 30% mediante migración a AWS."]
                }
            ],
            "education": [
                {
                    "id": "edu-1",
                    "institution": "IESE Business School",
                    "degree": "Executive MBA",
                    "startDate": "2014",
                    "endDate": "2016"
                }
            ],
            "skillGroups": [
                {
                    "id": "sg-1",
                    "category": "Leadership",
                    "skills": ["Executive Leadership", "Strategic Planning", "Cloud Architecture", "Budgeting", "Team Scaling"]
                }
            ]
        }
    }
}
