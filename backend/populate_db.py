import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emsight_backend.settings')
django.setup()

from accounts.models import CustomUser, StudentProfile, TeacherProfile, AdminProfile
from portal.models import CalendarEvent, Notification, ReportCard, Grade, Absence, DocumentRequest
from django.utils import timezone
from datetime import timedelta

# Clear old data
CustomUser.objects.all().delete()
CalendarEvent.objects.all().delete()
Notification.objects.all().delete()
Absence.objects.all().delete()

# Create Users
student = CustomUser.objects.create_user(username='student_nizar', email='nizar@emsi.ma', password='password123', first_name='Nizar', last_name='El Idrysy', role='student', matricule='S-2022-123456')
StudentProfile.objects.create(user=student, filiere='Ingénierie Informatique', annee_etude=4, numero_etudiant='E123456', tutor_name='Dr. Alami')

teacher = CustomUser.objects.create_user(username='teacher_hajar', email='hajar@emsi.ma', password='password123', first_name='Hajar', last_name='Chabli', role='teacher', matricule='T-2020-654321')
TeacherProfile.objects.create(user=teacher, departement='Informatique', matiere='Développement Web')

admin = CustomUser.objects.create_user(username='admin_amjad', email='amjad@emsi.ma', password='password123', first_name='Amjad', last_name='Ahrrar', role='admin', matricule='D-2018-987654')
AdminProfile.objects.create(user=admin, service='Scolarité')

# Create Calendar Events
now = timezone.now()
CalendarEvent.objects.create(title='Cours de Dev Web', description='React et Django', start_time=now + timedelta(days=1, hours=10), end_time=now + timedelta(days=1, hours=12), event_type='Cours', created_by=teacher)
CalendarEvent.objects.create(title='Examen Final', description='Salle 102', start_time=now + timedelta(days=5, hours=9), end_time=now + timedelta(days=5, hours=11), event_type='Examen', created_by=admin)

# Create Notifications
notif1 = Notification.objects.create(title='Rappel de Cours', content='Le cours de Dev Web est maintenu demain.', type_notif='Info', sender=teacher)
notif1.recipients.add(student)

notif2 = Notification.objects.create(title='Frais de scolarité', content='Veuillez régler la dernière tranche.', type_notif='Urgent', sender=admin)
notif2.recipients.add(student)

# Create Report Cards and Grades
report = ReportCard.objects.create(student=student, academic_year='2025-2026', semester='S1', general_average=15.5)
Grade.objects.create(report_card=report, subject='Algorithmique', evaluation_type='Examen', value=16)
Grade.objects.create(report_card=report, subject='Base de données', evaluation_type='Controle', value=14, is_rattrapage=False)
Grade.objects.create(report_card=report, subject='Reseaux', evaluation_type='Examen', value=9, is_rattrapage=True) # rattrapage

# Create Absences
Absence.objects.create(student=student, teacher=teacher, subject='Développement Web', date_seance=now.date() - timedelta(days=2), is_present=False, justification_status='Pending')
Absence.objects.create(student=student, teacher=teacher, subject='Développement Web', date_seance=now.date() - timedelta(days=7), is_present=False, justification_text='Certificat médical', justification_status='Validated')

# Create Document Requests
DocumentRequest.objects.create(student=student, document_type='Scolarite', status='Pending')

print("Database successfully populated with demo data!")
