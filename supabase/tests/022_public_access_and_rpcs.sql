-- Phase 2/3 authorization regression tests
-- Run with `supabase test db` after applying the full migration chain in a disposable project.

begin;
select plan(36);

select ok(
  not has_table_privilege('anon', 'public.applications', 'insert'),
  'anonymous callers cannot bypass the submission RPC'
);
select ok(
  not has_table_privilege('anon', 'public.applications', 'select'),
  'anonymous callers cannot select application rows'
);
select ok(
  not has_table_privilege('anon', 'public.applications', 'update'),
  'anonymous callers cannot update applications'
);
select ok(
  not has_table_privilege('anon', 'public.applications', 'delete'),
  'anonymous callers cannot delete applications'
);

select ok(
  has_function_privilege('anon', 'public.submit_application(jsonb)', 'execute'),
  'anonymous callers can submit through the allow-listed RPC'
);
select ok(
  has_function_privilege('anon', 'public.track_application(text)', 'execute'),
  'anonymous callers can track by admission code'
);
select ok(
  not has_function_privilege('anon', 'public.track_application(text,text)', 'execute'),
  'anonymous callers cannot use the retired email tracking signature'
);
select ok(
  hasnt_column('public', 'applications', 'password'),
  'applications do not store raw passwords'
);
select ok(
  hasnt_column('public', 'students', 'password'),
  'students do not store raw passwords'
);
select ok(
  not has_function_privilege('anon', 'public.approve_application(uuid,uuid)', 'execute'),
  'anonymous callers cannot execute approval'
);
select ok(
  not has_function_privilege('authenticated', 'public.approve_application(uuid,uuid)', 'execute'),
  'authenticated callers cannot execute approval directly'
);
select ok(
  not has_function_privilege('anon', 'public.approve_and_create_account(uuid,uuid,uuid)', 'execute'),
  'anonymous callers cannot execute account creation'
);
select ok(
  not has_function_privilege('authenticated', 'public.approve_and_create_account(uuid,uuid,uuid)', 'execute'),
  'authenticated callers cannot execute account creation directly'
);
select ok(
  not has_function_privilege('anon', 'public.generate_monthly_fees(text,numeric)', 'execute'),
  'anonymous callers cannot generate fees'
);
select ok(
  has_function_privilege('service_role', 'public.generate_monthly_fees(text,numeric)', 'execute'),
  'service role can execute fee generation'
);
select ok(
  has_function_privilege('service_role', 'public.approve_and_create_account(uuid,uuid,uuid)', 'execute'),
  'service role can execute Auth-bound account provisioning'
);
select ok(
  has_table_privilege('authenticated', 'public.applications', 'select'),
  'authenticated admin reads remain available for policy evaluation'
);
select is(
  (select public from storage.buckets where id = 'notes'),
  false,
  'academic notes bucket is private'
);
select is(
  (select public from storage.buckets where id = 'gallery'),
  true,
  'gallery bucket remains public site content'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read permitted note files'
  ),
  'note object reads have an explicit authenticated policy'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Teachers and admins can upload note files'
  ),
  'note object uploads have an explicit teacher/admin policy'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Teachers and admins can update note files'
  ),
  'note object updates have an explicit teacher/admin policy'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Teachers and admins can delete note files'
  ),
  'note object deletes have an explicit teacher/admin policy'
);
select ok(
  not has_function_privilege('anon', 'public.is_admin()', 'execute'),
  'anonymous callers cannot execute the admin helper'
);
select ok(
  has_function_privilege('authenticated', 'public.is_admin()', 'execute'),
  'authenticated callers can use the policy-bound admin helper'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'Admin can manage students'
  ),
  'students have an explicit profile-based admin policy'
);
select ok(
  exists (
    select 1 from pg_trigger
    where tgrelid = 'public.applications'::regclass
      and tgname = 'applications_submission_cooldown'
      and not tgisinternal
  ),
  'application submissions have a database-side cooldown trigger'
);
select ok(
  exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename = 'applications'
      and indexname = 'idx_applications_email_created_at'
  ),
  'application cooldown lookups have a supporting index'
);
select ok(
  not has_function_privilege('anon', 'public.handle_new_user()', 'execute'),
  'anonymous callers cannot execute the Auth profile trigger helper'
);
select ok(
  not has_function_privilege('anon', 'public.enforce_application_submission_cooldown()', 'execute'),
  'anonymous callers cannot execute the submission cooldown trigger helper'
);
select ok(
  not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'applications'
      and policyname = 'Public can insert applications'
  ),
  'direct public application inserts remain removed'
);
select ok(
  not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'Authenticated users can manage students'
  ),
  'broad authenticated student management remains removed'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'Students can read own record'
  ),
  'students can read only their own profile row'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'teachers'
      and policyname = 'Teachers can read own profile'
  ),
  'teachers can read only their own profile row'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_students'
      and policyname = 'Teachers can read assigned enrollments'
  ),
  'teachers can read assigned class enrollments'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'exam_results'
      and policyname = 'Teachers can manage assigned results'
  ),
  'teachers can manage assigned exam results'
);

select * from finish();
rollback;
