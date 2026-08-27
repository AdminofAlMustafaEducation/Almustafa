# Al-Mustafa Academy Remediation Roadmap

**Status:** Phase 1 in progress  
**Owner:** Al-Mustafa engineering  
**Scope:** Public website, Supabase data layer, authentication, admin portal, teacher portal, student portal, application tracking, Vercel delivery, and GitHub release controls.

## Release policy

The portal must not accept or expose real student, applicant, academic, guardian, or financial data until Phase 1 exits. The public marketing pages may remain available, but portal data must be limited to a controlled test tenant or a maintenance/safe-error state.

## Scalable phases

| Phase | Objective | Main deliverables | Exit criteria |
|---|---|---|---|
| 1. Contain and establish the security boundary | Stop unsafe data handling and prevent known fail-open behavior from reaching production. | Remove plaintext credential handling from the client/data model, disable production mock fallbacks, add release guardrails, document the canonical migration source, and gate real portal access until authorization tests exist. | No raw password is stored or returned by the application path; production cannot silently use mock data; release checks are explicit and reproducible. |
| 2. Repair database authorization | Make Supabase the enforceable authorization boundary. | One canonical migration chain, RLS on every exposed table, explicit grants/revokes, admin-only RPCs bound to `auth.uid()`, restrictive application-tracking DTO/RPC, and private academic storage policies. | Anonymous, teacher, student, guardian, and admin pgTAP tests pass for allowed and forbidden operations. |
| 3. Replace authentication and applicant tracking | Use Supabase Auth correctly and separate identity from application tracking. | Remove password columns, server-side account provisioning, password reset/email verification plan, random hashed tracking tokens, rate limiting, and minimal status responses. | No credential or full application row is exposed through public reads; approval is atomic and auditable. |
| 4. Restore correctness and type safety | Eliminate known defects and duplicate implementations. | Fix all TypeScript diagnostics and lint errors, unify database types, repair attendance/result payloads, remove the no-op result saver, and standardize error handling. | Clean `npm ci`, typecheck, lint, build, and integration tests. |
| 5. Harden delivery and storage | Align Vercel behavior with repository intent. | Enforce CSP/security headers on the actual custom-domain response, remove wildcard CORS, protect private buckets with signed URLs, validate uploads, and verify preview/production domains. | Header, storage, and deployment probes pass on custom and Vercel hosts. |
| 6. Scale product operations | Make the system reliable at academy growth levels. | Pagination, narrow selects, indexes, debounced search, durable inquiry capture, rate limits/bot defense, audit logging, observability, accessibility, mobile QA, SEO, backups, and disaster-recovery procedures. | Acceptance matrix passes for all portals and operating procedures are documented.

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

| Check | Pass condition |
|---|---|
| Production mock guard | A production build cannot enable mock data through an absent Supabase configuration or a generic query error. |
| Credential collection | The public application form does not accept or display a raw portal password. |
| Credential response | Application creation does not return a password field to the browser. |
| Release scripts | `typecheck`, `lint`, `build`, and security checks are named scripts and their status is visible to CI/deploy operators. |
| Database source of truth | The repository explicitly identifies ordered migrations as canonical and warns against executing the stale monolith until regenerated. |
| Change safety | No production data mutation is performed by the agent; all code changes are reviewable in Git. |

## Phase 1 implementation record

The first containment pass is implemented in the working tree. Mock mode is now development-only across the data hooks, schema-error fallbacks are development-only, public and admin student forms no longer collect raw portal passwords, the admissions mutation no longer sends a password field, the all-in-one SQL file is marked non-canonical, and `security:scan`, `typecheck`, `lint`, `verify:phase1`, and `build:release` scripts are defined.

The Phase 1 security scan passed, the production build passed, and `git diff --check` passed. Typecheck and lint remain failing because of pre-existing project defects: 120 TypeScript diagnostics and 935 lint problems in the post-change run. Accordingly, `build:release` is intentionally blocked until the next correctness phase repairs those failures.

## Required follow-up approvals

Before Phase 2, the owner must confirm the target Supabase project/environment for authorization tests and provide or create non-production identities for anonymous, admin, teacher, student, and guardian cases. Before Phase 3, the owner must decide whether existing applicant passwords are to be invalidated immediately and how applicants will receive new Supabase Auth credentials.
