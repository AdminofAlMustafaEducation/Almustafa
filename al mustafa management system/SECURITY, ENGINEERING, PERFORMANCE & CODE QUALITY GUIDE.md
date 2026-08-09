# AL-MUSTAFA ACADEMY
# SECURITY, ENGINEERING, PERFORMANCE & CODE QUALITY GUIDE

## 1. CORE ENGINEERING PRINCIPLE

The application must be built as a production-quality system.

The agents must NOT optimize for:

> "Make the feature work as quickly as possible."

They must optimize for:

> **Correct + Secure + Simple + Reusable + Fast + Lightweight + Maintainable + Scalable**

Every implementation must consider:

```text
Security
Performance
Database efficiency
Code quality
Accessibility
Mobile UX
Maintainability
Scalability
Error handling
```

---

# 2. DO NOT OVER-ENGINEER

The application should remain simple.

Do NOT introduce unnecessary:

- microservices
- complex state-management libraries
- message brokers
- Redis unless actually required
- WebSockets unless actually required
- multiple backend servers
- unnecessary third-party APIs
- heavy UI libraries
- duplicate utility libraries

Preferred architecture:

```text
Browser
   ↓
React / TanStack Start
   ↓
Server/API layer where required
   ↓
Supabase
   ├── PostgreSQL
   ├── Auth
   ├── Storage
   └── Realtime only where needed
```

Keep the architecture boring and reliable.

---

# 3. SECURITY MODEL

The application has four primary roles:

```text
ADMIN
TEACHER
STUDENT
GUARDIAN
```

Never rely only on frontend route protection.

Frontend protection is UX.

Database authorization is security.

Therefore:

```text
Frontend permissions
        +
Server-side validation
        +
Supabase Row Level Security
```

must work together.

---

# 4. SUPABASE ROW LEVEL SECURITY

RLS must be enabled for every table containing private academy data.

Examples:

```text
students
guardians
teachers
applications
attendance
exams
exam_results
fees
notifications
teacher_subjects
classes
live_classes
notes
gallery
website_content
```

Never expose sensitive tables without appropriate policies.

---

# 5. ROLE-BASED ACCESS CONTROL

Create a centralized permission model.

Example:

```text
ADMIN
    students: read/write
    teachers: read/write
    attendance: read/write
    exams: read/write
    fees: read/write
    website: read/write

TEACHER
    students: read assigned students
    attendance: write assigned classes
    exams: write assigned subjects/classes
    notes: create for assigned subjects
    notifications: create for assigned students
    website: no access unless explicitly granted

STUDENT
    own profile: read
    own attendance: read
    own results: read
    own notes: read
    own notifications: read

GUARDIAN
    linked children: read
    own contact information: update according to rules
```

Never assume:

```text
if (role === "admin")
```

in the UI is sufficient protection.

The database must independently enforce authorization.

---

# 6. STUDENT/GUARDIAN DATA ISOLATION

A student must never be able to request:

```text
another student's attendance
another student's results
another student's fees
another student's profile
another student's notifications
```

A guardian must only access children explicitly linked to that guardian.

Do not trust:

```text
studentId
guardianId
userId
```

coming from the browser.

Always validate ownership/relationship on the server/database.

---

# 7. TEACHER DATA ISOLATION

Teachers should only access students belonging to their assigned classes/subjects.

Example:

```text
Teacher A
    ↓
Grade 9 Mathematics
    ↓
Only Grade 9 Mathematics students
```

Teacher A should NOT automatically receive:

```text
Grade 10
Grade 11
another teacher's subject
unassigned students
```

unless explicitly authorized.

---

# 8. ADMIN IS THE AUTHORITY

Admin controls:

- student approval
- admissions
- teacher assignments
- class assignments
- subject assignments
- fees
- exam configuration
- website management
- guardian relationships
- permissions

Sensitive operations must require authenticated admin authorization.

---

# 9. ADMISSION SECURITY

Student registration should NOT immediately create an active student account.

Preferred flow:

```text
Student/Guardian
       ↓
Application
       ↓
Pending
       ↓
ADMIN REVIEW
       ↓
Approved
       ↓
Student account activated
```

If rejected:

```text
Rejected
```

The applicant must not gain student access simply by submitting a form.

---

# 10. APPROVE & ADMIT SECURITY

The operation:

```text
Approve Application
+
Create Student
+
Create/Link Account
```

must be handled safely.

Do not implement it as unrelated frontend requests such as:

```text
createStudent()
updateApplication()
```

without transactional protection.

Prefer a server-side transaction/RPC where appropriate.

The operation should either:

```text
SUCCESS
    Application approved
    Student created
```

or:

```text
FAILURE
    No partial student/application state
```

---

# 11. DUPLICATE ACCOUNT PROTECTION

Prevent duplicate:

- student accounts
- applications
- B-Form/ID numbers
- phone numbers where business rules require uniqueness
- guardian relationships
- teacher assignments

Use database constraints where appropriate.

Do NOT rely only on:

```text
if (!existingStudent)
```

in JavaScript.

The database must enforce important uniqueness rules.

---

# 12. ID GENERATION

Never use:

```text
array.length + 1
```

Never use:

```text
Date.now()
```

as the primary database identity if the database already provides UUIDs/identity keys.

Prefer:

```text
database-generated UUID
```

For human-readable academy IDs, create a separate field:

```text
student_id
```

Example:

```text
STU-2026-000123
```

The database identity and human-readable ID should be separate concepts.

---

# 13. WHATSAPP SECURITY

Use:

```text
wa.me
```

for WhatsApp links.

Do not expose unnecessary private information inside URLs.

Do not include:

- passwords
- authentication tokens
- sensitive student information
- complete confidential reports

inside WhatsApp URLs.

Messages should contain only the minimum required information.

Example:

```text
Student: Ahmed Khan
Subject: Mathematics
Result: 85/100
```

rather than exposing unrelated student information.

---

# 14. WHATSAPP NUMBER VALIDATION

The system should validate phone numbers before generating:

```text
https://wa.me/...
```

Normalize numbers into a consistent international format.

Do not blindly concatenate:

```text
wa.me/${phone}
```

without validation.

---

# 15. WHATSAPP NUMBER CHANGE RULES

Student and guardian profiles must not have unlimited authority to change sensitive relationships.

Recommended:

### Student

Student can request/update their own WhatsApp number according to academy policy.

### Guardian

Guardian can update guardian WhatsApp information.

### Parent/Guardian number

A student's parent/guardian contact should be controlled by the verified guardian/admin relationship.

Changing a guardian relationship should require stronger validation.

---

# 16. "IS WHATSAPP AVAILABLE?" LIMITATION

Do NOT pretend the system can verify that a WhatsApp number actually belongs to an active WhatsApp account using `wa.me`.

The free `wa.me` approach can verify that the number is correctly formatted and attempt to open WhatsApp, but it does not provide a reliable free API for confirming account existence.

Therefore UI should say:

```text
WhatsApp
```

not:

```text
Verified WhatsApp
```

unless actual verification is implemented through an appropriate service.

---

# 17. AUTHENTICATION

Use Supabase Auth rather than creating a custom password system.

Never store:

```text
plain passwords
hashed passwords in academy tables
```

unless there is an exceptional architectural reason.

Prefer:

```text
Supabase Auth
```

for:

- login
- password reset
- email verification
- session management
- authentication tokens

---

# 18. SESSION SECURITY

Do not store authentication tokens manually in:

```text
localStorage
```

unless the authentication framework specifically requires it and the security implications are understood.

Use the framework's recommended secure session mechanism.

Do not expose service-role credentials to the browser.

---

# 19. SUPABASE SERVICE ROLE KEY

ABSOLUTE RULE:

```text
SUPABASE_SERVICE_ROLE_KEY
```

must NEVER be shipped to the browser.

Never place it in:

```text
VITE_*
NEXT_PUBLIC_*
client code
frontend environment variables
```

Use the service role only in trusted server-side execution where absolutely necessary.

---

# 20. PUBLIC SUPABASE KEY

The public/anon key can be present in the client according to Supabase's architecture, but:

> Public key ≠ permission to access everything.

RLS must protect the database.

---

# 21. INPUT VALIDATION

Every external input must be validated.

Examples:

```text
student registration
phone numbers
B-Form/ID
grades
marks
fees
dates
messages
announcements
website content
file uploads
```

Use schema validation consistently.

The existing project should standardize around one validation approach, such as Zod if already present.

Do not create custom validation logic for every form.

---

# 22. SERVER-SIDE VALIDATION

Never trust frontend validation.

This is NOT sufficient:

```text
frontend:
marks <= totalMarks
```

The server/database must also validate:

```text
marks >= 0
marks <= totalMarks
```

Same for:

```text
fees
dates
roles
IDs
permissions
relationships
```

---

# 23. XSS PROTECTION

Never render user-provided HTML directly.

Be especially careful with:

- website content
- announcements
- notes
- teacher messages
- student profile fields
- gallery captions

Avoid unnecessary:

```text
dangerouslySetInnerHTML
```

If HTML is genuinely required, sanitize it before rendering.

---

# 24. SQL INJECTION

Never construct SQL manually using string concatenation.

Use Supabase query APIs / parameterized database operations.

Bad:

```text
"SELECT * FROM students WHERE name = '" + name + "'"
```

Good:

```text
parameterized/database API query
```

---

# 25. FILE UPLOAD SECURITY

Gallery, notes, profile photos and other uploads require restrictions.

Validate:

```text
file type
file size
file extension
content type
filename
```

Do not trust the extension alone.

Set reasonable limits.

Example:

```text
Images → limited size
Documents → limited size
Videos → restricted or separate strategy
```

Use Supabase Storage policies.

---

# 26. STORAGE ACCESS

Private student documents should NOT be stored in publicly accessible buckets.

Use:

```text
private bucket
+
authenticated access
+
appropriate storage policies
```

Public assets such as academy website images may use public storage where appropriate.

Separate public and private storage.

---

# 27. NOTES SECURITY

Teacher notes should only be accessible to:

```text
assigned students
assigned guardians
authorized teacher
admin
```

Do not expose all notes through a public bucket.

---

# 28. EXAM RESULT SECURITY

Exam results are private academic records.

Only authorized users should access them.

Teacher:

```text
assigned subject/class
```

Student:

```text
own results
```

Guardian:

```text
linked child results
```

Admin:

```text
authorized administration
```

---

# 29. ATTENDANCE SECURITY

Attendance follows the same model.

Teacher can write attendance only for assigned class/session.

Student can read own attendance.

Guardian can read linked child's attendance.

Admin can manage attendance.

Do not allow a teacher to modify arbitrary historical attendance unless their permissions explicitly allow it.

---

# 30. AUDIT LOG

Important administrative operations should be auditable.

Consider an audit table:

```text
audit_logs
```

Track:

```text
who
what
when
target
action
```

Examples:

```text
Admin approved application
Teacher modified attendance
Admin changed student information
Teacher published result
Admin changed teacher assignment
```

Do not log passwords, authentication tokens or unnecessary sensitive information.

---

# 31. RATE LIMITING

Free-tier infrastructure makes rate limiting especially important.

Protect:

```text
login attempts
registration
application submission
password reset
notifications
public forms
```

Do not allow a malicious user to generate thousands of requests.

Where appropriate, use:

- Supabase protections
- server-side rate limiting
- CAPTCHA/Turnstile for public forms
- database constraints
- cooldowns

---

# 32. PUBLIC APPLICATION FORM SECURITY

The public admission form is an attack surface.

Protect it against:

```text
spam
bot submissions
duplicate submissions
oversized payloads
malicious input
file abuse
```

Consider CAPTCHA/Turnstile only if spam becomes a problem; do not add unnecessary dependencies immediately.

---

# 33. CSRF / REQUEST SECURITY

Use the framework's standard request/session mechanisms.

Do not build custom authentication endpoints unnecessarily.

Where cookie-based authenticated mutations are used, ensure the framework's CSRF protections are correctly configured.

---

# 34. ERROR SECURITY

Never expose internal errors to users.

Do not show:

```text
database schema
SQL query
stack trace
Supabase internal error
secret
environment variable
```

to end users.

Show:

```text
Something went wrong.
Please try again.
```

Log the technical error securely for developers.

---

# 35. ENVIRONMENT VARIABLES

Separate:

```text
development
staging
production
```

Never commit secrets into Git.

`.env` files containing secrets must be ignored.

Provide:

```text
.env.example
```

with placeholder names only.

---

# 36. DEPENDENCY SECURITY

Before adding a package, ask:

```text
Do we actually need it?
Can existing project code solve this?
Does it add significant bundle size?
Is it maintained?
Does it introduce security risk?
```

Avoid installing large libraries for tiny features.

---

# 37. CODE QUALITY RULE

Agents must prefer:

```text
small functions
single responsibility
reusable components
typed interfaces
clear naming
composition
```

Avoid giant components such as:

```text
AdminDashboard.tsx
```

with thousands of lines.

---

# 38. COMPONENT SIZE

If a component becomes difficult to understand, split it.

Example:

```text
admin.exams.tsx
```

can become:

```text
components/exams/exam-list.tsx
components/exams/exam-header.tsx
components/exams/result-grid.tsx
components/exams/result-card-mobile.tsx
components/exams/create-exam-dialog.tsx
```

Do not split tiny components unnecessarily.

---

# 39. HOOK DESIGN

Hooks should have one responsibility.

Good:

```text
useStudents()
useAttendance()
useExams()
useNotifications()
```

Avoid:

```text
useEverything()
```

Hooks should handle data operations rather than containing large UI implementations.

---

# 40. DATABASE QUERY EFFICIENCY

Do not fetch unnecessary data.

Bad:

```text
SELECT *
```

for large datasets.

Prefer only required fields.

Example:

```text
id
name
grade
status
```

instead of downloading every student field when only names are needed.

---

# 41. PAGINATION

Large datasets must be paginated.

Examples:

```text
students
attendance history
exam results
notifications
fees
applications
audit logs
```

Do not load thousands of records into the browser.

---

# 42. FILTERING

Where possible:

```text
database filtering
```

should happen before data reaches the browser.

Bad:

```text
download 5,000 students
↓
filter 30 students in JavaScript
```

Better:

```text
database
↓
return 30 matching students
```

---

# 43. SEARCH PERFORMANCE

Use database-supported search/indexes where appropriate.

Do not repeatedly query the entire dataset for every keystroke.

Use a small debounce for search.

Example conceptual behavior:

```text
user types
↓
wait briefly
↓
query
```

---

# 44. DATABASE INDEXES

Add indexes based on real query patterns.

Likely candidates include:

```text
student.user_id
student.grade
student.status

attendance.student_id
attendance.class_id
attendance.date

exam.class_id
exam.subject_id
exam.date

exam_results.exam_id
exam_results.student_id

notifications.recipient_id
notifications.created_at
```

Do not create indexes blindly.

Indexes should support actual queries and be reviewed as the dataset grows.

---

# 45. N+1 QUERY PREVENTION

Avoid:

```text
load students
for each student:
    query attendance
```

This creates many requests.

Prefer:

```text
one appropriate query
or
batched query
```

Use maps in memory only after retrieving appropriately scoped data.

---

# 46. REALTIME

Do NOT use Supabase Realtime everywhere.

Realtime should be reserved for features that actually need live updates.

Good candidates:

```text
live class status
important notifications
teacher attendance submission status
admin approval status
```

Do not subscribe every page to every table.

That would waste free-tier resources.

---

# 47. NOTIFICATION STRATEGY

Do not create a realtime connection for every notification system unnecessarily.

For many notifications, normal database polling/refetching is enough.

Example:

```text
notification created
↓
student sees it on next refresh
```

Realtime can be introduced where immediate delivery materially improves UX.

---

# 48. WHATSAPP LOAD

WhatsApp `wa.me` does not send messages from your server.

It opens WhatsApp for the user.

Therefore:

```text
Teacher
 ↓
Click WhatsApp
 ↓
wa.me
 ↓
WhatsApp
```

This is lightweight and does not consume Supabase messaging infrastructure.

This is a good choice for the free-tier architecture.

---

# 49. LIVE CLASS ARCHITECTURE

Do NOT build your own video streaming system.

That would dramatically increase complexity and infrastructure requirements.

Instead store:

```text
live_class
    title
    teacher_id
    class_id
    subject_id
    start_time
    end_time
    meeting_url
    status
```

The academy system manages:

```text
schedule
permissions
visibility
notifications
attendance
meeting link
```

The external platform manages:

```text
video
audio
screen sharing
meeting infrastructure
```

---

# 50. LIVE CLASS LOAD

If Grade 9 has four simultaneous subjects:

```text
Academy platform
       │
       ├── Mathematics → external meeting
       ├── Physics     → external meeting
       ├── Chemistry   → external meeting
       └── English     → external meeting
```

The academy server does NOT process four video streams.

Students connect directly to the external meeting platform.

Therefore the application's server load remains relatively small.

Do NOT proxy video through Vercel.

Do NOT store live video streams in Supabase.

---

# 51. CODE SPLITTING

Load feature code only when required.

Examples:

```text
admin exams
admin gallery
reports
charts
```

should not unnecessarily increase the initial bundle for every user.

Student users should not download the entire admin feature set.

Role-aware route loading and code splitting should be used where supported.

---

# 52. IMAGE OPTIMIZATION

Use:

```text
WebP
AVIF where appropriate
responsive image sizes
lazy loading
```

Do not upload a 5 MB image when a 200 KB optimized image is sufficient.

---

# 53. LOCAL STORAGE STRATEGY

Use localStorage only for small, non-sensitive preferences.

Good:

```text
theme
sidebar collapsed
table preferences
last selected filter
```

Do NOT store:

```text
password
service role key
sensitive student records
private exam results
authentication secrets
```

For structured offline data, consider IndexedDB instead of localStorage.

---

# 54. CACHE STRATEGY

Cache carefully.

Good candidates:

```text
academy settings
subjects
grades
static configuration
```

Do not blindly cache:

```text
attendance
fees
exam results
permissions
```

because stale sensitive information can cause serious problems.

---

# 55. DATA FETCHING

Use a consistent data-fetching strategy throughout the project.

Avoid every page implementing its own:

```text
loading
error
retry
cache
refetch
```

logic differently.

Centralize reusable patterns where possible.

---

# 56. OPTIMISTIC UI

Use optimistic updates only for low-risk operations.

Good:

```text
mark notification read
toggle UI preference
```

Be cautious with:

```text
attendance
exam results
fees
student approval
```

For important academic/financial data, confirmation from the server should generally occur before showing final success.

---

# 57. DATABASE TRANSACTIONS

Operations involving multiple related records should use transactions/RPC where required.

Examples:

```text
Approve application
+
create student
+
link guardian
```

or:

```text
Create exam
+
initialize results
```

Do not rely on a sequence of unrelated browser requests when atomicity matters.

---

# 58. DUPLICATE SUBMISSION PROTECTION

Buttons should prevent accidental repeated submissions.

Example:

```text
[Saving...]
```

while the request is running.

The server/database should also protect against duplicate records.

Frontend prevention alone is not sufficient.

---

# 59. TYPE SAFETY

Use TypeScript strictly.

Avoid unnecessary:

```text
any
```

If `any` is introduced, the agent should have a clear reason.

Prefer:

```text
unknown
typed interfaces
generated database types
schema inference
```

---

# 60. DATABASE TYPES

Supabase database types should be generated/maintained consistently.

Avoid manually creating conflicting versions of:

```text
Student
Teacher
Exam
Application
```

across multiple files.

Use one source of truth wherever practical.

---

# 61. CONSTANTS

Centralize:

```text
grades
subjects
roles
permissions
fee types
attendance statuses
exam grades
application statuses
```

Do not duplicate these values throughout the project.

---

# 62. NO MAGIC STRINGS

Avoid:

```text
if (status === "approved")
```

being repeated across dozens of files.

Prefer centralized constants/types where appropriate.

---

# 63. ERROR HANDLING

Every async operation should handle:

```text
loading
success
failure
retry
```

Do not use:

```text
alert()
console.log()
```

as the primary user experience.

---

# 64. LOGGING

Development:

```text
use useful debugging logs
```

Production:

```text
minimal safe logging
```

Never log:

```text
passwords
tokens
private keys
sensitive student information
```

---

# 65. TESTING

Every important feature should have tests appropriate to its risk.

Highest priority:

```text
authentication
authorization
RLS
Approve & Admit
attendance
exam results
fees
guardian/student access
teacher permissions
```

Test both:

```text
allowed operation
```

and:

```text
forbidden operation
```

---

# 66. SECURITY TEST MATRIX

For every protected feature:

```text
Admin → allowed
Teacher → allowed only within scope
Student → own data only
Guardian → linked child only
Unauthorized user → denied
```

The agent must explicitly test this.

---

# 67. MOBILE + SECURITY

Mobile UI must never weaken security.

For example:

```text
mobile API request
```

must receive exactly the same authorization checks as:

```text
desktop API request
```

Never hide security behind UI elements.

---

# 68. PERFORMANCE BUDGET

The agents should actively avoid unnecessary payload and JavaScript growth.

Priorities:

```text
small initial bundle
lazy feature loading
optimized images
limited database queries
pagination
efficient indexes
minimal realtime subscriptions
```

---

# 69. FREE-TIER ARCHITECTURE

The initial architecture should intentionally minimize infrastructure usage.

Preferred:

```text
Vercel
   ↓
TanStack Start / React
   ↓
Supabase
   ├── Auth
   ├── PostgreSQL
   ├── Storage
   └── selective Realtime
```

External services only where they provide a clear benefit.

Examples:

```text
WhatsApp → wa.me
Live classes → external meeting platform
```

Do not add paid infrastructure until actual usage requires it.

---

# 70. SCALABILITY PRINCIPLE

"Scalable" does NOT mean:

> Build a giant enterprise architecture today.

Instead:

> Build simple components that can scale when the number of students grows.

For example:

```text
100 students
    ↓
1,000 students
    ↓
10,000 students
```

The application should continue to work because:

- queries are indexed
- data is paginated
- RLS is efficient
- unnecessary data isn't fetched
- realtime is limited
- images are optimized
- components are modular

---

# 71. AGENT IMPLEMENTATION WORKFLOW

Every coding agent must follow:

```text
STEP 1
Inspect existing implementation

STEP 2
Understand current architecture

STEP 3
Identify reusable code

STEP 4
Identify security implications

STEP 5
Identify database implications

STEP 6
Design minimal solution

STEP 7
Implement

STEP 8
Type-check

STEP 9
Lint

STEP 10
Run relevant tests

STEP 11
Check desktop

STEP 12
Check mobile

STEP 13
Check authorization

STEP 14
Check database query efficiency

STEP 15
Review changed files

STEP 16
Remove unnecessary code

STEP 17
Report exactly what changed
```

---

# 72. AGENT MUST NOT BLINDLY MODIFY FILES

Before editing:

```text
READ
UNDERSTAND
TRACE DEPENDENCIES
THEN MODIFY
```

The agent should search for:

```text
imports
references
hooks
database types
routes
components
tests
```

before changing shared structures.

---

# 73. AGENT MUST NOT DUPLICATE EXISTING FUNCTIONALITY

Before creating:

```text
new hook
new utility
new component
new API
```

search the repository first.

If equivalent functionality exists:

```text
reuse
refactor
extend
```

rather than creating another implementation.

---

# 74. MINIMAL DIFF PRINCIPLE

Agents should make the smallest safe change required.

Avoid unrelated:

```text
formatting changes
renaming
file movement
dependency upgrades
design changes
```

while implementing an unrelated feature.

This makes debugging and code review much easier.

---

# 75. BACKWARD COMPATIBILITY

When changing existing fields:

```text
class_level
```

to:

```text
grade
```

do not immediately destroy old data.

Use a migration strategy.

Example:

```text
old data
    ↓
migration
    ↓
new grade
    ↓
old field retained temporarily
    ↓
verify
    ↓
eventual removal
```

Never silently break existing production data.

---

# 76. DATABASE MIGRATIONS

All schema changes must be reproducible.

Do not manually modify production database structures without migration files.

Keep migrations version-controlled.

Example:

```text
supabase/migrations/
```

Each migration should have a clear purpose.

---

# 77. SECURITY REVIEW BEFORE MERGE

Before completing a feature, the security agent should ask:

```text
Can an unauthorized user access this?
Can a student access another student's data?
Can a teacher modify another teacher's data?
Can a guardian access another child?
Can a user bypass the UI?
Can a malicious input break the system?
Can a file upload be abused?
Can this operation be spammed?
Are secrets exposed?
```

---

# 78. PERFORMANCE REVIEW BEFORE MERGE

Ask:

```text
How many database queries does this feature make?
How much data is downloaded?
Does it paginate?
Does it need realtime?
Does it add a dependency?
Does it increase bundle size?
Does it load unnecessary components?
Does mobile remain fast?
```

---

# 79. CODE REVIEW STANDARD

Before finalizing, the agent should review its own implementation as if reviewing another developer's PR.

Check:

```text
Correctness
Security
Performance
Type safety
Readability
Duplication
Accessibility
Mobile UX
Error handling
Edge cases
```

---

# 80. FINAL ENGINEERING RULE

The agent should prefer:

```text
Existing solution
      ↓
Reuse
      ↓
Refactor
      ↓
Extend
      ↓
New implementation only if necessary
```

rather than:

```text
New feature
      ↓
Create new everything
```

---

# 81. FINAL ARCHITECTURE PRINCIPLE

The application should remain:

```text
                    AL-MUSTAFA ACADEMY
                           │
                ┌──────────┴──────────┐
                │                     │
             Frontend              Backend
                │                     │
       TanStack Start/React       Supabase
                │                     │
       ┌────────┼────────┐      ┌─────┼─────────┐
       │        │        │      │     │         │
     Admin   Teacher  Student  Auth  DB      Storage
                         │
                      Guardian
```

External services:

```text
WhatsApp
   ↓
wa.me

Live Classes
   ↓
External meeting platform
```

The Academy application remains the central management system.

---

# 82. FINAL QUALITY TARGET

The final codebase should be:

```text
SECURE
FAST
LIGHTWEIGHT
TYPE-SAFE
RESPONSIVE
ACCESSIBLE
MODULAR
REUSABLE
TESTABLE
MAINTAINABLE
SCALABLE
```

Most importantly:

> **Do not solve today's problem by creating tomorrow's technical debt.**