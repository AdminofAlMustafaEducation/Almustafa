// Academy shared constants
// Single source of truth for grades, subjects, and academy information

export const GRADES = [
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "FSc Pre-Engineering",
  "FSc Pre-Medical",
  "ICS",
  "I.Com",
] as const;

export type Grade = (typeof GRADES)[number];

export const SUBJECTS = [
  { id: "science", name: "Science", code: "SCI", category: "general" },
  { id: "urdu", name: "Urdu", code: "URD", category: "language" },
  { id: "english", name: "English", code: "ENG", category: "language" },
  { id: "islamiat", name: "Islamiat", code: "ISL", category: "religious" },
  { id: "pak_studies", name: "Pakistan Studies", code: "PST", category: "social" },
  { id: "computer", name: "Computer", code: "COM", category: "technical" },
  { id: "biology", name: "Biology", code: "BIO", category: "science" },
  { id: "physics", name: "Physics", code: "PHY", category: "science" },
  { id: "chemistry", name: "Chemistry", code: "CHE", category: "science" },
  { id: "mathematics", name: "Mathematics", code: "MAT", category: "science" },
  { id: "accounting", name: "Accounting", code: "ACC", category: "commerce" },
  { id: "statistics", name: "Statistics", code: "STA", category: "commerce" },
  { id: "economics", name: "Economics", code: "ECO", category: "commerce" },
] as const;

export type SubjectInfo = (typeof SUBJECTS)[number];

// Academy name in Arabic
export const ACADEMY_AR = "أكاديمية المصفى";

// Academy branding
export const ACADEMY_NAME = "Al-Mustafa Academy";
export const ACADEMY_TAGLINE = "Evening Coaching";
export const ACADEMY_LOCATION = "Islamabad";

// Phone normalization for Pakistan
export function normalizePhone(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Handle different formats
  if (cleaned.startsWith("92")) {
    return cleaned;
  }
  if (cleaned.startsWith("0")) {
    return "92" + cleaned.slice(1);
  }
  // Assume it's a local number without prefix
  return "92" + cleaned;
}

// Validate Pakistani phone number
export function isValidPakistaniPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Pakistani numbers: 92 + 10 digits (e.g., 923001234567)
  return /^92\d{10}$/.test(normalized);
}

// Build WhatsApp URL
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhone(phone);
  let url = `https://wa.me/${normalized}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
}

// Build attendance notification message
export function buildAttendanceMessage(
  studentName: string,
  status: "present" | "absent" | "late" | "excused",
  className: string,
  subject: string,
  date: string
): string {
  const statusText =
    status === "present"
      ? "was present"
      : status === "absent"
        ? "was absent"
        : status === "late"
          ? "was late"
          : "was excused";

  return `Assalam-o-Alaikum,\n\n${studentName} ${statusText} in today's ${subject} class.\n\nDate: ${date}\nClass: ${className}\nSubject: ${subject}\n\nAl-Mustafa Academy`;
}

// Build result notification message
export function buildResultMessage(
  studentName: string,
  examName: string,
  subject: string,
  marks: number,
  totalMarks: number,
  grade: string
): string {
  return `Assalam-o-Alaikum,\n\n${studentName}'s result for ${examName}:\n\nSubject: ${subject}\nMarks: ${marks}/${totalMarks}\nGrade: ${grade}\n\nAl-Mustafa Academy`;
}

// Build fee reminder message
export function buildFeeMessage(
  studentName: string,
  amount: number,
  month: string,
  dueDate: string
): string {
  return `Assalam-o-Alaikum,\n\nThis is a reminder that the fee for ${studentName} (${month}) of Rs. ${amount} is due on ${dueDate}.\n\nPlease clear the dues at your earliest convenience.\n\nJazakAllah\nAl-Mustafa Academy`;
}

// Build general guardian message
export function buildGuardianMessage(
  guardianName: string,
  message: string
): string {
  return `Assalam-o-Alaikum ${guardianName},\n\n${message}\n\nAl-Mustafa Academy`;
}

// Grade labels for display
export const GRADE_LABELS: Record<string, string> = {
  "6th": "Class 6",
  "7th": "Class 7",
  "8th": "Class 8",
  "9th": "Class 9",
  "10th": "Class 10",
  "FSc Pre-Engineering": "FSc Pre-Engineering",
  "FSc Pre-Medical": "FSc Pre-Medical",
  "ICS": "ICS",
  "I.Com": "I.Com",
};

// Program labels (legacy mapping)
export const PROGRAM_LABELS: Record<string, string> = {
  matric: "Matric",
  fsc_pre_medical: "FSc Pre-Medical",
  fsc_pre_engineering: "FSc Pre-Engineering",
};

// Campus labels
export const CAMPUS_LABELS: Record<string, string> = {
  main: "Main Campus",
  second: "Second Campus",
};

// Status colors for badges
export const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  graduated: "bg-blue-100 text-blue-800",
  withdrawn: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  enrolled: "bg-purple-100 text-purple-800",
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  partial: "bg-orange-100 text-orange-800",
};
