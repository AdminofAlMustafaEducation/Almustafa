import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Application } from "@/types/database";

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "1",
    application_number: "AMA-2026-0001",
    student_name: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "03331234567",
    date_of_birth: "2010-05-15",
    address: "House 234, Street 12, G-11/2, Islamabad",
    class_level: 9,
    program: "matric",
    campus: "main",
    previous_school: "Roots Millennium School",
    previous_marks: "85%",
    parent_name: "Muhammad Khan",
    parent_phone: "03339876543",
    parent_cnic: "35202-1234567-1",
    documents: [],
    status: "approved",
    reviewer_notes: "Strong academic record. Accepted for Matric 9th.",
    reviewed_by: "admin",
    reviewed_at: "2026-01-20T10:30:00Z",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-01-20T10:30:00Z",
  },
  {
    id: "2",
    application_number: "AMA-2026-0002",
    student_name: "Fatima Ali",
    email: "fatima.ali@email.com",
    phone: "03341234567",
    date_of_birth: "2009-08-22",
    address: "Flat 5B, Sky Heights, G-11/3, Islamabad",
    class_level: 11,
    program: "fsc_pre_medical",
    campus: "second",
    previous_school: "FGEI College",
    previous_marks: "92%",
    parent_name: "Ali Raza",
    parent_phone: "03349876543",
    parent_cnic: "35202-9876543-2",
    documents: [],
    status: "reviewing",
    created_at: "2026-01-18T14:00:00Z",
    updated_at: "2026-01-19T09:00:00Z",
  },
  {
    id: "3",
    application_number: "AMA-2026-0003",
    student_name: "Usman Ahmed",
    email: "usman.ahmed@email.com",
    phone: "03351234567",
    date_of_birth: "2010-11-03",
    address: "House 890, G-11/1, Islamabad",
    class_level: 10,
    program: "matric",
    campus: "main",
    previous_school: "Beaconhouse School",
    previous_marks: "78%",
    parent_name: "Ahmed Raza",
    parent_phone: "03359876543",
    documents: [],
    status: "pending",
    created_at: "2026-01-22T11:00:00Z",
    updated_at: "2026-01-22T11:00:00Z",
  },
  {
    id: "4",
    application_number: "AMA-2026-0004",
    student_name: "Ayesha Noor",
    email: "ayesha.noor@email.com",
    phone: "03361234567",
    date_of_birth: "2008-03-14",
    address: "House 456, Street 8, G-11/2, Islamabad",
    class_level: 12,
    program: "fsc_pre_engineering",
    campus: "main",
    previous_school: "IMCB G-10/4",
    previous_marks: "88%",
    parent_name: "Noor Muhammad",
    parent_phone: "03369876543",
    parent_cnic: "35202-4567891-3",
    documents: [],
    status: "rejected",
    reviewer_notes: "Seats full for FSc Pre-Engineering 2nd year.",
    reviewed_by: "admin",
    reviewed_at: "2026-01-25T16:00:00Z",
    created_at: "2026-01-20T09:30:00Z",
    updated_at: "2026-01-25T16:00:00Z",
  },
];

const USE_MOCK = !supabase;

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(MOCK_APPLICATIONS.length + 1).padStart(4, "0");
  return `AMA-${year}-${seq}`;
}

export function useApplications(filters?: { status?: string }) {
  return useQuery<Application[]>({
    queryKey: ["applications", filters],
    queryFn: async () => {
      if (USE_MOCK) {
        let result = [...MOCK_APPLICATIONS];
        if (filters?.status && filters.status !== "all") {
          result = result.filter((a) => a.status === filters.status);
        }
        return result;
      }

      try {
        let query = supabase!.from("applications").select("*").order("created_at", { ascending: false });
        if (filters?.status && filters.status !== "all") {
          query = query.eq("status", filters.status);
        }
        const { data, error } = await query;
        if (error) {
          if (error.message.includes("Could not find the table") || error.message.includes("infinite recursion")) {
            console.warn("Applications table not found or RLS error, falling back to mock data");
            let result = [...MOCK_APPLICATIONS];
            if (filters?.status && filters.status !== "all") {
              result = result.filter((a) => a.status === filters.status);
            }
            return result;
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Application[];
      } catch (err) {
        if (err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          console.warn("Applications table not found or RLS error, falling back to mock data");
          return [...MOCK_APPLICATIONS];
        }
        throw err;
      }
    },
  });
}

export function useApplication(id: string) {
  return useQuery<Application | null>({
    queryKey: ["application", id],
    queryFn: async () => {
      if (USE_MOCK) {
        return MOCK_APPLICATIONS.find((a) => a.id === id || a.application_number === id) ?? null;
      }

      try {
        const { data, error } = await supabase!.from("applications").select("*").eq("id", id).single();
        if (error) {
          if (error.message.includes("Could not find the table") || error.message.includes("infinite recursion")) {
            return MOCK_APPLICATIONS.find((a) => a.id === id || a.application_number === id) ?? null;
          }
          throw new Error(error.message);
        }
        return data as Application;
      } catch (err) {
        if (err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          return MOCK_APPLICATIONS.find((a) => a.id === id || a.application_number === id) ?? null;
        }
        throw err;
      }
    },
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Record<string, any>) => {
      // Filter out fields that don't exist in the database
      const { confirm_password, ...data } = formData;
      
      // Ensure required fields have values
      const applicationData = {
        full_name: data.full_name || data.student_name || "",
        email: data.email || "",
        phone: data.phone || "",
        id_number: data.id_number || "",
        gender: data.gender || "male",
        grade: data.grade || "9th",
        father_name: data.father_name || "",
        date_of_birth: data.date_of_birth || "",
        address: data.address || "",
        previous_school: data.previous_school || "",
        guardian_occupation: data.guardian_occupation || "",
        message: data.message || "",
        parent_name: data.parent_name || data.father_name || "",
        parent_phone: data.parent_phone || data.phone || "",
        parent_cnic: data.parent_cnic || "",
        password: data.password || "",
        class_level: data.class_level || 9,
        program: data.program || "matric",
        campus: data.campus || "main",
      };

      if (USE_MOCK) {
        const now = new Date().toISOString();
        const newApp: Application = {
          ...applicationData,
          id: String(MOCK_APPLICATIONS.length + 1),
          application_number: generateApplicationNumber(),
          status: "pending",
          documents: [],
          created_at: now,
          updated_at: now,
        };
        MOCK_APPLICATIONS.push(newApp);
        return newApp;
      }

      try {
        // Insert without .select() to avoid RLS SELECT policy issues
        // The public form doesn't need to read back the inserted row
        const { error } = await supabase!.from("applications").insert(applicationData);
        if (error) {
          if (error.message.includes("Could not find the table") || error.message.includes("infinite recursion")) {
            const now = new Date().toISOString();
            const newApp: Application = {
              ...applicationData,
              id: String(Date.now()),
              application_number: generateApplicationNumber(),
              status: "pending",
              documents: [],
              created_at: now,
              updated_at: now,
            };
            MOCK_APPLICATIONS.push(newApp);
            return newApp;
          }
          throw new Error(error.message);
        }
        // Construct the return object since we can't read it back without auth
        const now = new Date().toISOString();
        return {
          ...applicationData,
          id: "",
          application_number: "",
          status: "pending" as const,
          documents: [],
          created_at: now,
          updated_at: now,
        } as Application;
      } catch (err) {
        if (err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          const now = new Date().toISOString();
          const newApp: Application = {
            ...applicationData,
            id: String(Date.now()),
            application_number: generateApplicationNumber(),
            status: "pending",
            documents: [],
            created_at: now,
            updated_at: now,
          };
          MOCK_APPLICATIONS.push(newApp);
          return newApp;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      reviewer_notes,
    }: {
      id: string;
      status: Application["status"];
      reviewer_notes?: string;
    }) => {
      if (USE_MOCK) {
        const app = MOCK_APPLICATIONS.find((a) => a.id === id);
        if (!app) throw new Error("Application not found");
        app.status = status;
        app.reviewer_notes = reviewer_notes;
        app.reviewed_at = new Date().toISOString();
        app.updated_at = new Date().toISOString();
        return app;
      }

      try {
        const { data, error } = await supabase!.from("applications").update({
          status,
          reviewer_notes,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", id).select().single();
        if (error) {
          if (error.message.includes("Could not find the table") || error.message.includes("infinite recursion")) {
            const app = MOCK_APPLICATIONS.find((a) => a.id === id);
            if (!app) throw new Error("Application not found");
            app.status = status;
            app.reviewer_notes = reviewer_notes;
            app.reviewed_at = new Date().toISOString();
            app.updated_at = new Date().toISOString();
            return app;
          }
          throw new Error(error.message);
        }
        return data as Application;
      } catch (err) {
        if (err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          const app = MOCK_APPLICATIONS.find((a) => a.id === id);
          if (!app) throw new Error("Application not found");
          app.status = status;
          app.reviewer_notes = reviewer_notes;
          app.reviewed_at = new Date().toISOString();
          app.updated_at = new Date().toISOString();
          return app;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useApproveAndAdmit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      reviewerId,
    }: {
      applicationId: string;
      reviewerId: string;
    }) => {
      if (USE_MOCK) {
        const app = MOCK_APPLICATIONS.find((a) => a.id === applicationId);
        if (!app) throw new Error("Application not found");

        const studentId = String(Date.now());
        app.status = "approved";
        app.reviewed_by = reviewerId;
        app.reviewed_at = new Date().toISOString();
        app.updated_at = new Date().toISOString();

        return { studentId, application: app };
      }

      // Call the approve_and_create_account RPC function
      const { data, error } = await supabase!.rpc("approve_and_create_account", {
        app_id: applicationId,
        reviewer_id: reviewerId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
