import asyncio
import random
from datetime import UTC, datetime, timedelta

from app.base.models import GeoObject
from app.config import DatabaseSettings, get_settings
from app.container import create_container
from app.database import initialize_database
from app.jobs.repositories import JobRepo
from app.organizations.documents import Organization
from pymongo import AsyncMongoClient


async def insert_healthcare_jobs() -> None:
    """Insert 500+ diverse healthcare jobs across various regions for clustering demonstration."""
    # Find the organization with slug "aryan"
    await initialize_database(
        get_settings(DatabaseSettings).default_database_name,
        db_client=AsyncMongoClient(str(get_settings(DatabaseSettings).database_url)),
    )

    container = create_container()
    async with container.context() as ctx:
        job_repo = await ctx.resolve(JobRepo)

    org = await Organization.find_one({"slug": "aryan"})
    if not org:
        msg = "Organization with slug 'aryan' not found."
        raise RuntimeError(msg)

    # Define Indian cities with coordinates for geographic clustering
    cities = [
        ("Mumbai", 72.8777, 19.076),
        ("Delhi", 77.2090, 28.6139),
        ("Bangalore", 77.5946, 12.9716),
        ("Hyderabad", 78.4867, 17.3850),
        ("Chennai", 80.2707, 13.0827),
        ("Kolkata", 88.3639, 22.5726),
        ("Pune", 73.8567, 18.5204),
        ("Ahmedabad", 72.5714, 23.0225),
        ("Surat", 72.8311, 21.1702),
        ("Jaipur", 75.7873, 26.9124),
        ("Lucknow", 80.9462, 26.8467),
        ("Kanpur", 80.3319, 26.4499),
        ("Nagpur", 79.0882, 21.1458),
        ("Indore", 75.8577, 22.7196),
        ("Thane", 72.9781, 19.2183),
        ("Bhopal", 77.4126, 23.2599),
        ("Visakhapatnam", 83.2185, 17.6868),
        ("Pimpri-Chinchwad", 73.8067, 18.6298),
        ("Patna", 85.1376, 25.5941),
        ("Vadodara", 73.1812, 22.3072),
        ("Ghaziabad", 77.4538, 28.6692),
        ("Ludhiana", 75.8573, 30.9010),
        ("Agra", 78.0081, 27.1767),
        ("Nashik", 73.7898, 19.9975),
        ("Faridabad", 77.3178, 28.4089),
        ("Meerut", 77.7064, 28.9845),
        ("Rajkot", 70.8022, 22.3039),
        ("Kalyan-Dombivali", 73.1535, 19.2403),
        ("Vasai-Virar", 72.8397, 19.4919),
        ("Varanasi", 82.9739, 25.3176),
        ("Srinagar", 74.7973, 34.0837),
        ("Aurangabad", 75.3433, 19.8762),
        ("Dhanbad", 86.4304, 23.7957),
        ("Amritsar", 74.8723, 31.6340),
        ("Navi Mumbai", 73.0297, 19.0330),
        ("Allahabad", 81.8463, 25.4358),
        ("Ranchi", 85.3096, 23.3441),
        ("Howrah", 88.3109, 22.5958),
        ("Coimbatore", 76.9558, 11.0168),
        ("Jabalpur", 79.9864, 23.1815),
        ("Gwalior", 78.1828, 26.2124),
        ("Vijayawada", 80.6480, 16.5062),
        ("Jodhpur", 73.0243, 26.2389),
        ("Madurai", 78.1198, 9.9252),
        ("Raipur", 81.6296, 21.2514),
        ("Kota", 75.8648, 25.2138),
        ("Chandigarh", 76.7794, 30.7333),
        ("Guwahati", 91.7898, 26.1445),
        ("Solapur", 75.9064, 17.6599),
        ("Hubli-Dharwad", 75.1240, 15.3647),
        ("Bareilly", 79.4304, 28.3670),
        ("Moradabad", 78.7733, 28.8386),
        ("Mysore", 76.6413, 12.2958),
        ("Gurgaon", 77.0266, 28.4595),
        ("Aligarh", 78.0880, 27.8974),
        ("Jalandhar", 75.5762, 31.3260),
        ("Tiruchirappalli", 78.7047, 10.7905),
        ("Bhubaneswar", 85.8245, 20.2961),
        ("Salem", 78.1460, 11.6643),
        ("Warangal", 79.5941, 18.0061),
        ("Guntur", 80.4365, 16.3067),
        ("Bhiwandi", 73.0632, 19.2948),
        ("Saharanpur", 77.5460, 29.9680),
        ("Gorakhpur", 83.3732, 26.7606),
        ("Bikaner", 73.3119, 28.0229),
        ("Amravati", 77.7795, 20.9374),
        ("Noida", 77.3910, 28.5355),
        ("Jamshedpur", 86.1844, 22.8046),
        ("Bhilai", 81.3509, 21.1938),
        ("Cuttack", 85.8781, 20.4625),
        ("Firozabad", 78.3957, 27.1592),
        ("Kochi", 76.2673, 9.9312),
        ("Bhavnagar", 72.1519, 21.7645),
        ("Dehradun", 78.0322, 30.3165),
        ("Durgapur", 87.3119, 23.5204),
        ("Asansol", 86.9842, 23.6739),
        ("Nanded", 77.2663, 19.1383),
        ("Kolhapur", 74.2433, 16.7050),
        ("Ajmer", 74.6399, 26.4499),
        ("Akola", 77.0082, 20.7002),
        ("Gulbarga", 76.8343, 17.3297),
        ("Jamnagar", 70.0708, 22.4697),
        ("Ujjain", 75.7849, 23.1765),
        ("Loni", 77.2863, 28.7508),
        ("Siliguri", 88.3945, 26.7271),
        ("Jhansi", 78.5685, 25.4484),
        ("Ulhasnagar", 73.1648, 19.2215),
        ("Jammu", 74.8570, 32.7266),
        ("Sangli-Miraj & Kupwad", 74.5815, 16.8524),
        ("Mangalore", 74.8560, 12.9141),
        ("Erode", 77.7172, 11.3410),
        ("Belgaum", 74.4977, 15.8497),
        ("Ambattur", 80.1674, 13.1143),
        ("Tirunelveli", 77.6869, 8.7139),
        ("Malegaon", 74.5255, 20.5579),
        ("Gaya", 85.0002, 24.7914),
        ("Jalgaon", 75.5626, 21.0077),
        ("Udaipur", 73.7125, 24.5854),
        ("Maheshtala", 88.2548, 22.5092),
    ]

    # Job titles and their variations
    job_titles = [
        "Cardiologist",
        "Surgeon",
        "General Physician",
        "Pediatrician",
        "Gynecologist",
        "Orthopedic Surgeon",
        "Neurologist",
        "Anesthetist",
        "Radiologist",
        "Pathologist",
        "Dermatologist",
        "Psychiatrist",
        "Ophthalmologist",
        "ENT Specialist",
        "Urologist",
        "Oncologist",
        "Gastroenterologist",
        "Endocrinologist",
        "Nephrologist",
        "Pulmonologist",
        "Staff Nurse",
        "ICU Nurse",
        "Emergency Nurse",
        "OT Nurse",
        "Pediatric Nurse",
        "Cardiac Nurse",
        "Mental Health Nurse",
        "Community Health Nurse",
        "Nurse Practitioner",
        "Medical Laboratory Technician",
        "Radiology Technician",
        "OT Technician",
        "Dialysis Technician",
        "ECG Technician",
        "Physiotherapist",
        "Occupational Therapist",
        "Speech Therapist",
        "Respiratory Therapist",
        "Pharmacist",
        "Clinical Pharmacist",
        "Medical Assistant",
        "Medical Secretary",
        "Medical Billing Specialist",
        "Healthcare Administrator",
        "Hospital Manager",
        "Quality Assurance Manager",
        "Infection Control Nurse",
        "Clinical Research Coordinator",
        "Medical Social Worker",
        "Nutritionist",
        "Dietitian",
        "Health Educator",
        "Medical Records Officer",
        "Biomedical Engineer",
        "Healthcare IT Specialist",
        "Telemedicine Coordinator",
    ]

    # Skills pools by category
    clinical_skills = [
        "patient care",
        "clinical assessment",
        "medical diagnosis",
        "treatment planning",
        "emergency care",
        "critical care",
        "surgical procedures",
        "wound care",
        "medication administration",
        "patient monitoring",
        "infection control",
    ]

    technical_skills = [
        "medical equipment",
        "laboratory testing",
        "radiology",
        "ECG interpretation",
        "ventilator management",
        "dialysis",
        "IV therapy",
        "blood transfusion",
        "electronic health records",
        "medical imaging",
        "pathology",
    ]

    soft_skills = [
        "communication",
        "empathy",
        "leadership",
        "teamwork",
        "time management",
        "problem solving",
        "stress management",
        "cultural sensitivity",
        "patient education",
        "family counseling",
        "crisis intervention",
    ]

    # Job types and work modes
    job_types = ["full_time", "part_time", "contract", "locum", "internship"]
    work_modes = ["office", "hybrid", "remote"]

    # Generate job descriptions templates
    description_templates = [
        "We are seeking a skilled {title} to join our healthcare team. This role offers excellent opportunities for professional growth and making a meaningful impact on patient care.",
        "Join our dynamic medical facility as a {title}. We provide a supportive environment focused on delivering exceptional healthcare services to our community.",
        "Exciting opportunity for an experienced {title} to contribute to our mission of providing quality healthcare. We offer competitive compensation and comprehensive benefits.",
        "We are looking for a dedicated {title} to enhance our medical services. This position is perfect for professionals committed to excellence in patient care.",
        "Our healthcare organization is expanding and we need a qualified {title} to join our team. Be part of our commitment to improving community health outcomes.",
    ]

    jobs_data = []

    for _ in range(600):  # Generate 600 jobs for good clustering demonstration
        # Randomly select city and job title
        city, lng, lat = random.choice(cities)
        title = random.choice(job_titles)

        # Add some variation to coordinates for realistic clustering
        lat_variation = random.uniform(-0.05, 0.05)  # ~5km variation
        lng_variation = random.uniform(-0.05, 0.05)

        # Build skills list
        skills = []
        skills.extend(random.sample(clinical_skills, random.randint(2, 4)))
        skills.extend(random.sample(technical_skills, random.randint(1, 3)))
        skills.extend(random.sample(soft_skills, random.randint(1, 2)))

        # Generate salary based on job level and type
        base_salary = random.randint(300000, 2500000)
        min_salary = base_salary
        max_salary = int(base_salary * random.uniform(1.2, 1.8))

        # Experience requirements
        min_exp = random.randint(0, 8)
        max_exp = min_exp + random.randint(2, 10)

        job_data = {
            "title": title,
            "description": random.choice(description_templates).format(title=title),
            "skills": skills,
            "location": city,
            "geo": GeoObject(coordinates=(lng + lng_variation, lat + lat_variation)),
            "job_type": random.choice(job_types),
            "work_mode": random.choice(work_modes) if city != "Remote" else "remote",
            "min_salary": min_salary,
            "max_salary": max_salary,
            "min_experience": min_exp,
            "max_experience": max_exp,
            "vacancies": random.randint(1, 5),
            "expires_at": datetime.now(UTC) + timedelta(days=random.randint(15, 90)),
        }
        jobs_data.append(job_data)

    # Create jobs in batches using individual job creation to avoid embedding issues
    total_jobs = []

    for job_data in jobs_data:
        try:
            job = await job_repo.create(
                organization=org,
                title=job_data["title"],
                description=job_data["description"],
                skills=job_data["skills"],
                location=job_data["location"],
                geo=job_data["geo"],
                job_type=job_data["job_type"],
                work_mode=job_data["work_mode"],
                min_salary=job_data["min_salary"],
                max_salary=job_data["max_salary"],
                min_experience=job_data["min_experience"],
                max_experience=job_data["max_experience"],
                vacancies=job_data["vacancies"],
                expires_at=job_data["expires_at"],
            )
            # Activate the job
            await job_repo.update_active(job, is_active=True)
            total_jobs.append(job)
        except Exception as e:
            # Skip jobs that fail to create (e.g., due to network issues with embeddings)
            continue

    # Success message (using a proper return instead of print)
    return len(total_jobs)


# Run the async function
if __name__ == "__main__":
    total_jobs = asyncio.run(insert_healthcare_jobs())
    print(
        f"Successfully inserted {total_jobs} healthcare jobs for clustering demonstration."
    )
