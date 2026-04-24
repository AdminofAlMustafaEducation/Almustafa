export type Faculty = {
  name: string;
  subject: string;
  position: string;
  initials: string;
};

export const faculty: Faculty[] = [
  { name: "Syed Ali Azeem Kazmi", subject: "Mathematics", position: "Director Academy", initials: "AA" },
  { name: "Syed Ali Abbas Kazmi", subject: "Mathematics", position: "Director Academy", initials: "AB" },
  { name: "Syed Sajid Kazmi", subject: "Biology", position: "V.P ICB G-6/3", initials: "SK" },
  { name: "Ch. Muhammad Zareef", subject: "Coordinator", position: "IMCB G-10/4", initials: "MZ" },
  { name: "Nabeel Kanwar", subject: "Physics", position: "Lecturer IMCB H-9", initials: "NK" },
  { name: "Zahid Abbas Hiraj", subject: "Admin Accounts", position: "Bahria College", initials: "ZH" },
  { name: "Syed Assad Abbas", subject: "Chemistry", position: "Lecturer IMCB G-11/1", initials: "AA" },
  { name: "Mr. Sajid", subject: "Chemistry", position: "Lecturer IMCB H-9", initials: "MS" },
  { name: "Amir Abbasi", subject: "English", position: "Lecturer APS RWP", initials: "AA" },
  { name: "Abbas Malik", subject: "Computer", position: "Lecturer Al-Kausar", initials: "AM" },
  { name: "Zaheer Malik", subject: "Accounting", position: "Account Officer PAF", initials: "ZM" },
];

export const academy = {
  name: "Al-Mustafa Academy",
  tagline: "Evening Coaching",
  since: 1998,
  phone: "0335 0555696",
  phoneIntl: "+923350555696",
  email: "almustafaschool@gmail.com",
  addressPrimary: "House# 1461 Sachal Sarmast Road, G-11/2, Islamabad",
  addressSecondary: "House# 1300, Street 58, G-11/2, Islamabad",
  city: "Islamabad, Pakistan 44000",
  facebook: "https://www.facebook.com/Almustafa614",
  mapsEmbed: "https://maps.google.com/maps?q=Al-Mustafa%20Academy%20G-11%2F2%20Islamabad&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapsLink: "https://www.google.com/maps/search/?api=1&query=Al-Mustafa+Academy+G-11%2F2+Islamabad",
};

export const programs = [
  {
    title: "Juniors (Class 1 – 8)",
    description: "Strong foundation in core subjects with personalised attention. We focus on conceptual clarity, study habits and confidence-building from an early age.",
    subjects: ["English", "Mathematics", "Science", "Urdu", "Islamiat", "Computer"],
    icon: "📚",
  },
  {
    title: "Matric (9th & 10th)",
    description: "FBISE-aligned coaching for Matric students. Concept-based teaching, weekly tests, past-paper practice and exam strategy from senior subject specialists.",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Computer"],
    icon: "🔬",
  },
  {
    title: "F.Sc (1st & 2nd Year)",
    description: "Pre-Medical and Pre-Engineering coaching by college-level lecturers. Designed to maximise board marks and prepare students for MDCAT / ECAT entry tests.",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English"],
    icon: "🎓",
  },
];