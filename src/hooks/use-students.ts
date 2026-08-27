import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/types/database";

// Mock data for development
const mockStudents: Student[] = [
  {
    id: "1",
    roll_number: "2024-001",
    full_name: "Ahmed Khan",
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "0300-1234567",
    date_of_birth: "2008-05-15",
    address: "123 Main Street, Lahore",
    class_level: 9,
    program: "matric",
    campus: "main",
    parent_name: "Muhammad Khan",
    parent_phone: "0300-9876543",
    parent_cnic: "35201-1234567-1",
    admission_date: "2024-04-01",
    status: "active",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "2",
    roll_number: "2024-002",
    full_name: "Fatima Ali",
    name: "Fatima Ali",
    email: "fatima.ali@example.com",
    phone: "0301-2345678",
    date_of_birth: "2007-08-22",
    address: "456 Park Avenue, Lahore",
    class_level: 10,
    program: "fsc_pre_medical",
    campus: "main",
    parent_name: "Ali Hassan",
    parent_phone: "0301-8765432",
    parent_cnic: "35201-2345678-2",
    admission_date: "2024-04-01",
    status: "active",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "3",
    roll_number: "2023-015",
    full_name: "Usman Ahmed",
    name: "Usman Ahmed",
    email: "usman.ahmed@example.com",
    phone: "0302-3456789",
    date_of_birth: "2006-03-10",
    address: "789 Garden Town, Lahore",
    class_level: 11,
    program: "fsc_pre_engineering",
    campus: "second",
    parent_name: "Ahmed Raza",
    parent_phone: "0302-7654321",
    parent_cnic: "35201-3456789-3",
    admission_date: "2023-04-01",
    status: "active",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2023-04-01T00:00:00Z",
  },
  {
    id: "4",
    roll_number: "2023-008",
    full_name: "Ayesha Malik",
    name: "Ayesha Malik",
    email: "ayesha.malik@example.com",
    phone: "0303-4567890",
    date_of_birth: "2005-11-28",
    address: "321 DHA Phase 5, Lahore",
    class_level: 12,
    program: "fsc_pre_medical",
    campus: "main",
    parent_name: "Tariq Malik",
    parent_phone: "0303-6543210",
    parent_cnic: "35201-4567890-4",
    admission_date: "2023-04-01",
    status: "graduated",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2024-06-30T00:00:00Z",
  },
  {
    id: "5",
    roll_number: "2024-003",
    full_name: "Bilal Hussain",
    name: "Bilal Hussain",
    email: "bilal.hussain@example.com",
    phone: "0304-5678901",
    date_of_birth: "2008-01-05",
    address: "654 Model Town, Lahore",
    class_level: 9,
    program: "matric",
    campus: "second",
    parent_name: "Hussain Ali",
    parent_phone: "0304-5432109",
    parent_cnic: "35201-5678901-5",
    admission_date: "2024-04-01",
    status: "active",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "6",
    roll_number: "2022-020",
    full_name: "Zainab Bibi",
    name: "Zainab Bibi",
    email: "zainab.bibi@example.com",
    phone: "0305-6789012",
    date_of_birth: "2004-07-19",
    address: "987 Johar Town, Lahore",
    class_level: 12,
    program: "fsc_pre_engineering",
    campus: "main",
    parent_name: "Abdul Qadir",
    parent_phone: "0305-4321098",
    parent_cnic: "35201-6789012-6",
    admission_date: "2022-04-01",
    status: "inactive",
    created_at: "2022-04-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "7",
    roll_number: "2024-004",
    full_name: "Hamza Shah",
    name: "Hamza Shah",
    email: "hamza.shah@example.com",
    phone: "0306-7890123",
    date_of_birth: "2007-12-03",
    address: "147 Wapda Town, Lahore",
    class_level: 10,
    program: "matric",
    campus: "main",
    parent_name: "Shahbaz Ali",
    parent_phone: "0306-3210987",
    parent_cnic: "35201-7890123-7",
    admission_date: "2024-04-01",
    status: "active",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "8",
    roll_number: "2023-012",
    full_name: "Sara Iqbal",
    name: "Sara Iqbal",
    email: "sara.iqbal@example.com",
    phone: "0307-8901234",
    date_of_birth: "2006-09-14",
    address: "258 Cantt, Lahore",
    class_level: 11,
    program: "fsc_pre_medical",
    campus: "second",
    parent_name: "Iqbal Ahmed",
    parent_phone: "0307-2109876",
    parent_cnic: "35201-8901234-8",
    admission_date: "2023-04-01",
    status: "withdrawn",
    created_at: "2023-04-01T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
];

const USE_MOCK = import.meta.env.DEV && !supabase;

export function useStudents(filters?: { classLevel?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: async (): Promise<Student[]> => {
      if (USE_MOCK) {
        let result = [...mockStudents];

        if (filters?.classLevel) {
          result = result.filter((s) => s.class_level === filters.classLevel);
        }

        if (filters?.status) {
          result = result.filter((s) => s.status === filters.status);
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          result = result.filter(
            (s) =>
              s.full_name.toLowerCase().includes(searchLower) ||
              s.roll_number?.toLowerCase().includes(searchLower),
          );
        }

        return result;
      }

      try {
        let query = supabase!
          .from("students")
          .select("*")
          .order("created_at", { ascending: false });

        if (filters?.classLevel) {
          query = query.eq("class_level", filters.classLevel);
        }

        if (filters?.status) {
          query = query.eq("status", filters.status);
        }

        if (filters?.search) {
          query = query.or(
            `full_name.ilike.%${filters.search}%,roll_number.ilike.%${filters.search}%`,
          );
        }

        const { data, error } = await query;

        if (error) {
          if (
            USE_MOCK &&
            (error.message.includes("Could not find the table") ||
              error.message.includes("infinite recursion"))
          ) {
            console.warn("Students table not found or RLS error, falling back to mock data");
            return [...mockStudents];
          }
          throw new Error(error.message);
        }

        return (data ?? []) as Student[];
      } catch (err) {
        if (
          USE_MOCK &&
          err instanceof Error &&
          (err.message.includes("Could not find the table") ||
            err.message.includes("infinite recursion"))
        ) {
          console.warn("Students table not found or RLS error, falling back to mock data");
          return [...mockStudents];
        }
        throw err;
      }
    },
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async (): Promise<Student | null> => {
      if (USE_MOCK) {
        return mockStudents.find((s) => s.id === id) ?? null;
      }

      const { data, error } = await supabase!.from("students").select("*").eq("id", id).single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Student;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      student: Omit<Student, "id" | "created_at" | "updated_at">,
    ): Promise<Student> => {
      if (!supabase && !USE_MOCK) {
        throw new Error("Supabase is not configured for this deployment");
      }

      if (USE_MOCK) {
        const newStudent: Student = {
          ...student,
          id: String(mockStudents.length + 1),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockStudents.push(newStudent);
        return newStudent;
      }

      try {
        const studentRow = Object.fromEntries(
          Object.entries({
            student_number: student.student_number,
            auth_user_id: student.auth_user_id,
            full_name: student.full_name,
            father_name: student.father_name,
            date_of_birth: student.date_of_birth,
            gender: student.gender,
            id_number: student.id_number ?? student.identity_number,
            grade: student.grade,
            class_id: student.class_id,
            monthly_fee: student.monthly_fee,
            email: student.email,
            phone: student.phone,
            address: student.address,
            roll_number: student.roll_number,
            admission_date: student.admission_date,
            status: student.status,
            class_level: student.class_level,
            program: student.program,
            campus: student.campus,
            parent_name: student.parent_name,
            parent_phone: student.parent_phone,
            parent_cnic: student.parent_cnic,
          }).filter(([, value]) => value !== undefined),
        );
        const { data, error } = await supabase!
          .from("students")
          .insert(studentRow)
          .select()
          .single();

        if (error) {
          if (
            USE_MOCK &&
            (error.message.includes("Could not find the table") ||
              error.message.includes("infinite recursion"))
          ) {
            console.warn("Students table not found or RLS error, using mock data");
            const newStudent: Student = {
              ...student,
              id: String(Date.now()),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            mockStudents.push(newStudent);
            return newStudent;
          }
          throw new Error(error.message);
        }

        return data as Student;
      } catch (err) {
        if (
          USE_MOCK &&
          err instanceof Error &&
          (err.message.includes("Could not find the table") ||
            err.message.includes("infinite recursion"))
        ) {
          console.warn("Students table not found or RLS error, using mock data");
          const newStudent: Student = {
            ...student,
            id: String(Date.now()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockStudents.push(newStudent);
          return newStudent;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }): Promise<Student> => {
      if (USE_MOCK) {
        const index = mockStudents.findIndex((s) => s.id === id);
        if (index === -1) throw new Error("Student not found");
        mockStudents[index] = {
          ...mockStudents[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return mockStudents[index];
      }

      const { data, error } = await supabase!
        .from("students")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Student;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockStudents.findIndex((s) => s.id === id);
        if (index !== -1) {
          mockStudents.splice(index, 1);
        }
        return;
      }

      const { error } = await supabase!.from("students").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
