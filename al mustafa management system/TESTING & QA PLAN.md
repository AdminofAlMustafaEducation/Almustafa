# TESTING & QA PLAN

Every feature must be tested before being considered complete.

## 1. Functional

Test:

```text
Create
Read
Update
Delete
Search
Filter
Pagination
Loading
Empty states
Errors
```

## 2. Permission Testing

For every protected feature:

```text
Admin → allowed
Teacher → assigned scope only
Student → own data only
Guardian → linked child only
Unauthorized → denied
```

Test both allowed and forbidden operations.

## 3. Security

Check:

```text
RLS
Authentication
Authorization
Input validation
File uploads
Secrets
Duplicate submissions
ID manipulation
Unauthorized API/database requests
```

## 4. Responsive Testing

Test:

```text
Mobile
Tablet
Laptop
Desktop
Large desktop
```

Important panels must feel app-like on mobile.

Check:

```text
navigation
tables
forms
dialogs
buttons
charts
notifications
touch targets
overflow
```

## 5. Performance

Check:

```text
database query count
payload size
initial page load
image size
unnecessary realtime subscriptions
large lists
mobile performance
```

## 6. Accessibility

Check:

```text
keyboard navigation
labels
focus states
contrast
screen-reader-friendly controls
button names
form errors
```

## 7. Regression

After every major feature:

```text
typecheck
lint
tests
existing admin functionality
student panel
teacher panel
guardian panel
```

Never claim a test passed unless it was actually executed.