import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    photo_url: undefined,
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
    photo_url: undefined,
    documents: [],
    status: "reviewing",
    reviewer_notes: undefined,
    reviewed_by: undefined,
    reviewed_at: undefined,
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
    parent_cnic: undefined,
    photo_url: undefined,
    documents: [],
    status: "pending",
    reviewer_notes: undefined,
    reviewed_by: undefined,
    reviewed_at: undefined,
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
    photo_url: undefined,
    documents: [],
    status: "rejected",
    reviewer_notes: "Seats full for FSc Pre-Engineering 2nd year.",
    reviewed_by: "admin",
    reviewed_at: "2026-01-25T16:00:00Z",
    created_at: "2026-01-20T09:30:00Z",
    updated_at: "2026-01-25T16:00:00Z",
  },
];

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(MOCK_APPLICATIONS.length + 1).padStart(4, "0");
  return `AMA-${year}-${seq}`;
}

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return MOCK_APPLICATIONS;
    },
  });
}

export function useApplication(id: string) {
  return useQuery<Application | null>({
    queryKey: ["application", id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_APPLICATIONS.find((a) => a.id === id || a.application_number === id) ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Application, "id" | "application_number" | "status" | "documents" | "reviewer_notes" | "reviewed_by" | "reviewed_at" | "created_at" | "updated_at">) => {
      await new Promise((r) => setTimeout(r, 800));
      const now = new Date().toISOString();
      const newApp: Application = {
        ...data,
        id: String(MOCK_APPLICATIONS.length + 1),
        application_number: generateApplicationNumber(),
        status: "pending",
        photo_url: undefined,
        documents: [],
        reviewer_notes: undefined,
        reviewed_by: undefined,
        reviewed_at: undefined,
        created_at: now,
        updated_at: now,
      };
      MOCK_APPLICATIONS.push(newApp);
      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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
      await new Promise((r) => setTimeout(r, 500));
      const app = MOCK_APPLICATIONS.find((a) => a.id === id);
      if (!app) throw new Error("Application not found");
      app.status = status;
      app.reviewer_notes = reviewer_notes;
      app.reviewed_at = new Date().toISOString();
      app.updated_at = new Date().toISOString();
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
