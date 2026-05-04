import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsight_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from community.models import Offer, Material, CampusAnnouncement

User = get_user_model()

def populate():
    # Clear existing
    Offer.objects.all().delete()
    Material.objects.all().delete()
    CampusAnnouncement.objects.all().delete()

    # Get admin user
    try:
        admin_user = User.objects.get(username='admin_amjad')
    except User.DoesNotExist:
        print("Admin user not found, cannot create demo data with author.")
        return

    # Create Offers
    offers_data = [
        {
            "title": "Software Engineering Intern",
            "company": "Capgemini",
            "description": "We are looking for a highly motivated software engineering intern to join our development team. You will work on full-stack web applications using React and Django.",
            "offer_type": "Internship",
            "location": "Casablanca Nearshore Park",
        },
        {
            "title": "PFE: AI-based Fraud Detection",
            "company": "Societe Generale",
            "description": "Final year project (PFE) focusing on implementing machine learning models for real-time fraud detection in banking transactions.",
            "offer_type": "PFE",
            "location": "Technopolis, Rabat",
        },
        {
            "title": "PFA: E-commerce Mobile App",
            "company": "EMSI Internal Project",
            "description": "Looking for a group of 3 students to build a cross-platform mobile e-commerce application using Flutter and Firebase.",
            "offer_type": "PFA",
            "location": "EMSI Les Orangers, Rabat",
        },
        {
            "title": "Data Analyst Intern",
            "company": "Orange Maroc",
            "description": "Join our Big Data team to help analyze customer behavior and optimize our network performance. Python, SQL, and PowerBI required.",
            "offer_type": "Internship",
            "location": "Casablanca, Sidi Maarouf",
        }
    ]

    for data in offers_data:
        Offer.objects.create(
            title=data['title'],
            company=data['company'],
            description=data['description'],
            offer_type=data['offer_type'],
            location=data['location'],
            created_by=admin_user
        )
    print(f"Created {len(offers_data)} offers.")

    # Create Materials
    materials_data = [
        {
            "title": "Standard Software Engineer CV Template",
            "description": "A clean, ATS-friendly CV template specifically designed for IT and software engineering roles.",
            "material_type": "CV",
            "file_url": "https://github.com/posquit0/Awesome-CV"
        },
        {
            "title": "Professional Cover Letter Guide",
            "description": "A comprehensive guide and template for writing a compelling cover letter for PFE applications.",
            "material_type": "CoverLetter",
            "file_url": "https://www.canva.com/resumes/templates/"
        },
        {
            "title": "React & Django Documentation",
            "description": "Official documentation for React and Django to help you prepare for technical interviews.",
            "material_type": "Other",
            "file_url": "https://react.dev/learn"
        }
    ]

    for data in materials_data:
        Material.objects.create(**data)
    print(f"Created {len(materials_data)} materials.")

    # Create Announcements
    announcements_data = [
        {
            "title": "Upcoming Career Fair - EMSI Casablanca",
            "content": "Join us next Thursday for the annual EMSI Career Fair. Over 40 partner companies will be present. Bring multiple copies of your CV!"
        },
        {
            "title": "Deadline for PFE Topic Submission",
            "content": "A reminder to all 5th-year students that the deadline to submit your PFE topics on the portal is approaching rapidly. Ensure your supervisor has approved your proposal."
        },
        {
            "title": "New Partnership with Microsoft",
            "content": "We are proud to announce a new partnership granting all EMSI students free access to Microsoft Azure for student projects and certifications."
        }
    ]

    for data in announcements_data:
        CampusAnnouncement.objects.create(
            title=data['title'],
            content=data['content'],
            created_by=admin_user
        )
    print(f"Created {len(announcements_data)} announcements.")

    print("Demo community data successfully populated!")

if __name__ == '__main__':
    populate()
