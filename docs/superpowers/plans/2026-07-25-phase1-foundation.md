# Al-Mustafa Academy — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the foundation for admin panel and admission portal — Supabase setup, authentication, admin layout, and critical bug fixes.

**Architecture:** React 19 + TanStack Router + Supabase (PostgreSQL + Auth + Storage) + Tailwind CSS 4 + shadcn/ui

**Tech Stack:** TypeScript, Supabase JS client, React Hook Form, Zod, Recharts

## Global Constraints

- TypeScript strict mode enabled
- All new components use shadcn/ui primitives
- Admin design: black & white primary color scheme
- Public site: keep existing navy/gold scheme
- No paid services (all free tiers)
- Mobile-first responsive design
- WCAG 2.2 AA compliance

---

## File Structure

### New Files to Create

```
src/
├── lib/
│   ├── supabase.ts              — Supabase client initialization
│   ├── auth.ts                  — Auth utilities and types
│   └── admin-styles.css         — Admin-specific CSS variables
│
├── hooks/
│   ├── use-auth.ts              — Auth context hook
│   ├── use-students.ts          — Student CRUD hooks
│   ├── use-admissions.ts        — Admission CRUD hooks
│   └── use-faculty-admin.ts     — Faculty admin hooks
│
├── components/
│   ├── auth/
│   │   ├── auth-provider.tsx    — Auth context provider
│   │   ├── protected-route.tsx  — Route guard component
│   │   └── login-form.tsx       — Login form
│   │
│   ├── admin/
│   │   ├── admin-sidebar.tsx    — Sidebar navigation
│   │   ├── admin-header.tsx     — Header with user menu
│   │   ├── stats-card.tsx       — Dashboard metric card
│   │   ├── data-table.tsx       — Reusable data table
│   │   └── image-uploader.tsx   — Image upload component
│   │
│   └── portal/
│       ├── portal-layout.tsx    — Portal layout wrapper
│       └── status-tracker.tsx   — Application status tracker
│
├── routes/
│   ├── admin.tsx                — Admin layout route
│   ├── admin/
│   │   ├── index.tsx            — Admin dashboard
│   │   ├── students.tsx         — Student list
│   │   ├── admissions.tsx       — Admissions list
│   │   ├── faculty.tsx          — Faculty management
│   │   ├── gallery-admin.tsx    — Gallery management
│   │   ├── inquiries.tsx        — Inquiry management
│   │   └── settings.tsx         — Site settings
│   │
│   ├── apply.tsx                — Admission form
│   ├── track.tsx                — Application tracking
│   │
│   ├── portal.tsx               — Portal layout
│   └── portal/
│       ├── index.tsx            — Student dashboard
│       ├── attendance.tsx       — Attendance view
│       └── results.tsx          — Results view
│
├── data/
│   └── schema.ts                — Zod schemas for all forms
│
└── types/
    └── database.ts              — TypeScript types for DB tables
```

### Existing Files to Modify

```
src/routes/__root.tsx            — Add auth provider wrapper
src/routes/index.tsx             — Fix accessibility issues
src/routes/gallery.tsx           — Fix lightbox accessibility
src/components/site-header.tsx   — Add aria-current, login link
src/styles.css                   — Fix contrast, add admin vars
vercel.json                      — Add cache headers
```

---

## Task 1: Install Supabase Dependencies

**Files:**
- Modify: `package.json`

**Steps:**

- [ ] **Step 1: Install Supabase client**

```bash
cd "F:\almustafa education system"
bun add @supabase/supabase-js
```

- [ ] **Step 2: Install Sentry (optional, free tier)**

```bash
bun add @sentry/react
```

- [ ] **Step 3: Verify installation**

```bash
bun run build
```

Expected: Build succeeds with no errors

---

## Task 2: Create Supabase Client and Types

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/types/database.ts`

**Steps:**

- [ ] **Step 1: Create Supabase client**

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Create TypeScript types for database**

```typescript
// src/types/database.ts
export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id?: string;
  roll_number?: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  class_level: 9 | 10 | 11 | 12;
  program: "matric" | "fsc_pre_medical" | "fsc_pre_engineering";
  campus: "main" | "second";
  parent_name: string;
  parent_phone: string;
  parent_cnic?: string;
  photo_url?: string;
  admission_date: string;
  status: "active" | "inactive" | "graduated" | "withdrawn";
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  application_number: string;
  student_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  class_level: number;
  program: string;
  campus: string;
  previous_school?: string;
  previous_marks?: string;
  parent_name: string;
  parent_phone: string;
  parent_cnic?: string;
  photo_url?: string;
  documents: string[];
  status: "pending" | "reviewing" | "approved" | "rejected" | "enrolled";
  reviewer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  user_id?: string;
  name: string;
  subject: string;
  designation?: string;
  bio?: string;
  photo_url?: string;
  campus?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  class_level: number;
  program: string;
  campus: string;
  teacher_id?: string;
  schedule?: string;
  capacity: number;
  session: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: "present" | "absent" | "late";
  notes?: string;
  created_at: string;
}

export interface Test {
  id: string;
  batch_id: string;
  name: string;
  subject: string;
  total_marks: number;
  test_date: string;
  created_at: string;
}

export interface TestResult {
  id: string;
  test_id: string;
  student_id: string;
  marks_obtained: number;
  remarks?: string;
  created_at: string;
}

export interface Fee {
  id: string;
  student_id: string;
  amount: number;
  fee_type: "monthly" | "admission" | "exam" | "other";
  month?: string;
  due_date: string;
  paid_date?: string;
  status: "pending" | "paid" | "overdue" | "waived";
  payment_method?: string;
  receipt_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "responded" | "closed";
  responded_at?: string;
  created_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
  updated_by?: string;
}
```

- [ ] **Step 3: Create .env.example file**

```bash
# .env.example
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 4: Verify types compile**

```bash
bun run build
```

---

## Task 3: Create Auth System

**Files:**
- Create: `src/components/auth/auth-provider.tsx`
- Create: `src/components/auth/protected-route.tsx`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/hooks/use-auth.ts`

**Interfaces:**
- Produces: `useAuth()` hook returning `{ user, login, logout, isLoading }`
- Produces: `ProtectedRoute` component accepting `allowedRoles` prop

**Steps:**

- [ ] **Step 1: Create auth hook**

```typescript
// src/hooks/use-auth.ts
import { createContext, useContext } from "react";
import type { User, UserRole } from "@/types/database";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

- [ ] **Step 2: Create auth provider**

```tsx
// src/components/auth/auth-provider.tsx
import { useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext, type AuthContextType } from "@/hooks/use-auth";
import type { User } from "@/types/database";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchUser(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUser(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } else {
      setUser(data);
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }

  const value: AuthContextType = { user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

- [ ] **Step 3: Create protected route component**

```tsx
// src/components/auth/protected-route.tsx
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/database";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 4: Create login form**

```tsx
// src/components/auth/login-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="admin@almustafa.edu"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
bun run build
```

---

## Task 4: Create Admin Layout

**Files:**
- Create: `src/routes/admin.tsx` — Admin layout route
- Create: `src/components/admin/admin-sidebar.tsx`
- Create: `src/components/admin/admin-header.tsx`

**Interfaces:**
- Produces: Admin layout with sidebar, header, and content area
- Sidebar has navigation links to all admin routes
- Header has user menu and breadcrumbs

**Steps:**

- [ ] **Step 1: Create admin sidebar component**

```tsx
// src/components/admin/admin-sidebar.tsx
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  GraduationCap,
  Calendar,
  CreditCard,
  Image,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/admissions", label: "Admissions", icon: FileText },
  { to: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/admin/batches", label: "Batches", icon: Calendar },
  { to: "/admin/fees", label: "Fees", icon: CreditCard },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const matchRoute = useMatchRoute();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-gray-200 bg-black text-white transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
        {!collapsed && (
          <span className="font-display text-lg font-bold">Al-Mustafa</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 hover:bg-gray-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: item.to !== "/admin" });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create admin header component**

```tsx
// src/components/admin/admin-header.tsx
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{user?.name}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create admin layout route**

```tsx
// src/routes/admin.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
bun run build
```

---

## Task 5: Create Admin Dashboard

**Files:**
- Create: `src/routes/admin/index.tsx`
- Create: `src/components/admin/stats-card.tsx`

**Steps:**

- [ ] **Step 1: Create stats card component**

```tsx
// src/components/admin/stats-card.tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {description && (
        <p className={cn(
          "mt-1 text-sm",
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create admin dashboard page**

```tsx
// src/routes/admin/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Users, FileText, MessageSquare, GraduationCap } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  // TODO: Fetch real data from Supabase
  const stats = [
    { title: "Total Students", value: "187", icon: Users, description: "+12 this month", trend: "up" as const },
    { title: "Pending Admissions", value: "23", icon: FileText, description: "5 new today", trend: "up" as const },
    { title: "New Inquiries", value: "8", icon: MessageSquare, description: "3 unread", trend: "neutral" as const },
    { title: "Active Faculty", value: "11", icon: GraduationCap },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
          <p className="mt-2 text-sm text-gray-500">No inquiries yet.</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Admission Pipeline</h3>
          <p className="mt-2 text-sm text-gray-500">No applications yet.</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
bun run build
```

---

## Task 6: Create Login Page

**Files:**
- Create: `src/routes/login.tsx`

**Steps:**

- [ ] **Step 1: Create login page**

```tsx
// src/routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth/login-form";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Al-Mustafa Academy</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

---

## Task 7: Fix Critical Accessibility Bugs

**Files:**
- Modify: `src/routes/gallery.tsx` — Fix lightbox focus trap and aria-labels
- Modify: `src/routes/index.tsx` — Fix color contrast
- Modify: `src/components/site-header.tsx` — Add aria-current
- Modify: `src/styles.css` — Fix prefers-reduced-motion

**Steps:**

- [ ] **Step 1: Fix gallery lightbox aria-label**

In `src/routes/gallery.tsx`, find the lightbox div and add aria-label:

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label={`Image ${activeIndex! + 1} of ${visible.length}: ${active.caption}`}
  className="fixed inset-0 z-[100] ..."
>
```

- [ ] **Step 2: Fix color contrast in hero section**

In `src/routes/index.tsx`, change `text-white/82` to `text-white/90` and `text-white/78` to `text-white/85`:

```tsx
// Line 171
<p className="mt-6 max-w-2xl text-fluid-base text-white/90 sm:mt-7">

// Line 220
<span className="stat-pill">Small batches</span>
```

- [ ] **Step 3: Add aria-current to navigation**

In `src/components/site-header.tsx`, add `aria-current="page"` to active links.

- [ ] **Step 4: Fix prefers-reduced-motion for all transitions**

In `src/styles.css`, update the reduced-motion media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Verify build**

```bash
bun run build
```

---

## Task 8: Optimize Performance

**Files:**
- Modify: `vercel.json` — Add cache headers
- Modify: `src/routes/__root.tsx` — Add preload for LCP image
- Modify: `src/routes/index.tsx` — Add fetchpriority to hero image

**Steps:**

- [ ] **Step 1: Add cache headers to vercel.json**

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/brand/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/faculty/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Add fetchpriority to hero image**

In `src/routes/index.tsx`, find the hero student image and add `fetchPriority="high"`:

```tsx
<img
  src={heroStudent}
  alt="A bright student ready for evening coaching at Al-Mustafa Academy"
  className="relative mx-auto h-full max-h-[24rem] w-full object-contain drop-shadow-2xl sm:max-h-[31rem]"
  loading="eager"
  fetchPriority="high"
  width={1024}
  height={1024}
/>
```

- [ ] **Step 3: Fix theme-color**

In `src/routes/__root.tsx`, change theme-color:

```tsx
{ name: "theme-color", content: "#223a57" },
```

- [ ] **Step 4: Verify build**

```bash
bun run build
```

---

## Task 9: Wrap App with Auth Provider

**Files:**
- Modify: `src/routes/__root.tsx`

**Steps:**

- [ ] **Step 1: Import and wrap with AuthProvider**

In `src/routes/__root.tsx`, update the RootComponent:

```tsx
import { AuthProvider } from "@/components/auth/auth-provider";

function RootComponent() {
  return (
    <AuthProvider>
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </AuthProvider>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

---

## Task 10: Create Admin CSS Variables

**Files:**
- Modify: `src/styles.css`

**Steps:**

- [ ] **Step 1: Add admin-specific CSS variables**

```css
/* Admin Panel Variables */
.admin-sidebar {
  --sidebar-width: 16rem;
  --sidebar-collapsed-width: 4rem;
}

/* Admin table styles */
.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.admin-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  border-bottom: 1px solid #f3f4f6;
}

.admin-table tr:hover td {
  background-color: #f9fafb;
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

---

## Verification Checklist

After all tasks complete:

- [ ] `bun run build` succeeds
- [ ] `bun run lint` passes
- [ ] Login page renders at `/login`
- [ ] Admin layout renders at `/admin` (with auth)
- [ ] Sidebar navigation works
- [ ] All existing public pages still work
- [ ] No console errors
- [ ] Accessibility fixes applied
- [ ] Performance optimizations applied
