// WhatsApp utility functions
// Uses wa.me - no WhatsApp API required for V1

import { normalizePhone } from "./academy";

/**
 * Build a WhatsApp URL with optional pre-filled message
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhone(phone);
  let url = `https://wa.me/${normalized}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
}

/**
 * Build attendance notification message
 */
export function buildAttendanceMessage(
  studentName: string,
  status: "present" | "absent" | "late" | "excused",
  className: string,
  subject: string,
  date: string,
): string {
  const statusText = {
    present: "was present",
    absent: "was absent",
    late: "was late",
    excused: "was excused",
  }[status];

  return [
    `Assalam-o-Alaikum,`,
    ``,
    `${studentName} ${statusText} in today's ${subject} class.`,
    ``,
    `Date: ${date}`,
    `Class: ${className}`,
    `Subject: ${subject}`,
    ``,
    `Al-Mustafa Academy`,
  ].join("\n");
}

/**
 * Build exam result message
 */
export function buildResultMessage(
  studentName: string,
  examName: string,
  subject: string,
  marks: number,
  totalMarks: number,
  grade: string,
): string {
  return [
    `Assalam-o-Alaikum,`,
    ``,
    `${studentName}'s result for ${examName}:`,
    ``,
    `Subject: ${subject}`,
    `Marks: ${marks}/${totalMarks}`,
    `Grade: ${grade}`,
    ``,
    `Al-Mustafa Academy`,
  ].join("\n");
}

/**
 * Build fee reminder message
 */
export function buildFeeMessage(
  studentName: string,
  amount: number,
  month: string,
  dueDate: string,
): string {
  return [
    `Assalam-o-Alaikum,`,
    ``,
    `This is a reminder that the fee for ${studentName} (${month}) of Rs. ${amount} is due on ${dueDate}.`,
    ``,
    `Please clear the dues at your earliest convenience.`,
    ``,
    `JazakAllah`,
    `Al-Mustafa Academy`,
  ].join("\n");
}

/**
 * Build admission inquiry message
 */
export function buildAdmissionMessage(
  studentName: string,
  grade: string,
  parentName: string,
): string {
  return [
    `Assalam-o-Alaikum,`,
    ``,
    `I am interested in admission for ${studentName} in ${grade} at Al-Mustafa Academy.`,
    ``,
    `Parent/Guardian: ${parentName}`,
    ``,
    `Please share details about the admission process, fee structure, and class timings.`,
    ``,
    `JazakAllah`,
  ].join("\n");
}

/**
 * Build general guardian message
 */
export function buildGuardianMessage(guardianName: string, message: string): string {
  return [`Assalam-o-Alaikum ${guardianName},`, ``, message, ``, `Al-Mustafa Academy`].join("\n");
}

/**
 * Build live class notification message
 */
export function buildLiveClassMessage(
  className: string,
  subject: string,
  startTime: string,
  meetingUrl: string,
): string {
  return [
    `Assalam-o-Alaikum,`,
    ``,
    `Live class scheduled:`,
    ``,
    `Class: ${className}`,
    `Subject: ${subject}`,
    `Time: ${startTime}`,
    ``,
    `Join link: ${meetingUrl}`,
    ``,
    `Al-Mustafa Academy`,
  ].join("\n");
}

/**
 * Open WhatsApp with a message for a specific phone number
 */
export function sendWhatsApp(phone: string, message: string): void {
  const url = buildWhatsAppUrl(phone, message);
  window.open(url, "_blank");
}

/**
 * Open WhatsApp for student contact
 */
export function contactStudentWhatsApp(
  studentPhone: string,
  studentName: string,
  message: string,
): void {
  sendWhatsApp(studentPhone, message);
}

/**
 * Open WhatsApp for guardian contact
 */
export function contactGuardianWhatsApp(
  guardianPhone: string,
  guardianName: string,
  message: string,
): void {
  sendWhatsApp(guardianPhone, message);
}
