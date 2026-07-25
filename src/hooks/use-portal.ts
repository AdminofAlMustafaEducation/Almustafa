import { useState, useCallback } from "react";
import type { Batch, Test, TestResult, Student, Attendance } from "@/types/database";

// Mock data for teacher's batches
const mockBatches: Batch[] = [
  {
    id: "batch-1",
    name: "Class 9 - Morning",
    class_level: 9,
    program: "matric",
    campus: "main",
    teacher_id: "teacher-1",
    schedule: "Mon-Fri 8:00-11:00",
    capacity: 30,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "batch-2",
    name: "Class 10 - Morning",
    class_level: 10,
    program: "matric",
    campus: "main",
    teacher_id: "teacher-1",
    schedule: "Mon-Fri 8:00-11:00",
    capacity: 25,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
  {
    id: "batch-3",
    name: "Class 11 - FSc Pre-Medical",
    class_level: 11,
    program: "fsc_pre_medical",
    campus: "main",
    teacher_id: "teacher-1",
    schedule: "Mon-Fri 12:00-3:00",
    capacity: 20,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
  },
];

// Mock students for batches
const mockStudents: Record<string, Student[]> = {
  "batch-1": [
    { id: "s1", name: "Ahmed Ali", roll_number: "2024-001", class_level: 9, program: "matric", campus: "main", parent_name: "Ali Hassan", parent_phone: "0300-1234567", admission_date: "2024-01-10", status: "active", created_at: "2024-01-10", updated_at: "2024-01-10" },
    { id: "s2", name: "Fatima Khan", roll_number: "2024-002", class_level: 9, program: "matric", campus: "main", parent_name: "Khan Muhammad", parent_phone: "0301-2345678", admission_date: "2024-01-10", status: "active", created_at: "2024-01-10", updated_at: "2024-01-10" },
    { id: "s3", name: "Usman Ahmed", roll_number: "2024-003", class_level: 9, program: "matric", campus: "main", parent_name: "Ahmed Raza", parent_phone: "0302-3456789", admission_date: "2024-01-11", status: "active", created_at: "2024-01-11", updated_at: "2024-01-11" },
    { id: "s4", name: "Ayesha Malik", roll_number: "2024-004", class_level: 9, program: "matric", campus: "main", parent_name: "Malik Tariq", parent_phone: "0303-4567890", admission_date: "2024-01-12", status: "active", created_at: "2024-01-12", updated_at: "2024-01-12" },
    { id: "s5", name: "Bilal Hussain", roll_number: "2024-005", class_level: 9, program: "matric", campus: "main", parent_name: "Hussain Ali", parent_phone: "0304-5678901", admission_date: "2024-01-12", status: "active", created_at: "2024-01-12", updated_at: "2024-01-12" },
  ],
  "batch-2": [
    { id: "s6", name: "Zainab Bibi", roll_number: "2024-006", class_level: 10, program: "matric", campus: "main", parent_name: "Bibi Aisha", parent_phone: "0305-6789012", admission_date: "2024-01-10", status: "active", created_at: "2024-01-10", updated_at: "2024-01-10" },
    { id: "s7", name: "Hamza Shah", roll_number: "2024-007", class_level: 10, program: "matric", campus: "main", parent_name: "Shahbaz Khan", parent_phone: "0306-7890123", admission_date: "2024-01-11", status: "active", created_at: "2024-01-11", updated_at: "2024-01-11" },
    { id: "s8", name: "Sara Iqbal", roll_number: "2024-008", class_level: 10, program: "matric", campus: "main", parent_name: "Iqbal Ahmad", parent_phone: "0307-8901234", admission_date: "2024-01-12", status: "active", created_at: "2024-01-12", updated_at: "2024-01-12" },
  ],
  "batch-3": [
    { id: "s9", name: "Omar Farooq", roll_number: "2024-009", class_level: 11, program: "fsc_pre_medical", campus: "main", parent_name: "Farooq Khan", parent_phone: "0308-9012345", admission_date: "2024-01-10", status: "active", created_at: "2024-01-10", updated_at: "2024-01-10" },
    { id: "s10", name: "Hafsa Noor", roll_number: "2024-010", class_level: 11, program: "fsc_pre_medical", campus: "main", parent_name: "Noor Muhammad", parent_phone: "0309-0123456", admission_date: "2024-01-11", status: "active", created_at: "2024-01-11", updated_at: "2024-01-11" },
  ],
};

// Mock tests
const mockTests: Test[] = [
  { id: "test-1", batch_id: "batch-1", name: "Mathematics Mid-Term", subject: "Mathematics", total_marks: 100, test_date: "2024-03-15", created_at: "2024-03-01" },
  { id: "test-2", batch_id: "batch-1", name: "English Unit Test", subject: "English", total_marks: 50, test_date: "2024-03-20", created_at: "2024-03-05" },
  { id: "test-3", batch_id: "batch-2", name: "Physics Chapter 1", subject: "Physics", total_marks: 40, test_date: "2024-03-18", created_at: "2024-03-02" },
  { id: "test-4", batch_id: "batch-3", name: "Biology Quiz", subject: "Biology", total_marks: 25, test_date: "2024-03-22", created_at: "2024-03-08" },
];

// Mock test results
const mockResults: TestResult[] = [
  { id: "r1", test_id: "test-1", student_id: "s1", marks_obtained: 85, created_at: "2024-03-16" },
  { id: "r2", test_id: "test-1", student_id: "s2", marks_obtained: 92, created_at: "2024-03-16" },
  { id: "r3", test_id: "test-1", student_id: "s3", marks_obtained: 78, created_at: "2024-03-16" },
  { id: "r4", test_id: "test-1", student_id: "s4", marks_obtained: 95, created_at: "2024-03-16" },
  { id: "r5", test_id: "test-1", student_id: "s5", marks_obtained: 88, created_at: "2024-03-16" },
];

// Mock attendance records
const mockAttendance: Record<string, Attendance[]> = {};

export function useTeacherBatches(teacherId: string) {
  const [batches] = useState<Batch[]>(mockBatches);
  const [isLoading] = useState(false);

  return { batches, isLoading };
}

export function useTeacherTests(teacherId: string) {
  const [tests, setTests] = useState<Test[]>(mockTests);
  const [isLoading] = useState(false);

  const addTest = useCallback((test: Omit<Test, "id" | "created_at">) => {
    const newTest: Test = {
      ...test,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
    };
    setTests((prev) => [...prev, newTest]);
    return newTest;
  }, []);

  const updateTest = useCallback((id: string, updates: Partial<Test>) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTest = useCallback((id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tests, isLoading, addTest, updateTest, deleteTest };
}

export function useBatchStudents(batchId: string) {
  const [students] = useState<Student[]>(mockStudents[batchId] || []);
  const [isLoading] = useState(false);

  return { students, isLoading };
}

export function useTestResults(testId: string) {
  const [results, setResults] = useState<TestResult[]>(mockResults.filter((r) => r.test_id === testId));
  const [isLoading] = useState(false);

  const saveResults = useCallback((newResults: Omit<TestResult, "id" | "created_at">[]) => {
    const savedResults: TestResult[] = newResults.map((r, i) => ({
      ...r,
      id: `r-${Date.now()}-${i}`,
      created_at: new Date().toISOString().split("T")[0],
    }));
    setResults(savedResults);
    return savedResults;
  }, []);

  return { results, isLoading, saveResults };
}

export function useCreateTest() {
  const [isLoading, setIsLoading] = useState(false);

  const createTest = useCallback(async (test: Omit<Test, "id" | "created_at">) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    return {
      ...test,
      id: `test-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
    };
  }, []);

  return { createTest, isLoading };
}

export function useSaveResults() {
  const [isLoading, setIsLoading] = useState(false);

  const saveResults = useCallback(async (results: Omit<TestResult, "id" | "created_at">[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    return results.map((r, i) => ({
      ...r,
      id: `r-${Date.now()}-${i}`,
      created_at: new Date().toISOString().split("T")[0],
    }));
  }, []);

  return { saveResults, isLoading };
}

export function useSaveAttendance() {
  const [isLoading, setIsLoading] = useState(false);

  const saveAttendance = useCallback(async (records: Omit<Attendance, "id" | "created_at">[]) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    return records.map((r, i) => ({
      ...r,
      id: `att-${Date.now()}-${i}`,
      created_at: new Date().toISOString().split("T")[0],
    }));
  }, []);

  return { saveAttendance, isLoading };
}
