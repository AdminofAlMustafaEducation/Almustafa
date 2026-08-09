# ROLE & PERMISSION MATRIX

## Roles

```text
ADMIN
TEACHER
STUDENT
GUARDIAN
```

## Permission Rules

| Feature | Admin | Teacher | Student | Guardian |
|---|---|---|---|---|
| Students | RW | Assigned | Own | Child |
| Attendance | RW | Assigned | Own R | Child R |
| Exams | RW | Assigned | Own R | Child R |
| Fees | RW | - | Own R | Child R |
| Notes | RW | Assigned | Own R | Child R |
| Notifications | RW | Assigned | Own R | Child R |
| Applications | RW | - | Own request | Own child |
| Teachers | RW | Own profile | - | - |
| Classes | RW | Assigned R | Own R | Child R |
| Live Classes | RW | Assigned | Own | Child |
| Website CMS | RW | - | - | - |
| Gallery | RW | Limited if authorized | - | - |

## Critical Rules

Teacher access must be restricted by:

```text
teacher → assigned subject → assigned class → students
```

Students cannot access another student's data.

Guardians can only access explicitly linked children.

Frontend permissions are for UX only.

Supabase RLS/server authorization is the actual security boundary.

Every new feature must define:

```text
Who can READ?
Who can CREATE?
Who can UPDATE?
Who can DELETE?
```

Never grant broad permissions simply to make a feature work.