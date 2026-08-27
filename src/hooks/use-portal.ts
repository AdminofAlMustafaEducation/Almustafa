import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Types matching what the UI pages expect
function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export interface TeacherBatch {
  id: string;
  name: string;
  schedule: string;
  program: string;
  grade: string;
  section?: string;
  student_count: number;
}

export interface TeacherTest {
  id: string;
  name: string;
  subject: string;
  subject_id?: string;
  class_id: string;
  batch_id: string; // alias for class_id for UI compatibility
  class_name: string;
  total_marks: number;
  test_date: string;
  test_name: string; // alias for name
  status: string;
}

export interface TeacherStudent {
  id: string;
  full_name: string;
  name: string; // alias for full_name
  roll_number?: string;
  grade?: string;
  class_level?: number;
  program?: string;
  campus?: string;
  status: string;
  admission_date: string;
  created_at: string;
  updated_at: string;
}

export type TeacherTestInput = {
  name: string;
  subject_id?: string;
  class_id?: string;
  batch_id?: string;
  total_marks: number;
  test_date: string;
};

export type TeacherTestUpdate = Partial<TeacherTestInput>;

export interface TeacherTestResult {
  id: string;
  exam_id: string;
  test_id: string; // alias for exam_id
  student_id: string;
  student_name: string;
  marks_obtained: number;
  grade?: string;
  remarks?: string;
  created_at: string;
}

// Get teacher's profile (teacher record) by auth_user_id
export function useTeacherProfile(userId?: string) {
  return useQuery({
    queryKey: ["teacher-profile", userId],
    queryFn: async () => {
      if (!supabase || !userId) return null;

      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("auth_user_id", userId)
        .single();

      if (error) {
        console.error("Failed to load teacher profile:", error);
        return null;
      }

      return data;
    },
    enabled: !!userId,
  });
}

// Get teacher's assigned batches/classes
export function useTeacherBatches(userId: string) {
  const { data: teacherProfile } = useTeacherProfile(userId);

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ["teacher-batches", teacherProfile?.id],
    queryFn: async (): Promise<TeacherBatch[]> => {
      if (!supabase || !teacherProfile?.id) return [];

      const { data, error } = await supabase
        .from("teacher_subjects")
        .select(
          `
          id,
          class_id,
          subject_id,
          classes (id, name, grade, section),
          subjects (id, name, code)
        `,
        )
        .eq("teacher_id", teacherProfile.id);

      if (error) {
        console.error("Failed to load teacher batches:", error);
        return [];
      }

      // Deduplicate classes
      const classMap = new Map<string, TeacherBatch>();
      for (const row of data || []) {
        const cls = firstRelation(row.classes) as {
          id: string;
          name: string;
          grade: string;
          section?: string;
        } | null;
        if (cls && !classMap.has(cls.id)) {
          classMap.set(cls.id, {
            id: cls.id,
            name: cls.name,
            schedule: `${cls.grade} ${cls.section || ""}`.trim(),
            program: (cls.grade || "").toLowerCase().replace(/\s+/g, "_"),
            grade: cls.grade || "",
            section: cls.section,
            student_count: 0,
          });
        }
      }

      // Get student counts
      const classIds = Array.from(classMap.keys());
      if (classIds.length > 0) {
        const { data: enrollments } = await supabase
          .from("class_students")
          .select("class_id")
          .in("class_id", classIds);

        for (const enrollment of enrollments || []) {
          const batch = classMap.get(enrollment.class_id);
          if (batch) batch.student_count++;
        }
      }

      return Array.from(classMap.values());
    },
    enabled: !!teacherProfile?.id,
  });

  return { batches, isLoading };
}

// Get teacher's tests/exams
export function useTeacherTests(userId: string) {
  const { data: teacherProfile } = useTeacherProfile(userId);
  const queryClient = useQueryClient();

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["teacher-tests", teacherProfile?.id],
    queryFn: async (): Promise<TeacherTest[]> => {
      if (!supabase || !teacherProfile?.id) return [];

      const { data, error } = await supabase
        .from("exams")
        .select(
          `
          id,
          name,
          subject_id,
          class_id,
          total_marks,
          exam_date,
          status,
          subjects (name, code),
          classes (name)
        `,
        )
        .eq("teacher_id", teacherProfile.id)
        .order("exam_date", { ascending: false });

      if (error) {
        console.error("Failed to load teacher tests:", error);
        return [];
      }

      return (data || []).map((row) => {
        const subject = firstRelation(row.subjects);
        const cls = firstRelation(row.classes);
        return {
          id: row.id,
          name: row.name,
          test_name: row.name,
          subject: subject?.name || "Unknown",
          subject_id: row.subject_id,
          class_id: row.class_id,
          batch_id: row.class_id, // alias
          class_name: cls?.name || "Unknown",
          total_marks: row.total_marks,
          test_date: row.exam_date,
          status: row.status,
        };
      });
    },
    enabled: !!teacherProfile?.id,
  });

  const addTest = useCallback(
    async (test: TeacherTestInput) => {
      if (!supabase || !teacherProfile?.id) return;

      const { data, error } = await supabase
        .from("exams")
        .insert({
          name: test.name,
          subject_id: test.subject_id || null,
          class_id: test.batch_id || test.class_id,
          teacher_id: teacherProfile.id,
          total_marks: test.total_marks,
          exam_date: test.test_date,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["teacher-tests"] });
      return data;
    },
    [teacherProfile?.id, queryClient],
  );

  const updateTest = useCallback(
    async (id: string, updates: TeacherTestUpdate) => {
      if (!supabase) return;

      const { error } = await supabase
        .from("exams")
        .update({
          name: updates.name,
          total_marks: updates.total_marks,
          exam_date: updates.test_date,
        })
        .eq("id", id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["teacher-tests"] });
    },
    [queryClient],
  );

  const deleteTest = useCallback(
    async (id: string) => {
      if (!supabase) return;

      const { error } = await supabase.from("exams").delete().eq("id", id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["teacher-tests"] });
    },
    [queryClient],
  );

  return { tests, isLoading, addTest, updateTest, deleteTest };
}

// Get students in a specific class
export function useBatchStudents(classId: string) {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["batch-students", classId],
    queryFn: async (): Promise<TeacherStudent[]> => {
      if (!supabase || !classId) return [];

      const { data, error } = await supabase
        .from("class_students")
        .select(
          `
          student_id,
          students (id, full_name, roll_number, grade, status, admission_date, created_at, updated_at)
        `,
        )
        .eq("class_id", classId);

      if (error) {
        console.error("Failed to load batch students:", error);
        return [];
      }

      return (data || []).map(
        (row: {
          student_id: string;
          students?: Array<{
            id?: string;
            full_name?: string;
            roll_number?: string;
            grade?: string;
            status?: string;
            admission_date?: string;
            created_at?: string;
            updated_at?: string;
          }> | null;
        }) => {
          const s = firstRelation(row.students) || {};
          return {
            id: s.id || row.student_id,
            full_name: s.full_name || "Unknown",
            name: s.full_name || "Unknown", // alias
            roll_number: s.roll_number,
            grade: s.grade,
            status: s.status || "active",
            admission_date: s.admission_date || "",
            created_at: s.created_at || "",
            updated_at: s.updated_at || "",
          };
        },
      );
    },
    enabled: !!classId,
  });

  return { students, isLoading };
}

// Get test results for a specific exam
export function useTestResults(examId: string) {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["test-results", examId],
    queryFn: async (): Promise<TeacherTestResult[]> => {
      if (!supabase || !examId) return [];

      const { data, error } = await supabase
        .from("exam_results")
        .select(
          `
          id,
          exam_id,
          student_id,
          marks_obtained,
          grade,
          remarks,
          created_at,
          students (full_name)
        `,
        )
        .eq("exam_id", examId);

      if (error) {
        console.error("Failed to load test results:", error);
        return [];
      }

      return (data || []).map((row) => {
        const student = firstRelation(row.students);
        return {
          id: row.id,
          exam_id: row.exam_id,
          test_id: row.exam_id, // alias
          student_id: row.student_id,
          student_name: student?.full_name || "Unknown",
          marks_obtained: Number(row.marks_obtained),
          grade: row.grade,
          remarks: row.remarks,
          created_at: row.created_at,
        };
      });
    },
    enabled: !!examId,
  });

  const saveResults = useCallback(async (newResults: Partial<TeacherTestResult>[]) => {
    return newResults;
  }, []);

  return { results, isLoading, saveResults };
}

// Create a new test/exam
export function useCreateTest() {
  const [isLoading, setIsLoading] = useState(false);

  const createTest = useCallback(
    async (test: {
      name: string;
      subject_id?: string;
      class_id: string;
      teacher_id: string;
      total_marks: number;
      exam_date: string;
    }) => {
      if (!supabase) throw new Error("Supabase not configured");
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("exams")
          .insert({
            name: test.name,
            subject_id: test.subject_id,
            class_id: test.class_id,
            teacher_id: test.teacher_id,
            total_marks: test.total_marks,
            exam_date: test.exam_date,
            status: "open",
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { createTest, isLoading };
}

// Save test results
export function useSaveResults() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const saveResults = useCallback(
    async (
      results: {
        exam_id?: string;
        test_id?: string;
        student_id: string;
        marks_obtained: number;
        remarks?: string;
      }[],
    ) => {
      if (!supabase) throw new Error("Supabase not configured");
      setIsLoading(true);

      try {
        const rows = results.map((r) => ({
          exam_id: r.exam_id || r.test_id,
          student_id: r.student_id,
          marks_obtained: r.marks_obtained,
          remarks: r.remarks,
        }));

        const { data, error } = await supabase
          .from("exam_results")
          .upsert(rows, { onConflict: "exam_id,student_id" })
          .select();

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["test-results"] });
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient],
  );

  return { saveResults, isLoading };
}

// Save attendance records
export function useSaveAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const saveAttendance = useCallback(
    async (
      records: {
        student_id: string;
        class_id?: string;
        batch_id?: string;
        subject_id?: string;
        teacher_id?: string;
        attendance_date?: string;
        date?: string;
        status: string;
        notes?: string;
      }[],
    ) => {
      if (!supabase) throw new Error("Supabase not configured");
      setIsLoading(true);

      try {
        // Get teacher_id from the first record or look it up
        // For now, we need the teacher's DB id
        // The records may have batch_id instead of class_id
        const rows = records.map((r) => ({
          student_id: r.student_id,
          class_id: r.class_id || r.batch_id,
          attendance_date: r.attendance_date || r.date,
          status: r.status,
          notes: r.notes,
        }));

        const { data, error } = await supabase
          .from("attendance")
          .upsert(rows, { onConflict: "student_id,class_id,subject_id,attendance_date" })
          .select();

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient],
  );

  return { saveAttendance, isLoading };
}
