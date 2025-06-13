import asyncio
from datetime import datetime, UTC, timedelta

from app.config import DatabaseSettings, get_settings
from app.jobs.documents import Job
from app.organizations.documents import Organization
from app.database import initialize_database


async def insert_healthcare_jobs():
    # Find the organization with slug "aryan"
    async with initialize_database(
        str(get_settings(DatabaseSettings).database_url),
        get_settings(DatabaseSettings).default_database_name,
    ):
        org = await Organization.find_one({"slug": "aryan"})
        if not org:
            print("Organization with slug 'aryan' not found.")
            return

        jobs = [
            Job(
                title="Senior Cardiologist",
                slug="senior-cardiologist",
                description="""
# Senior Cardiologist

We are seeking an **experienced Cardiologist** to join our cardiac care team at a leading hospital in Mumbai. This is a unique opportunity to work with a multidisciplinary team and make a significant impact on patient care.

## Responsibilities

- **Diagnostic Testing:** Perform advanced diagnostic tests and procedures, including echocardiograms, stress tests, and cardiac catheterizations.
- **Treatment Planning:** Develop and implement comprehensive treatment plans for patients with a variety of heart conditions, including chronic and acute cases.
- **Collaboration:** Work closely with surgeons, nurses, and other healthcare professionals to ensure optimal patient outcomes.
- **Research & Clinical Trials:** Participate in ongoing research projects and clinical trials to advance the field of cardiology and improve patient care protocols.
- **Mentorship:** Mentor and guide junior cardiologists, medical residents, and support staff, fostering a culture of continuous learning.
- **Patient Education:** Educate patients and their families about heart health, preventive measures, and post-treatment care.

## Qualifications

- Board certification in Cardiology
- Minimum 8 years of experience in a clinical setting
- Strong leadership and communication skills
- Commitment to patient-centered care

## Location

Mumbai, Maharashtra
""",
                type="full_time",
                work_mode="office",
                location="Mumbai, Maharashtra",
                geo=None,
                skills=[
                    "cardiology",
                    "echocardiography",
                    "patient care",
                    "medical leadership",
                ],
                currency="INR",
                min_salary=2500000,
                max_salary=3500000,
                min_experience=8,
                max_experience=15,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=30),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Telemedicine Physician",
                slug="telemedicine-physician",
                description="""
# Telemedicine Physician

Join our **growing telemedicine team** to provide virtual healthcare services to patients across India. This role is ideal for physicians who are passionate about digital health and want to make healthcare more accessible.

## Responsibilities

- **Virtual Consultations:** Conduct thorough virtual consultations with patients using secure telemedicine platforms.
- **Diagnosis & Treatment:** Diagnose and treat a wide range of common medical conditions, providing evidence-based care remotely.
- **Medication Management:** Prescribe medications when appropriate and ensure patients understand their treatment plans.
- **Electronic Health Records:** Maintain detailed and accurate electronic health records for all patient interactions.
- **Follow-up Care:** Provide follow-up care, referrals to specialists, and coordinate with other healthcare providers as needed.
- **Patient Education:** Educate patients on preventive care, chronic disease management, and healthy lifestyle choices.

## Qualifications

- MBBS or equivalent medical degree
- Minimum 3 years of clinical experience
- Experience with telemedicine platforms is a plus
- Excellent communication and digital literacy skills

## Location

Remote (Work from anywhere)
""",
                type="full_time",
                work_mode="remote",
                location="Remote",
                geo=None,
                skills=[
                    "telemedicine",
                    "primary care",
                    "digital health",
                    "patient communication",
                ],
                currency="INR",
                min_salary=1200000,
                max_salary=1800000,
                min_experience=3,
                max_experience=8,
                vacancies=2,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=45),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Pediatric Nurse Practitioner",
                slug="pediatric-nurse-practitioner",
                description="""
# Pediatric Nurse Practitioner

We are seeking a **Pediatric Nurse Practitioner** to provide comprehensive care to children from birth through adolescence. This role is perfect for compassionate professionals dedicated to child health and development.

## Responsibilities

- **Physical Examinations:** Perform thorough physical exams and developmental assessments for pediatric patients.
- **Diagnosis & Treatment:** Diagnose and treat common childhood illnesses and injuries, ensuring timely and effective care.
- **Preventive Care:** Administer vaccinations, conduct health screenings, and provide preventive care education to families.
- **Parental Guidance:** Educate parents and caregivers on child health, nutrition, and developmental milestones.
- **Collaboration:** Work closely with pediatricians, specialists, and allied health professionals to coordinate care.
- **Record Keeping:** Maintain accurate and confidential patient records in compliance with healthcare regulations.

## Qualifications

- Registered Nurse with Pediatric specialization
- 2+ years of experience in pediatric care
- Strong communication and interpersonal skills

## Location

Delhi, NCR (Hybrid)
""",
                type="full_time",
                work_mode="hybrid",
                location="Delhi, NCR",
                geo=None,
                skills=[
                    "pediatrics",
                    "nursing",
                    "child development",
                    "patient education",
                ],
                currency="INR",
                min_salary=800000,
                max_salary=1200000,
                min_experience=2,
                max_experience=5,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=60),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Medical Laboratory Technician",
                slug="medical-laboratory-technician",
                description="""
# Medical Laboratory Technician

Join our **state-of-the-art medical laboratory team** and play a crucial role in patient diagnosis and treatment. This position offers hands-on experience with advanced laboratory equipment and technologies.

## Responsibilities

- **Laboratory Testing:** Perform routine and specialized laboratory tests on blood, tissue, and other samples.
- **Equipment Maintenance:** Operate, calibrate, and maintain laboratory equipment to ensure accuracy and safety.
- **Quality Control:** Implement and monitor quality control procedures to maintain high standards of laboratory practice.
- **Data Analysis:** Record, analyze, and interpret test results, providing critical information to healthcare providers.
- **Collaboration:** Work with physicians, nurses, and other lab staff to support patient care.
- **Safety Compliance:** Adhere to all safety and infection control protocols.

## Qualifications

- Diploma or degree in Medical Laboratory Technology
- 1-3 years of laboratory experience
- Attention to detail and strong analytical skills

## Location

Bangalore, Karnataka
""",
                type="full_time",
                work_mode="office",
                location="Bangalore, Karnataka",
                geo=None,
                skills=[
                    "laboratory testing",
                    "medical equipment",
                    "quality control",
                    "data analysis",
                ],
                currency="INR",
                min_salary=400000,
                max_salary=600000,
                min_experience=1,
                max_experience=3,
                vacancies=2,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=30),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Mental Health Counselor",
                slug="mental-health-counselor",
                description="""
# Mental Health Counselor

We're looking for a **compassionate Mental Health Counselor** to provide therapy and support services to individuals and groups. This role is vital in promoting mental wellness and resilience in our community.

## Responsibilities

- **Therapy Sessions:** Conduct individual and group therapy sessions using evidence-based approaches.
- **Treatment Planning:** Develop personalized treatment plans tailored to each client's needs and goals.
- **Record Keeping:** Maintain confidential and accurate patient records, documenting progress and outcomes.
- **Collaboration:** Work with psychiatrists, psychologists, and other healthcare providers to coordinate care.
- **Crisis Intervention:** Provide immediate support and intervention during mental health crises.
- **Community Outreach:** Participate in mental health awareness programs and workshops.

## Qualifications

- Master's degree in Counseling, Psychology, or related field
- 2+ years of clinical experience
- Strong empathy and communication skills

## Location

Hyderabad, Telangana (Hybrid)
""",
                type="part_time",
                work_mode="hybrid",
                location="Hyderabad, Telangana",
                geo=None,
                skills=[
                    "counseling",
                    "mental health",
                    "therapy",
                    "crisis intervention",
                ],
                currency="INR",
                min_salary=600000,
                max_salary=900000,
                min_experience=2,
                max_experience=5,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=45),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Healthcare IT Specialist",
                slug="healthcare-it-specialist",
                description="""
# Healthcare IT Specialist

Join our **IT team** to support and optimize healthcare technology systems in a dynamic environment. This role is ideal for tech-savvy professionals passionate about improving healthcare delivery through technology.

## Responsibilities

- **System Maintenance:** Maintain and optimize electronic health record (EHR) systems and other healthcare software.
- **Implementation:** Assist in the implementation of new healthcare software solutions and upgrades.
- **Compliance:** Ensure HIPAA compliance and robust data security across all systems.
- **Technical Support:** Provide technical support and training to healthcare staff on IT systems and best practices.
- **Troubleshooting:** Diagnose and resolve technical issues promptly to minimize downtime.
- **Documentation:** Maintain comprehensive documentation of IT processes and system configurations.

## Qualifications

- Degree in Information Technology, Computer Science, or related field
- 3+ years of experience in healthcare IT
- Knowledge of EHR systems and healthcare regulations

## Location

Pune, Maharashtra (Hybrid)
""",
                type="full_time",
                work_mode="hybrid",
                location="Pune, Maharashtra",
                geo=None,
                skills=[
                    "healthcare IT",
                    "EHR systems",
                    "HIPAA compliance",
                    "technical support",
                ],
                currency="INR",
                min_salary=800000,
                max_salary=1200000,
                min_experience=3,
                max_experience=6,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=30),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Physical Therapist",
                slug="physical-therapist",
                description="""
# Physical Therapist

We are seeking a **Physical Therapist** to help patients recover from injuries, surgeries, and chronic conditions. This role is essential for improving patient mobility and quality of life.

## Responsibilities

- **Treatment Planning:** Develop personalized rehabilitation plans based on patient assessments and goals.
- **Therapeutic Exercises:** Guide patients through therapeutic exercises and use specialized equipment for rehabilitation.
- **Progress Monitoring:** Monitor and document patient progress, adjusting treatment plans as needed.
- **Patient Education:** Educate patients and families on exercises, injury prevention, and healthy lifestyle habits.
- **Collaboration:** Work with physicians, nurses, and other therapists to coordinate comprehensive care.
- **Record Keeping:** Maintain accurate and confidential patient records.

## Qualifications

- Degree in Physical Therapy
- 2+ years of clinical experience
- Strong interpersonal and motivational skills

## Location

Chennai, Tamil Nadu
""",
                type="full_time",
                work_mode="office",
                location="Chennai, Tamil Nadu",
                geo=None,
                skills=[
                    "physical therapy",
                    "rehabilitation",
                    "patient care",
                    "therapeutic exercises",
                ],
                currency="INR",
                min_salary=700000,
                max_salary=1000000,
                min_experience=2,
                max_experience=5,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=60),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Medical Billing Specialist",
                slug="medical-billing-specialist",
                description="""
# Medical Billing Specialist

Join our **finance team** to handle medical billing and insurance claims in a fast-paced healthcare environment. This position is crucial for ensuring accurate and timely reimbursement for services rendered.

## Responsibilities

- **Claims Processing:** Process medical claims and insurance billing with attention to detail and accuracy.
- **Insurance Verification:** Verify insurance coverage and benefits for patients, resolving discrepancies as needed.
- **Patient Inquiries:** Handle patient billing inquiries with professionalism and empathy.
- **Record Maintenance:** Maintain accurate and up-to-date billing records in compliance with healthcare regulations.
- **Compliance:** Ensure all billing practices adhere to healthcare billing regulations and standards.
- **Collaboration:** Work with healthcare providers and insurance companies to resolve billing issues.

## Qualifications

- Degree or diploma in Medical Billing, Healthcare Administration, or related field
- 1-3 years of experience in medical billing
- Strong organizational and communication skills

## Location

Remote (Work from anywhere)
""",
                type="full_time",
                work_mode="remote",
                location="Remote",
                geo=None,
                skills=[
                    "medical billing",
                    "insurance claims",
                    "healthcare finance",
                    "patient billing",
                ],
                currency="INR",
                min_salary=400000,
                max_salary=600000,
                min_experience=1,
                max_experience=3,
                vacancies=2,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=45),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Emergency Room Nurse",
                slug="emergency-room-nurse",
                description="""
# Emergency Room Nurse

We are seeking **experienced ER Nurses** to provide critical care in our emergency department. This is a high-impact role for professionals who thrive in fast-paced, challenging environments.

## Responsibilities

- **Triage & Assessment:** Triage patients and assess their conditions quickly and accurately.
- **Emergency Care:** Provide emergency medical care, including administering medications and treatments.
- **Collaboration:** Work closely with emergency physicians and other healthcare staff to deliver coordinated care.
- **Equipment Management:** Maintain and operate emergency room equipment, ensuring readiness for all situations.
- **Patient Advocacy:** Advocate for patients and provide emotional support to families during emergencies.
- **Documentation:** Maintain detailed and accurate records of patient care and interventions.

## Qualifications

- Registered Nurse (RN) with ER experience
- 2+ years in emergency care
- Ability to remain calm under pressure

## Location

Kolkata, West Bengal
""",
                type="full_time",
                work_mode="office",
                location="Kolkata, West Bengal",
                geo=None,
                skills=[
                    "emergency care",
                    "triage",
                    "critical care",
                    "patient assessment",
                ],
                currency="INR",
                min_salary=600000,
                max_salary=900000,
                min_experience=2,
                max_experience=5,
                vacancies=3,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=30),
                is_active=True,
                organization=org,
            ),
            Job(
                title="Healthcare Administrator",
                slug="healthcare-administrator",
                description="""
# Healthcare Administrator

Join our **management team** to oversee healthcare operations and ensure the smooth functioning of our facility. This leadership role is ideal for professionals with a passion for healthcare management and organizational excellence.

## Responsibilities

- **Operations Management:** Oversee daily healthcare facility operations, ensuring efficiency and quality of care.
- **Policy Implementation:** Develop and implement healthcare policies and procedures in line with regulatory standards.
- **Staff Coordination:** Coordinate with medical staff and departments to optimize resource allocation and workflow.
- **Budgeting:** Handle budgeting, financial planning, and resource allocation to support organizational goals.
- **Compliance:** Ensure compliance with all healthcare regulations and accreditation requirements.
- **Continuous Improvement:** Lead quality improvement initiatives and foster a culture of excellence.

## Qualifications

- Degree in Healthcare Administration or related field
- 5+ years of experience in healthcare management
- Strong leadership and organizational skills

## Location

Ahmedabad, Gujarat
""",
                type="full_time",
                work_mode="office",
                location="Ahmedabad, Gujarat",
                geo=None,
                skills=[
                    "healthcare management",
                    "operations",
                    "budgeting",
                    "regulatory compliance",
                ],
                currency="INR",
                min_salary=1000000,
                max_salary=1500000,
                min_experience=5,
                max_experience=10,
                vacancies=1,
                updated_at=datetime.now(UTC),
                expires_at=datetime.now(UTC) + timedelta(days=60),
                is_active=True,
                organization=org,
            ),
        ]

        await Job.insert_many(jobs)
        print("Inserted 10 healthcare jobs under organization 'aryan'.")


# Run the async function
asyncio.run(insert_healthcare_jobs())
