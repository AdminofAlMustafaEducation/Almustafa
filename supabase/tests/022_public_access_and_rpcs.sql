-- Phase 2 authorization regression tests
-- Run with `supabase test db` after applying migrations in a disposable project.

begin;
select plan(12);

select ok(
  has_table_privilege('anon', 'public.applications', 'insert'),
  'anonymous callers can submit applications'
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
  has_function_privilege('anon', 'public.track_application(text,text)', 'execute'),
  'anonymous callers can execute the minimal tracking function'
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
  not has_function_privilege('anon', 'public.approve_and_create_account(uuid,uuid)', 'execute'),
  'anonymous callers cannot execute account creation'
);
select ok(
  not has_function_privilege('authenticated', 'public.approve_and_create_account(uuid,uuid)', 'execute'),
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
  has_table_privilege('authenticated', 'public.applications', 'select'),
  'authenticated admin reads remain available for policy evaluation'
);

select * from finish();
rollback;
