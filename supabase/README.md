# Supabase database operations

## Canonical source of truth

The ordered files under `supabase/migrations/` are the canonical database change history. Apply them through the Supabase CLI or the project’s controlled migration pipeline. Do not treat `run-all-migrations.sql` as an independently maintained production schema.

`run-all-migrations.sql` is currently a convenience snapshot that can drift from the ordered migration chain. Until it is generated automatically and verified identical to the ordered migrations, it must not be used to initialize or repair a production database.

## Phase 1 release rule

Do not connect this schema to real student, applicant, academic, guardian, or financial data until the authorization remediation is complete. In particular, the current application and student schema contains legacy password columns and the current application read policy is not an acceptable public data boundary. Phase 2 must remove those columns through a reviewed migration, restrict RPC execution, and add RLS/grant tests before production data is enabled.

## Required migration checks

Before applying a migration to any shared environment, run the type/schema checks and review the generated SQL. The authorization suite must assert both allowed and forbidden operations for anonymous, admin, teacher, student, and guardian identities. A successful migration application alone is not evidence that the policies are correct.

Apply migrations `022` through `027` in numeric order after the earlier schema history. Migration `026_harden_storage_policies.sql` creates or normalizes the `notes` and `gallery` buckets, keeps academic notes private, and requires authenticated signed URLs for note downloads. Migration `027_application_submission_controls.sql` adds a database-side fifteen-minute email cooldown and supporting index for anonymous application submissions.

The note bucket contract is intentionally enforced in both layers: storage policies authorize the object request, while the client validates file type/size and requests a one-hour signed URL. Do not restore `getPublicUrl()` for the `notes` bucket or permit arbitrary external file URLs in note authoring. The gallery bucket is public content by design, but object writes remain administrator-only.

The local pgTAP test suite now contains 26 assertions. Run `supabase test db` only in a disposable environment with Docker/Postgres available; do not apply these migrations to production as a substitute for the regression suite.
