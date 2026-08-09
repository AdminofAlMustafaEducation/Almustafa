# API & DATA CONTRACTS

## Goal

Keep communication between UI, hooks, server logic and Supabase consistent.

## Standard Result

All important operations should follow a predictable structure:

```text
success
data
error
```

Example:

```text
{
  success: true,
  data: {...},
  error: null
}
```

Failure:

```text
{
  success: false,
  data: null,
  error: "Unable to save attendance"
}
```

## Rules

- Use TypeScript types for request/response structures.
- Validate all external input.
- Never trust IDs supplied by the browser.
- Verify authorization before mutations.
- Never expose service-role credentials.
- Never return unnecessary private fields.
- Use pagination for large datasets.
- Avoid N+1 database queries.
- Prefer database filtering over downloading large datasets.

## Mutations

Important operations should be atomic where necessary.

Examples:

```text
Approve Application
→ Create Student
→ Link Guardian
→ Update Application
```

Either complete successfully or fail safely.

## Naming

Use consistent names:

```text
createStudent
updateStudent
getStudent
listStudents

createAttendance
updateAttendance

createExam
saveExamResult

createNotification
markNotificationRead
```

Avoid multiple names for the same operation.

## Errors

Return user-safe errors.

Never expose:

```text
SQL
stack traces
database internals
secrets
tokens
```

Keep technical errors in secure development/server logs.