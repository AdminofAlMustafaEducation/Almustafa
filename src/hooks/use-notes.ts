import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Note } from "@/types/database";

const USE_MOCK = import.meta.env.DEV && !supabase;

// Mock data
const mockNotes: Note[] = [
  {
    id: "1",
    teacher_id: "teacher-1",
    subject_id: "math",
    class_id: "class-9",
    title: "Chapter 1 - Number Systems",
    description: "Complete notes on rational and irrational numbers with examples.",
    file_path: "/notes/number-systems.pdf",
    file_type: "pdf",
    is_published: true,
    created_at: "2026-08-01T10:00:00Z",
    updated_at: "2026-08-01T10:00:00Z",
  },
  {
    id: "2",
    teacher_id: "teacher-2",
    subject_id: "physics",
    class_id: "class-10",
    title: "Motion - Revision Notes",
    description: "Key formulas and derivations for the Motion chapter.",
    file_path: "/notes/motion.pdf",
    file_type: "pdf",
    is_published: true,
    created_at: "2026-08-03T14:00:00Z",
    updated_at: "2026-08-03T14:00:00Z",
  },
  {
    id: "3",
    teacher_id: "teacher-1",
    subject_id: "math",
    class_id: "class-9",
    title: "Weekly Practice Sheet",
    description: "Practice problems for the upcoming weekly test.",
    file_path: undefined,
    file_type: undefined,
    is_published: false,
    created_at: "2026-08-05T09:00:00Z",
    updated_at: "2026-08-05T09:00:00Z",
  },
];

// Query keys
export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...noteKeys.lists(), filters] as const,
  details: () => [...noteKeys.all, "detail"] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

// Hooks
export function useNotes(filters?: { classId?: string; subjectId?: string; teacherId?: string; published?: boolean }) {
  return useQuery({
    queryKey: noteKeys.list(filters),
    queryFn: async (): Promise<Note[]> => {
      if (USE_MOCK) {
        let result = [...mockNotes];
        if (filters?.classId) result = result.filter((n) => n.class_id === filters.classId);
        if (filters?.subjectId) result = result.filter((n) => n.subject_id === filters.subjectId);
        if (filters?.teacherId) result = result.filter((n) => n.teacher_id === filters.teacherId);
        if (filters?.published !== undefined) result = result.filter((n) => n.is_published === filters.published);
        return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      try {
        let query = supabase!.from("notes").select("*").order("created_at", { ascending: false });
        if (filters?.classId) query = query.eq("class_id", filters.classId);
        if (filters?.subjectId) query = query.eq("subject_id", filters.subjectId);
        if (filters?.teacherId) query = query.eq("teacher_id", filters.teacherId);
        if (filters?.published !== undefined) query = query.eq("is_published", filters.published);

        const { data, error } = await query;
        if (error) {
          if (USE_MOCK && (error.message.includes("Could not find the table") || error.message.includes("infinite recursion"))) {
            console.warn("Notes table not found or RLS error, falling back to mock data");
            return [...mockNotes];
          }
          throw new Error(error.message);
        }
        return (data ?? []) as Note[];
      } catch (err) {
        if (USE_MOCK && err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          console.warn("Notes table not found or RLS error, falling back to mock data");
          return [...mockNotes];
        }
        throw err;
      }
    },
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: async (): Promise<Note | null> => {
      if (USE_MOCK) {
        return mockNotes.find((n) => n.id === id) ?? null;
      }

      try {
        const { data, error } = await supabase!.from("notes").select("*").eq("id", id).single();
        if (error) {
          if (USE_MOCK && (error.message.includes("Could not find the table") || error.message.includes("infinite recursion"))) {
            return mockNotes.find((n) => n.id === id) ?? null;
          }
          throw new Error(error.message);
        }
        return data as Note;
      } catch (err) {
        if (USE_MOCK && err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          return mockNotes.find((n) => n.id === id) ?? null;
        }
        throw err;
      }
    },
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note> => {
      if (USE_MOCK) {
        const newNote: Note = {
          ...note,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockNotes.push(newNote);
        return newNote;
      }

      try {
        const { data, error } = await supabase!.from("notes").insert(note).select().single();
        if (error) {
          if (USE_MOCK && (error.message.includes("Could not find the table") || error.message.includes("infinite recursion"))) {
            const newNote: Note = {
              ...note,
              id: String(Date.now()),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            mockNotes.push(newNote);
            return newNote;
          }
          throw new Error(error.message);
        }
        return data as Note;
      } catch (err) {
        if (USE_MOCK && err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          const newNote: Note = {
            ...note,
            id: String(Date.now()),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockNotes.push(newNote);
          return newNote;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Note> & { id: string }): Promise<Note> => {
      if (USE_MOCK) {
        const index = mockNotes.findIndex((n) => n.id === id);
        if (index === -1) throw new Error("Note not found");
        mockNotes[index] = { ...mockNotes[index], ...updates, updated_at: new Date().toISOString() };
        return mockNotes[index];
      }

      try {
        const { data, error } = await supabase!.from("notes")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select()
          .single();
        if (error) {
          if (USE_MOCK && (error.message.includes("Could not find the table") || error.message.includes("infinite recursion"))) {
            const index = mockNotes.findIndex((n) => n.id === id);
            if (index === -1) throw new Error("Note not found");
            mockNotes[index] = { ...mockNotes[index], ...updates, updated_at: new Date().toISOString() };
            return mockNotes[index];
          }
          throw new Error(error.message);
        }
        return data as Note;
      } catch (err) {
        if (USE_MOCK && err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          const index = mockNotes.findIndex((n) => n.id === id);
          if (index === -1) throw new Error("Note not found");
          mockNotes[index] = { ...mockNotes[index], ...updates, updated_at: new Date().toISOString() };
          return mockNotes[index];
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      if (USE_MOCK) {
        const index = mockNotes.findIndex((n) => n.id === id);
        if (index !== -1) mockNotes.splice(index, 1);
        return;
      }

      try {
        const { error } = await supabase!.from("notes").delete().eq("id", id);
        if (error) {
          if (USE_MOCK && (error.message.includes("Could not find the table") || error.message.includes("infinite recursion"))) {
            const index = mockNotes.findIndex((n) => n.id === id);
            if (index !== -1) mockNotes.splice(index, 1);
            return;
          }
          throw new Error(error.message);
        }
      } catch (err) {
        if (USE_MOCK && err instanceof Error && (err.message.includes("Could not find the table") || err.message.includes("infinite recursion"))) {
          const index = mockNotes.findIndex((n) => n.id === id);
          if (index !== -1) mockNotes.splice(index, 1);
          return;
        }
        throw err;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: noteKeys.all });
    },
  });
}

// Upload note file to Supabase Storage
export async function uploadNoteFile(file: File, noteId: string): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `notes/${noteId}.${fileExt}`;

  const { error } = await supabase.storage
    .from("notes")
    .upload(filePath, file, { upsert: true });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return filePath;
}

// Get public URL for a note file
export function getNoteFileUrl(filePath: string): string {
  if (!supabase) return "";

  const { data } = supabase.storage.from("notes").getPublicUrl(filePath);
  return data.publicUrl;
}
