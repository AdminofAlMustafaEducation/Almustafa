# LIVE CLASS ARCHITECTURE

## Principle

Do NOT build video streaming inside the Academy application.

Use an external meeting platform for:

```text
video
audio
screen sharing
meeting infrastructure
```

The Academy system manages:

```text
teacher
subject
class
schedule
meeting URL
permissions
notifications
attendance
```

## Database

```text
live_classes

id
class_id
subject_id
teacher_id
title
meeting_url
start_time
end_time
status
created_at
```

## Student Flow

```text
Student Panel
   ↓
Today's Classes
   ↓
Select Class
   ↓
Join Class
   ↓
External Meeting Platform
```

## Teacher Flow

```text
Teacher Panel
   ↓
My Classes
   ↓
Schedule/Create Live Class
   ↓
Meeting Link
   ↓
Notify Students
```

## Load Strategy

If Grade 9 has four simultaneous subjects:

```text
Academy
 ├─ Math → Meeting A
 ├─ Physics → Meeting B
 ├─ Chemistry → Meeting C
 └─ English → Meeting D
```

Students connect directly to the external platform.

Do NOT proxy video through Vercel.

Do NOT store video streams in Supabase.

The Academy server therefore handles only lightweight metadata and permissions.

## Important

Start with meeting-link integration.

Do not introduce custom WebRTC infrastructure unless future scale/business requirements justify it.