# Al-Mustafa Academy Remediation Roadmap

**Status:** Repository phases complete; external environment validation pending
**Owner:** Al-Mustafa engineering  
**Scope:** Public website, Supabase data layer, authentication, admin portal, teacher portal, student portal, application tracking, Vercel delivery, and GitHub release controls.

## Release policy

The portal must not accept or expose real student, applicant, academic, guardian, or financial data until Phase 1 exits. The public marketing pages may remain available, but portal data must be limited to a controlled test tenant or a maintenance/safe-error state.

## Scalable phases

| Phase                                            | Objective                                                                                | Main deliverables                                                                                                                                                                                                                 | Exit criteria                                                                                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Contain and establish the security boundary   | Stop unsafe data handling and prevent known fail-open behavior from reaching production. | Remove plaintext credential handling from the client/data model, disable production mock fallbacks, add release guardrails, document the canonical migration source, and gate real portal access until authorization tests exist. | No raw password is stored or returned by the application path; production cannot silently use mock data; release checks are explicit and reproducible. |
| 2. Repair database authorization                 | Make Supabase the enforceable authorization boundary.                                    | One canonical migration chain, RLS on every exposed table, explicit grants/revokes, admin-only RPCs bound to `auth.uid()`, restrictive application-tracking DTO/RPC, and private academic storage policies.                       | Anonymous, teacher, student, guardian, and admin pgTAP tests pass for allowed and forbidden operations.                                                |
| 3. Replace authentication and applicant tracking | Use Supabase Auth correctly and separate identity from application tracking.             | Remove password columns, server-side account provisioning, password reset/email verification plan, random hashed tracking tokens, rate limiting, and minimal status responses.                                                    | No credential or full application row is exposed through public reads; approval is atomic and auditable.                                               |
| 4. Restore correctness and type safety           | Eliminate known defects and duplicate implementations.                                   | Fix all TypeScript diagnostics and lint errors, unify database types, repair attendance/result payloads, remove the no-op result saver, and standardize error handling.                                                           | Clean `npm ci`, typecheck, lint, build, and integration tests.                                                                                         |
| 5. Harden delivery and storage                   | Align Vercel behavior with repository intent.                                            | Enforce CSP/security headers on the actual custom-domain response, remove wildcard CORS, protect private buckets with signed URLs, validate uploads, and verify preview/production domains.                                       | Header, storage, and deployment probes pass on custom and Vercel hosts.                                                                                |
| 6. Scale product operations                      | Make the system reliable at academy growth levels.                                       | Pagination, narrow selects, indexes, debounced search, durable inquiry capture, rate limits/bot defense, audit logging, observability, accessibility, mobile QA, SEO, backups, and disaster-recovery procedures.                  | Acceptance matrix passes for all portals and operating procedures are documented.                                                                      |

## Phase 1 — Containment and release guardrails

### In scope

Phase 1 focuses on preventing additional exposure and preventing false confidence. It does not attempt to complete the entire authorization redesign. The implementation must be safe to deploy independently and must not require a production database migration during this phase.

The Phase 1 workstream is:

1. Add a production-safety flag that makes mock data unavailable in production and fails closed when Supabase is missing or unusable.
2. Stop collecting or persisting a user-chosen password in the public application flow. Until Phase 3 is implemented, the form should explain that account credentials are provisioned after approval rather than accepting a password that the database cannot safely manage.
3. Remove password values from client-facing application result types and response handling.
4. Add explicit release scripts and documentation so deployment does not report success while typecheck/lint/security checks are known to fail.
5. Keep the all-in-one SQL file clearly marked as non-canonical until it is regenerated from the ordered migration chain in Phase 2.
6. Add a safe-error and operational checklist for the public portal routes; no real data is submitted as part of this phase.

### Explicit non-goals

Phase 1 will not invoke privileged RPCs, submit an application to production, alter production Supabase data, rotate unknown user credentials automatically, or claim that the complete RLS redesign is finished. It will not weaken existing policies to make the UI pass.

### Phase 1 acceptance criteria

| Check                    | Pass condition                                                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Production mock guard    | A production build cannot enable mock data through an absent Supabase configuration or a generic query error.                          |
| Credential collection    | The public application form does not accept or display a raw portal password.                                                          |
| Credential response      | Application creation does not return a password field to the browser.                                                                  |
| Release scripts          | `typecheck`, `lint`, `build`, and security checks are named scripts and their status is visible to CI/deploy operators.                |
| Database source of truth | The repository explicitly identifies ordered migrations as canonical and warns against executing the stale monolith until regenerated. |
| Change safety            | No production data mutation is performed by the agent; all code changes are reviewable in Git.                                         |

## Phase 1 implementation record

The first containment pass is implemented in the working tree. Mock mode is now development-only across the data hooks, schema-error fallbacks are development-only, public and admin student forms no longer collect raw portal passwords, the admissions mutation no longer sends a password field, the all-in-one SQL file is marked non-canonical, and `security:scan`, `typecheck`, `lint`, `verify:phase1`, and `build:release` scripts are defined.

The Phase 1 security scan passed, the production build passed, and `git diff --check` passed. Typecheck and lint remain failing because of pre-existing project defects: 120 TypeScript diagnostics and 935 lint problems in the post-change run. Accordingly, `build:release` is intentionally blocked until the next correctness phase repairs those failures.

## Phase 2 implementation record

The repository-side Phase 2 boundary is now prepared but not applied to any Supabase environment. The public tracking route requires both application number and application email, calls a minimal status RPC, and no longer displays applicant identity or reviewer notes. Migration `022_secure_public_access_and_privileged_rpcs.sql` removes legacy password columns, replaces the password-dependent account-provisioning function, restricts direct application-table access, revokes browser execution of privileged RPCs, and uses an empty `search_path` for security-definer functions. Twelve pgTAP assertions cover table privileges and privileged-function execution.

The Phase 2 security scan, production build, and diff check pass. Full database regression tests could not run because the repository has no local Supabase configuration/database and the transient CLI reported that PostgreSQL was unavailable on `127.0.0.1:54322`. The migration must therefore be tested in a disposable Supabase project before it is applied to production. Project-wide typecheck remains blocked by existing defects and is not a Phase 2 database-validation substitute.

## Phase 3 implementation record

The repository now includes a Supabase-hosted `approve-and-admit` Edge Function that verifies the Supabase access token, requires an active admin profile, invites the student through Supabase Auth, and invokes an Auth-bound provisioning RPC using platform-managed server credentials. The obsolete Vercel `/api/approve-and-admit` route was removed, so approval no longer depends on a missing Vercel service-key variable. The client no longer sends a reviewer ID to the privileged operation. Authentication role resolution now requires an active `profiles` row and no longer trusts localStorage, signup metadata, or email-pattern inference as an authority.

Application submission is moving behind `submit_application(jsonb)`, which generates a high-entropy tracking token and stores only its SHA-256 digest. Public tracking now requires only the admission code, and the response remains limited to status fields. Migrations `023`, `024`, `025`, and `028` implement the Auth linkage, least-privilege profile bootstrap, secure submission, and admission-code-only lookup contracts. The existing pgTAP suite has been extended to 36 assertions.

The Phase 3 security scan, focused Prettier checks, production build, and diff checks pass. Project-wide typecheck remains blocked only by pre-existing route/table typing defects; no new errors were reported in the Phase 3 API, auth module, admissions hook, tracking route, or application wizard. Supabase database tests remain pending because no local Postgres/Supabase instance is available. The approval Edge Function was deployed to the connected Supabase project with JWT verification enabled and passed an unauthenticated smoke test with HTTP 401. Authenticated approval still requires a real admin session and applicant email; no test account was created and no application was approved during validation.

## Phase 4 implementation record

Phase 4 correctness and type-safety remediation is complete in the working tree. The generated TanStack route tree was refreshed, shared Student/Faculty/Attendance models were aligned with the portal consumers, DataTable callbacks were restored to the `(value, row)` contract, optional program/campus/date values now have safe fallbacks, attendance status compatibility was repaired, student-creation unions were narrowed, and Supabase joined relations in the portal hooks are normalized without explicit `any` annotations. The admissions and student-portal mappings now use canonical form/model types and null-safe relation handling.

The repository-wide formatting pass intentionally touched 77 files, primarily to remove existing formatting violations and make the lint gate actionable; this broad formatting-only impact should be reviewed separately from semantic changes. Phase 4’s local checks passed: `npm run typecheck` (0 diagnostics), `npm run lint` (0 errors and 7 existing `react-refresh/only-export-components` warnings), `npm run security:scan`, `npm run build`, and `git diff --check`. The production build emitted the expected local warning that Supabase environment variables were absent; no production credentials or data were used. At that point the lockfile/install mismatch and database test environment were still unresolved; the dependency blocker was subsequently repaired in Phase 6, while Supabase pgTAP execution remains environment-dependent.

Phase 4 was checkpointed locally before the remaining phases were implemented. Later authorized work applied Supabase migrations `022`–`035` to the connected project, deployed the `approve-and-admit` Edge Function, and performed read-only/live boundary checks. No application was approved, no student row was created, and no Vercel environment variable was changed.

## Phase 5 implementation record

The delivery and storage hardening work is implemented in the repository. Migration `026_harden_storage_policies.sql` makes the `notes` bucket private, grants object access only through explicit administrator/teacher/student/guardian policies, keeps gallery reads public as intended for public-site content, and hardens the `is_admin()` security-definer helper with an empty search path and explicit grants. The client now validates note file size/type and generates one-hour authenticated signed URLs instead of public note URLs. Admin and teacher authoring flows use controlled file inputs rather than arbitrary file URL entry, and the release scanner prevents regressions to public note URLs or direct database-path anchors.

`vercel.json` now declares the canonical academy origin instead of wildcard CORS and strengthens HSTS. The linked Vercel project remains the existing `al-mustafa-clone` project for `AdminofAlMustafaEducation/Almustafa`, with the custom domain preserved. Repository changes do not modify Vercel settings or environment variables; the old Vercel approval endpoint was removed after the Supabase Edge Function became canonical.

## Phase 6 implementation record

The dependency and release surface is now reproducible: the missing `@fontsource-variable/dm-sans` lock entry was repaired, the remaining esbuild advisory was removed by pinning `tsx` to the patched `4.23.12` line, `npm ci` succeeds from a clean install, and `npm audit --audit-level=high` reports zero vulnerabilities. Node support is declared as `>=22 <25`, and `.github/workflows/quality.yml` runs locked installation, the full release gate, and whitespace validation on pull requests and `main` pushes.

Migration `027_application_submission_controls.sql` adds an indexed, database-side fifteen-minute email cooldown for anonymous application submissions. Migrations `030`–`035` harden helper grants, remove stale broad policies, align the live legacy student contract, restore student/teacher self reads, and restore teacher assignment access. Edge/IP-based rate limiting, durable audit-log review, and operational observability still require configuration in the chosen environment.

## Required follow-up approvals

Before the external rollout, execute the expanded pgTAP suite in a disposable database and create controlled admin, student, teacher, and guardian test identities. The public tracking contract is intentionally admission-code-only and returns only status metadata; this is less private than token-bound tracking, so admission-code format entropy and edge rate limiting must be monitored. The connected project has migrations through `035` and the approval Edge Function deployed, but Vercel may still serve the prior client until the repository changes are pushed and the linked deployment completes. The admin student insert and teacher assignment paths are now aligned with the live schema, but authenticated end-to-end browser verification still requires appropriate test identities.
The admin student form now sends only canonical Supabase columns and surfaces the actual database error. The Vercel project currently reports Node `24.x`, which satisfies the repository’s declared `>=22 <25` range. The connected project has migrations through `035`, and the Supabase-hosted approval Edge Function is active with JWT verification enabled. The client-side Edge Function integration still requires the repository changes to be pushed and deployed before the custom domain uses it. The local pgTAP test remains blocked until Docker/Postgres is available; authenticated browser verification still requires controlled admin, student, teacher, and guardian test identities. No Vercel environment variable is required for the new approval path.
