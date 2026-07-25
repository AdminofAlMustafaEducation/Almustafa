import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Attendance, Batch, Student } from "@/types/database";

// Mock data for development
const mockBatches: Batch[] = [
  {
    id: "b1",
    name: "Class 9 - Morning",
    class_level: 9,
    program: "matric",
    campus: "main",
    teacher_id: "t1",
    schedule: "Mon-Fri 8:00-11:00",
    capacity: 40,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "b2",
    name: "Class 9 - Evening",
    class_level: 9,
    program: "matric",
    campus: "main",
    teacher_id: "t2",
    schedule: "Mon-Fri 4:00-7:00",
    capacity: 35,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "b3",
    name: "Class 10 - Morning",
    class_level: 10,
    program: "matric",
    campus: "main",
    teacher_id: "t3",
    schedule: "Mon-Fri 8:00-11:00",
    capacity: 40,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "b4",
    name: "Class 10 - Evening",
    class_level: 10,
    program: "fsc_pre_medical",
    campus: "second",
    teacher_id: "t4",
    schedule: "Mon-Fri 4:00-7:00",
    capacity: 30,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "b5",
    name: "Class 11 - FSc Pre-Engineering",
    class_level: 11,
    program: "fsc_pre_engineering",
    campus: "main",
    teacher_id: "t5",
    schedule: "Mon-Fri 2:00-5:00",
    capacity: 35,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "b6",
    name: "Class 12 - FSc Pre-Medical",
    class_level: 12,
    program: "fsc_pre_medical",
    campus: "main",
    teacher_id: "t6",
    schedule: "Mon-Fri 2:00-5:00",
    capacity: 30,
    session: "2024-2025",
    is_active: true,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
];

const mockStudents: Pick<Student, "id" | "name" | "roll_number" | "class_level">[] = [
  { id: "s1", name: "Ahmed Khan", roll_number: "2024-001", class_level: 9 },
  { id: "s2", name: "Bilal Hussain", roll_number: "2024-003", class_level: 9 },
  { id: "s3", name: "Hamza Shah", roll_number: "2024-004", class_level: 9 },
  { id: "s4", name: "Usman Ahmed", roll_number: "2023-015", class_level: 9 },
  { id: "s5", name: "Zainab Bibi", roll_number: "2022-020", class_level: 9 },
  { id: "s6", name: "Fatima Ali", roll_number: "2024-002", class_level: 10 },
  { id: "s7", name: "Sara Iqbal", roll_number: "2023-012", class_level: 10 },
  { id: "s8", name: "Ayesha Malik", roll_number: "2023-008", class_level: 10 },
];

const today = new Date().toISOString().split("T")[0];

const mockAttendance: Attendance[] = [
  { id: "a1", student_id: "s1", batch_id: "b1", date: today, status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a2", student_id: "s2", batch_id: "b1", date: today, status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a3", student_id: "s3", batch_id: "b1", date: today, status: "absent", created_at: "2024-04-01T00:00:00Z" },
  { id: "a4", student_id: "s4", batch_id: "b1", date: today, status: "late", notes: "Arrived 20 minutes late", created_at: "2024-04-01T00:00:00Z" },
  { id: "a5", student_id: "s5", batch_id: "b1", date: today, status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a6", student_id: "s6", batch_id: "b3", date: today, status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a7", student_id: "s7", batch_id: "b3", date: today, status: "absent", created_at: "2024-04-01T00:00:00Z" },
  { id: "a8", student_id: "s8", batch_id: "b3", date: today, status: "present", created_at: "2024-04-01T00:00:00Z" },
  // Yesterday's data for history
  { id: "a9", student_id: "s1", batch_id: "b1", date: "2025-01-19", status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a10", student_id: "s2", batch_id: "b1", date: "2025-01-19", status: "absent", created_at: "2024-04-01T00:00:00Z" },
  { id: "a11", student_id: "s3", batch_id: "b1", date: "2025-01-19", status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a12", student_id: "s4", batch_id: "b1", date: "2025-01-19", status: "present", created_at: "2024-04-01T00:00:00Z" },
  { id: "a13", student_id: "s5", batch_id: "b1", date: "2025-01-19", status: "late", created_at: "2024-04-01T00:00:00Z" },
];

const USE_MOCK = !supabase;

// ---- Batches ----

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: async (): Promise<Batch[]> => {
      if (USE_MOCK) {
        return [...mockBatches];
      }

      const { data, error } = await supabase!
        .from("batches")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw new Error(error.message);
      return (data ?? []) as Batch[];
    },
  });
}

// ---- Attendance by batch + date ----

export interface AttendanceRecord {
  attendance_id: string | null;
  student_id: string;
  student_name: string;
  roll_number: string;
  status: "present" | "absent" | "late" | null;
  notes?: string;
}

export function useAttendance(batchId: string, date: string) {
  return useQuery({
    queryKey: ["attendance", batchId, date],
    queryFn: async (): Promise<AttendanceRecord[]> => {
      if (USE_MOCK) {
        // Students in this batch (by class_level matching)
        const batch = mockBatches.find((b) => b.id === batchId);
        if (!batch) return [];

        const batchStudents = mockStudents.filter(
          (s) => s.class_level === batch.class_level,
        );

        return batchStudents.map((s) => {
          const att = mockAttendance.find(
            (a) => a.student_id === s.id && a.batch_id === batchId && a.date === date,
          );
          return {
            attendance_id: att?.id ?? null,
            student_id: s.id,
            student_name: s.name,
            roll_number: s.roll_number ?? "",
            status: att?.status ?? null,
            notes: att?.notes,
          };
        });
      }

      const { data, error } = await supabase!
        .from("attendance")
        .select("id, student_id, status, notes, students(name, roll_number)")
        .eq("batch_id", batchId)
        .eq("date", date);

      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as AttendanceRecord[];
    },
    enabled: !!batchId && !!date,
  });
}

// ---- Mark attendance (bulk) ----

export interface MarkAttendanceInput {
  batch_id: string;
  date: string;
  records: { student_id: string; status: "present" | "absent" | "late"; notes?: string }[];
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MarkAttendanceInput): Promise<void> => {
      if (USE_MOCK) {
        // Upsert into mock data
        for (const rec of input.records) {
          const existingIndex = mockAttendance.findIndex(
            (a) =>
              a.student_id === rec.student_id &&
              a.batch_id === input.batch_id &&
              a.date === input.date,
          );
          if (existingIndex !== -1) {
            mockAttendance[existingIndex] = {
              ...mockAttendance[existingIndex],
              status: rec.status,
              notes: rec.notes,
            };
          } else {
            mockAttendance.push({
              id: `a${mockAttendance.length + 1}`,
              student_id: rec.student_id,
              batch_id: input.batch_id,
              date: input.date,
              status: rec.status,
              notes: rec.notes,
              created_at: new Date().toISOString(),
            });
          }
        }
        return;
      }

      const rows = input.records.map((r) => ({
        student_id: r.student_id,
        batch_id: input.batch_id,
        date: input.date,
        status: r.status,
        notes: r.notes,
      }));

      const { error } = await supabase!
        .from("attendance")
        .upsert(rows, { onConflict: "student_id,batch_id,date" });

      if (error) throw new Error(error.message);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["attendance", variables.batch_id, variables.date],
      });
      void queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["student-attendance"] });
    },
  });
}

// ---- Student attendance history ----

export function useStudentAttendance(studentId: string) {
  return useQuery({
    queryKey: ["student-attendance", studentId],
    queryFn: async (): Promise<Attendance[]> => {
      if (USE_MOCK) {
        return mockAttendance.filter((a) => a.student_id === studentId);
      }

      const { data, error } = await supabase!
        .from("attendance")
        .select("*")
        .eq("student_id", studentId)
        .order("date", { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as Attendance[];
    },
    enabled: !!studentId,
  });
}

// ---- Attendance stats per batch ----

export interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export function useAttendanceStats(batchId: string, date: string) {
  return useQuery({
    queryKey: ["attendance-stats", batchId, date],
    queryFn: async (): Promise<AttendanceStats> => {
      if (USE_MOCK) {
        const batch = mockBatches.find((b) => b.id === batchId);
        if (!batch)
          return { totalStudents: 0, present: 0, absent: 0, late: 0, percentage: 0 };

        const batchStudents = mockStudents.filter(
          (s) => s.class_level === batch.class_level,
        );

        const records = mockAttendance.filter(
          (a) => a.batch_id === batchId && a.date === date,
        );

        const present = records.filter((r) => r.status === "present").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const late = records.filter((r) => r.status === "late").length;
        const totalStudents = batchStudents.length;
        const marked = present + absent + late;
        const percentage = marked > 0 ? Math.round(((present + late) / marked) * 100) : 0;

        return { totalStudents, present, absent, late, percentage };
      }

      const { data, error } = await supabase!
        .from("attendance")
        .select("status")
        .eq("batch_id", batchId)
        .eq("date", date);

      if (error) throw new Error(error.message);

      const records = data ?? [];
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const late = records.filter((r) => r.status === "late").length;
      const totalStudents = records.length;
      const percentage =
        totalStudents > 0 ? Math.round(((present + late) / totalStudents) * 100) : 0;

      return { totalStudents, present, absent, late, percentage };
    },
    enabled: !!batchId && !!date,
  });
}
