# NOTIFICATION & WHATSAPP RULES

## Notification Types

```text
Attendance
Exam/Test Result
Notes
Announcement
Important News
Fee Reminder
Admission Update
Live Class
General Notification
```

## Recipients

```text
Teacher
   ↓
Assigned Subject + Class Students
   ↓
Student + Linked Guardian
```

Teachers must never broadcast to unrelated classes.

Admin may broadcast according to permissions.

## WhatsApp

Use:

```text
wa.me
```

No WhatsApp API/server messaging is required initially.

When a teacher updates a student's attendance/result, provide WhatsApp actions for:

```text
Student WhatsApp
Guardian WhatsApp
```

The system should generate a clean pre-filled message.

Never include:

```text
passwords
tokens
private credentials
unnecessary sensitive information
```

## Phone Rules

Normalize phone numbers to international format.

Student may update their own number according to academy policy.

Guardian may update their own number.

Changes to verified guardian relationships should require appropriate verification/admin approval.

Do NOT claim that `wa.me` proves a number has an active WhatsApp account.

## Notification Design

Store notifications in the database.

Use Realtime only when immediate delivery is genuinely useful.

Otherwise use normal fetching/refetching.

Notifications must support:

```text
read/unread
created_at
sender
recipient
type
related record
```