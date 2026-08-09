import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "@/hooks/use-notes";
import { SUBJECTS, GRADES } from "@/lib/academy";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/database";

export const Route = createFileRoute("/teacher/notes")({
  component: TeacherNotes,
});

function TeacherNotes() {
  // In real implementation, filter by teacher's ID
  const { data: notes = [], isLoading } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    class_id: "",
    file_path: "",
    file_type: "",
    is_published: true,
  });

  function handleAdd() {
    setEditingNote(null);
    setFormData({ title: "", description: "", subject_id: "", class_id: "", file_path: "", file_type: "", is_published: true });
    setDialogOpen(true);
  }

  function handleEdit(note: Note) {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description || "",
      subject_id: note.subject_id,
      class_id: note.class_id,
      file_path: note.file_path || "",
      file_type: note.file_type || "",
      is_published: note.is_published,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.title || !formData.subject_id || !formData.class_id) return;

    const callbacks = {
      onSuccess: () => setDialogOpen(false),
      onError: (err: Error) => alert(`Failed to save: ${err.message}`),
    };

    // In real implementation, teacher_id would come from auth
    const noteData = { ...formData, teacher_id: "teacher-1" };

    if (editingNote) {
      updateNote.mutate({ id: editingNote.id, ...noteData }, callbacks);
    } else {
      createNote.mutate(noteData, callbacks);
    }
  }

  function handleDelete(id: string) {
    if (confirm("Delete this note?")) {
      deleteNote.mutate(id, { onError: (err) => alert(`Failed: ${err.message}`) });
    }
  }

  function handleTogglePublished(note: Note) {
    updateNote.mutate(
      { id: note.id, is_published: !note.is_published },
      { onError: (err) => alert(`Failed: ${err.message}`) }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-sm text-gray-500">Upload and manage study materials for your classes.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No notes yet.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add your first note
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const subject = SUBJECTS.find((s) => s.id === note.subject_id);

            return (
              <Card key={note.id} className={cn("transition-all", !note.is_published && "opacity-60")}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">{subject?.name || note.subject_id}</Badge>
                        <Badge variant="outline" className="text-[10px]">{note.class_id}</Badge>
                      </div>
                    </div>
                    {note.description && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{note.description}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleTogglePublished(note)}>
                        {note.is_published ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                        {note.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="Note title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={formData.subject_id} onValueChange={(v) => setFormData((p) => ({ ...p, subject_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.class_id} onValueChange={(v) => setFormData((p) => ({ ...p, class_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>File URL</Label>
              <Input value={formData.file_path} onChange={(e) => setFormData((p) => ({ ...p, file_path: e.target.value }))} placeholder="/notes/file.pdf" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch checked={formData.is_published} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_published: c }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.subject_id || !formData.class_id}>
              {createNote.isPending || updateNote.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : editingNote ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
