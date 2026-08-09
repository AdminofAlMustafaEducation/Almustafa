# DATABASE ARCHITECTURE

## Goal
Build a normalized, secure, scalable Supabase PostgreSQL database that supports Admin, Teacher, Student and Guardian panels.

## Core Tables

```text
profiles
students
guardians
teachers
guardian_students
applications

classes
subjects
teacher_subjects
class_students

attendance
exams
exam_results

fees
notifications
notification_recipients

notes
live_classes

gallery
website_content

audit_logs
```

## Rules

- Use UUIDs for primary database IDs.
- Use separate human-readable IDs such as `STU-2026-0001`.
- Use foreign keys for relationships.
- Add timestamps: `created_at`, `updated_at`.
- Use database constraints for important uniqueness rules.
- Add indexes based on actual query patterns.
- Never use array length or `Date.now()` as database identity.
- Never duplicate the same relationship in multiple tables unnecessarily.

## Important Relationships

```text
User → Profile
Profile → Student/Teacher/Guardian

Guardian → Students
Teacher → Subjects
Teacher → Classes

Student → Classes
Student → Attendance
Student → Exam Results
Student → Fees

Teacher + Subject + Class → Teaching Assignment
Exam → Subject + Class
Exam Result → Exam + Student
```

## Security

Enable Supabase RLS on all private tables.

Database permissions must enforce:

```text
Admin → authorized management
Teacher → assigned classes/subjects
Student → own data
Guardian → linked children
```

Never depend only on frontend permissions.

All schema changes must use version-controlled:

```text
supabase/migrations/
```

Avoid unnecessary tables and over-engineering.