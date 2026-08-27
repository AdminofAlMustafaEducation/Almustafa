export type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  isActive: boolean;
  sortOrder: number;
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Juniors Admissions Open (Class 1-8)",
    message:
      "Admissions are now open for Junior classes (1-8). Build strong foundations with experienced teachers and small batches. Contact us to enroll your child.",
    date: "2026-08-08",
    isRead: false,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "2",
    title: "Matric Admissions Open (9th & 10th)",
    message:
      "Registration is open for Matric 9th and 10th classes. FBISE-aligned coaching, weekly tests and concept-based preparation. Limited seats available.",
    date: "2026-08-08",
    isRead: false,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "3",
    title: "Intermediate Admissions Open (11th & 12th)",
    message:
      "F.Sc Pre-Medical and Pre-Engineering admissions for 1st Year and 2nd Year are now open. Senior college lecturers, entry test preparation and board-focused coaching.",
    date: "2026-08-08",
    isRead: false,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "4",
    title: "Evening Batches Starting Soon",
    message:
      "All evening batches for Juniors, Matric and F.Sc are starting soon. Classes run Monday to Saturday, 3:00 PM to 9:00 PM. Visit our G-11/2 or G-10/4 campus.",
    date: "2026-08-08",
    isRead: false,
    isActive: true,
    sortOrder: 4,
  },
];
