import { useQuery } from "@tanstack/react-query";
import type { Student, Attendance, TestResult, Fee } from "@/types/database";

// Mock student profile (linked to logged-in user)
const mockStudentProfile: Student = {
  id: "1",
  user_id: "user-1",
  roll_number: "2024-001",
  name: "Ahmed Khan",
  email: "ahmed.khan@example.com",
  phone: "0300-1234567",
  date_of_birth: "2008-05-15",
  address: "123 Main Street, Islamabad",
  class_level: 10,
  program: "matric",
  campus: "main",
  parent_name: "Muhammad Khan",
  parent_phone: "0300-9876543",
  parent_cnic: "35201-1234567-1",
  admission_date: "2024-04-01",
  status: "active",
  created_at: "2024-04-01T00:00:00Z",
  updated_at: "2024-04-01T00:00:00Z",
};

// Generate mock attendance for a given month
function generateMockAttendance(year: number, month: number): Attendance[] {
  const records: Attendance[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const statuses: Attendance["status"][] = ["present", "absent", "late"];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    // Skip Fridays (holiday) and Sundays
    if (dayOfWeek === 5 || dayOfWeek === 0) continue;

    // Weighted random: 75% present, 15% absent, 10% late
    const rand = Math.random();
    let status: Attendance["status"];
    if (rand < 0.75) status = "present";
    else if (rand < 0.9) status = "absent";
    else status = "late";

    records.push({
      id: `att-${month}-${day}`,
      student_id: "1",
      batch_id: "batch-1",
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      status,
      created_at: date.toISOString(),
    });
  }

  return records;
}

// Mock test results
const mockTestResults: (TestResult & { test_name: string; subject: string; total_marks: number; test_date: string })[] = [
  {
    id: "tr-1",
    test_id: "t-1",
    student_id: "1",
    marks_obtained: 85,
    total_marks: 100,
    test_name: "Monthly Test - January",
    subject: "Mathematics",
    test_date: "2025-01-15",
    remarks: "Good performance",
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "tr-2",
    test_id: "t-2",
    student_id: "1",
    marks_obtained: 72,
    total_marks: 100,
    test_name: "Monthly Test - January",
    subject: "Physics",
    test_date: "2025-01-16",
    created_at: "2025-01-16T00:00:00Z",
  },
  {
    id: "tr-3",
    test_id: "t-3",
    student_id: "1",
    marks_obtained: 90,
    total_marks: 100,
    test_name: "Monthly Test - January",
    subject: "Chemistry",
    test_date: "2025-01-17",
    remarks: "Excellent",
    created_at: "2025-01-17T00:00:00Z",
  },
  {
    id: "tr-4",
    test_id: "t-4",
    student_id: "1",
    marks_obtained: 68,
    total_marks: 100,
    test_name: "Monthly Test - January",
    subject: "English",
    test_date: "2025-01-18",
    created_at: "2025-01-18T00:00:00Z",
  },
  {
    id: "tr-5",
    test_id: "t-5",
    student_id: "1",
    marks_obtained: 78,
    total_marks: 100,
    test_name: "Monthly Test - February",
    subject: "Mathematics",
    test_date: "2025-02-15",
    created_at: "2025-02-15T00:00:00Z",
  },
  {
    id: "tr-6",
    test_id: "t-6",
    student_id: "1",
    marks_obtained: 82,
    total_marks: 100,
    test_name: "Monthly Test - February",
    subject: "Physics",
    test_date: "2025-02-16",
    remarks: "Improved",
    created_at: "2025-02-16T00:00:00Z",
  },
  {
    id: "tr-7",
    test_id: "t-7",
    student_id: "1",
    marks_obtained: 95,
    total_marks: 100,
    test_name: "Monthly Test - February",
    subject: "Chemistry",
    test_date: "2025-02-17",
    remarks: "Outstanding",
    created_at: "2025-02-17T00:00:00Z",
  },
  {
    id: "tr-8",
    test_id: "t-8",
    student_id: "1",
    marks_obtained: 74,
    total_marks: 100,
    test_name: "Monthly Test - February",
    subject: "English",
    test_date: "2025-02-18",
    created_at: "2025-02-18T00:00:00Z",
  },
  {
    id: "tr-9",
    test_id: "t-9",
    student_id: "1",
    marks_obtained: 88,
    total_marks: 100,
    test_name: "Mid-Term Exam",
    subject: "Mathematics",
    test_date: "2025-03-10",
    remarks: "Very good",
    created_at: "2025-03-10T00:00:00Z",
  },
  {
    id: "tr-10",
    test_id: "t-10",
    student_id: "1",
    marks_obtained: 79,
    total_marks: 100,
    test_name: "Mid-Term Exam",
    subject: "Physics",
    test_date: "2025-03-11",
    created_at: "2025-03-11T00:00:00Z",
  },
  {
    id: "tr-11",
    test_id: "t-11",
    student_id: "1",
    marks_obtained: 92,
    total_marks: 100,
    test_name: "Mid-Term Exam",
    subject: "Chemistry",
    test_date: "2025-03-12",
    remarks: "Excellent work",
    created_at: "2025-03-12T00:00:00Z",
  },
  {
    id: "tr-12",
    test_id: "t-12",
    student_id: "1",
    marks_obtained: 71,
    total_marks: 100,
    test_name: "Mid-Term Exam",
    subject: "English",
    test_date: "2025-03-13",
    created_at: "2025-03-13T00:00:00Z",
  },
];

// Mock fee records
const mockFees: Fee[] = [
  {
    id: "fee-1",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    paid_date: "2025-01-08",
    status: "paid",
    payment_method: "cash",
    receipt_number: "RCP-2025-001",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "fee-2",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "February 2025",
    due_date: "2025-02-10",
    paid_date: "2025-02-12",
    status: "paid",
    payment_method: "bank_transfer",
    receipt_number: "RCP-2025-014",
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z",
  },
  {
    id: "fee-3",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "March 2025",
    due_date: "2025-03-10",
    paid_date: "2025-03-09",
    status: "paid",
    payment_method: "cash",
    receipt_number: "RCP-2025-028",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-09T00:00:00Z",
  },
  {
    id: "fee-4",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "April 2025",
    due_date: "2025-04-10",
    paid_date: "2025-04-07",
    status: "paid",
    payment_method: "cash",
    receipt_number: "RCP-2025-041",
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-07T00:00:00Z",
  },
  {
    id: "fee-5",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "May 2025",
    due_date: "2025-05-10",
    status: "pending",
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "fee-6",
    student_id: "1",
    amount: 5000,
    fee_type: "monthly",
    month: "June 2025",
    due_date: "2025-06-10",
    status: "pending",
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z",
  },
  {
    id: "fee-7",
    student_id: "1",
    amount: 2000,
    fee_type: "exam",
    month: "March 2025",
    due_date: "2025-03-05",
    paid_date: "2025-03-04",
    status: "paid",
    payment_method: "cash",
    receipt_number: "RCP-2025-025",
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-04T00:00:00Z",
  },
  {
    id: "fee-8",
    student_id: "1",
    amount: 3000,
    fee_type: "exam",
    month: "June 2025",
    due_date: "2025-06-01",
    status: "overdue",
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z",
  },
];

export function useStudentProfile(userId?: string) {
  return useQuery({
    queryKey: ["student-profile", userId],
    queryFn: async (): Promise<Student> => {
      // Mock: always return profile
      return mockStudentProfile;
    },
    enabled: true,
  });
}

export function useStudentAttendance(studentId: string, year: number, month: number) {
  return useQuery({
    queryKey: ["student-attendance", studentId, year, month],
    queryFn: async (): Promise<Attendance[]> => {
      return generateMockAttendance(year, month);
    },
    enabled: !!studentId,
  });
}

export function useStudentResults(studentId: string) {
  return useQuery({
    queryKey: ["student-results", studentId],
    queryFn: async () => {
      return mockTestResults;
    },
    enabled: !!studentId,
  });
}

export function useStudentFees(studentId: string) {
  return useQuery({
    queryKey: ["student-fees", studentId],
    queryFn: async (): Promise<Fee[]> => {
      return mockFees;
    },
    enabled: !!studentId,
  });
}
