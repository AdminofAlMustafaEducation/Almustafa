# AGENT RULES

## BEFORE CODING

1. Inspect the existing code.
2. Read relevant project documentation.
3. Search for existing implementations.
4. Understand dependencies before modifying shared code.
5. Check database/schema implications.

## DURING CODING

- Reuse existing components/hooks/utilities.
- Avoid duplicate functionality.
- Keep code small and typed.
- Avoid unnecessary dependencies.
- Do not use `any` without a valid reason.
- Do not bypass RLS.
- Never expose secrets.
- Validate all external input.
- Keep database queries efficient.
- Use pagination for large datasets.
- Keep mobile UX in mind.
- Preserve working legacy functionality.
- Avoid unrelated refactoring.

## DATABASE

All schema changes require migrations.

Never:

```text
DROP production data
```

without explicit authorization.

Never modify production schema manually when a migration is required.

## SECURITY

Never trust frontend permissions.

Always enforce authorization server-side/database-side.

Never expose:

```text
service-role key
passwords
tokens
private student data
```

## BEFORE FINISHING

Run applicable:

```text
typecheck
lint
tests
```

Then review:

```text
security
performance
mobile
accessibility
database queries
edge cases
```

## FINAL REPORT

Tell the user:

```text
What changed
Files changed
Database migrations
Dependencies added
Tests executed
Known limitations
Potential follow-up work
```

Never claim something was tested, fixed, or verified if it was not actually done.