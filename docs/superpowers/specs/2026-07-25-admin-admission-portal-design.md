# Al-Mustafa Academy — Admin Panel & Admission Portal Design Spec

> **Date:** 2026-07-25
> **Status:** Approved
> **Author:** AI Architect + User

---

## 1. Overview

### Purpose
Build a full-stack admin panel and student admission portal for Al-Mustafa Academy, an evening coaching academy in G-11/2 Islamabad serving ~200 students across classes 9-12 (Matric + F.Sc).

### Goals
- **Admin Panel**: Manage students, faculty, admissions, attendance, fees, gallery, content
- **Admission Portal**: Online application, document upload, status tracking
- **Student Portal**: View attendance, results, fees
- **Teacher Portal**: Mark attendance, enter results, manage tests

### Constraints
- **Budget**: $0 (all free tiers)
- **Students**: ~200 across classes 9-12
- **Auth**: Email + Password
- **Payments**: Phase 2 (skip for now)
- **Design**: Black & white primary for admin/portal; navy/gold for public site

---

## 2. Tech Stack

| Layer | Technology | Version | Cost |
|-------|-----------|---------|------|
| Frontend | React | 19 | Free |
| Router | TanStack Router/Start | 1.168+ | Free |
| Styling | Tailwind CSS | 4.2+ | Free |
| Components | Radix UI (shadcn/ui) | Latest | Free |
| Database | Supabase (PostgreSQL) | Free tier | Free |
| Auth | Supabase Auth | Free tier | Free |
| Storage | Supabase Storage | Free tier (1GB) | Free |
| API | Supabase REST API | Free | Free |
| Hosting | Vercel | Current | Free |
| Charts | Recharts | 2.15+ | Free |
| Forms | React Hook Form + Zod | Latest | Free |
| Error Tracking | Sentry | Free tier | Free |

---

## 3. Design System

### Color Palette (Admin/Portal)

```css
:root {
  --admin-bg: #ffffff;
  --admin-bg-secondary: #f8f9fa;
  --admin-sidebar: #000000;
  --admin-sidebar-text: #ffffff;
  --admin-text: #1a1a1a;
  --admin-text-secondary: #6b7280;
  --admin-border: #e5e7eb;
  --admin-primary: #000000;
  --admin-primary-foreground: #ffffff;
  --admin-success: #22c55e;
  --admin-warning: #f59e0b;
  --admin-error: #ef4444;
  --admin-info: #3b82f6;
}
```

### Typography (Admin)

- **Headings**: DM Sans (existing)
- **Body**: Inter (existing)
- **Fixed sizes** for data density (no fluid typography in admin)

### Layout

- **Sidebar**: 280px fixed, collapsible to 64px (icons only)
- **Header**: 64px fixed height
- **Content**: Fluid with max-width 1400px
- **Mobile**: Sidebar becomes sheet overlay

---

## 4. Database Schema

### Tables

1. **users** — Admin, teacher, student accounts
2. **students** — Student profiles and academic info
3. **applications** — Admission applications
4. **faculty** — Teacher/faculty profiles
5. **batches** — Class batches (e.g., "Class 9 - Morning")
6. **enrollments** — Student-batch many-to-many
7. **attendance** — Daily attendance records
8. **tests** — Test/exam definitions
9. **test_results** — Student test scores
10. **fees** — Fee records and payments
11. **gallery_images** — Gallery management
12. **inquiries** — Contact form submissions
13. **site_content** — CMS for site content

---

## 5. Route Structure

### Public Routes (existing)
- `/`, `/about`, `/programs`, `/faculty`, `/gallery`, `/contact`

### Admission Routes (new)
- `/apply` — Multi-step admission form
- `/track` — Application status tracking

### Admin Routes (new, protected)
- `/admin` — Dashboard
- `/admin/students` — Student list
- `/admin/students/:id` — Student profile
- `/admin/admissions` — Applications list
- `/admin/admissions/:id` — Application review
- `/admin/faculty` — Faculty management
- `/admin/batches` — Batch management
- `/admin/attendance` — Attendance management
- `/admin/fees` — Fee management
- `/admin/gallery` — Gallery management
- `/admin/inquiries` — Inquiry management
- `/admin/settings` — Site settings

### Student Portal Routes (new, protected)
- `/portal` — Student dashboard
- `/portal/attendance` — Attendance view
- `/portal/results` — Test results
- `/portal/fees` — Fee status

### Teacher Portal Routes (new, protected)
- `/teacher` — Teacher dashboard
- `/teacher/attendance` — Mark attendance
- `/teacher/tests` — Manage tests
- `/teacher/results` — Enter results

---

## 6. Component Architecture

### Admin Components
- `AdminSidebar` — Navigation with collapsible sections
- `AdminHeader` — User menu, search, breadcrumbs
- `StatsCard` — Dashboard metric cards with icons
- `DataTable` — Sortable, filterable, paginated table
- `StudentForm` — Add/edit student (react-hook-form + zod)
- `ApplicationReviewCard` — Approve/reject applications
- `AttendanceGrid` — Bulk attendance marking
- `FeeTracker` — Fee status overview
- `ContentEditor` — Edit site content
- `ImageUploader` — Upload and manage images

### Portal Components
- `ApplicationWizard` — Multi-step form with progress bar
- `DocumentUploader` — File upload with preview
- `StatusTracker` — Visual application status timeline
- `StudentDashboard` — Student portal home
- `TeacherDashboard` — Teacher portal home

### Shared Components
- `AuthProvider` — Authentication context provider
- `ProtectedRoute` — Route guard by role
- `LoadingSkeleton` — Loading states
- `ErrorBoundary` — Error handling
- `Toast` — Success/error notifications (sonner)

---

## 7. Authentication & Authorization

### Roles
- **admin** — Full access to admin panel
- **teacher** — Access to teacher portal, attendance, results
- **student** — Access to student portal

### Auth Flow
1. Login with email + password
2. Supabase returns JWT token
3. Token stored in httpOnly cookie
4. Role checked on route access
5. Redirect to appropriate dashboard based on role

### Protected Routes
- `/admin/*` — Requires admin role
- `/teacher/*` — Requires teacher role
- `/portal/*` — Requires student role

---

## 8. Key Features

### Admin Dashboard
- Total students, active admissions, pending inquiries (stats cards)
- Admission pipeline chart (recharts)
- Recent inquiries list
- Quick actions (add student, view admissions)

### Student Management
- List with search, filter by class/program/campus/status
- Add/edit student form with validation
- Student profile with tabs: info, attendance, results, fees
- Bulk import (future)

### Admission System
- Public application form (5 steps)
- Document upload (photos, certificates)
- Application tracking by ID
- Admin review: approve/reject with notes
- Convert approved application to student

### Attendance System
- Teacher marks attendance per batch
- Bulk mark present/absent/late
- Calendar view for students
- Attendance percentage calculation

### Fee Management
- Fee structure configuration
- Generate fees per student/month
- Mark as paid (manual for Phase 1)
- Fee status dashboard

---

## 9. Performance Requirements

- **LCP** < 2.5s on 3G (Pakistani mobile networks)
- **Admin routes** code-split from public site
- **Images** optimized to WebP, < 100KB each
- **Supabase queries** cached with TanStack Query
- **No unnecessary bundle bloat** — lazy load admin components

---

## 10. Accessibility Requirements

- WCAG 2.2 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Focus management in modals and dialogs
- Color contrast minimum 4.5:1

---

## 11. Future Phases

### Phase 2: Payments
- JazzCash / EasyPaisa integration
- Online fee payment
- Receipt generation

### Phase 3: Live Classes
- Video conferencing integration
- Live class scheduling
- Attendance from live sessions

### Phase 4: Parent Portal
- Parent login
- View child's attendance, results, fees
- Communication with teachers

### Phase 5: Advanced Features
- SMS/WhatsApp notifications
- Report card PDF generation
- Analytics dashboard
- Multilingual (Urdu/English)
