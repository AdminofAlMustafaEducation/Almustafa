import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff, Upload, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useFaculty } from "@/hooks/use-faculty";
import { GRADES, SUBJECTS } from "@/lib/academy";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/database";

export const Route = createFileRoute("/admin/notes")({
  component: AdminNotes,
});

function AdminNotes() {
  const { data: notes = [], isLoading } = useNotes();
  const { data: faculty = [] } = useFaculty();
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
    teacher_id: "",
    file_path: "",
    file_type: "",
    is_published: true,
  });

  function handleAdd() {
    setEditingNote(null);
    setFormData({
      title: "",
      description: "",
      subject_id: "",
      class_id: "",
      teacher_id: faculty[0]?.id || "",
      file_path: "",
      file_type: "",
      is_published: true,
    });
    setDialogOpen(true);
  }

  function handleEdit(note: Note) {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description || "",
      subject_id: note.subject_id,
      class_id: note.class_id,
      teacher_id: note.teacher_id,
      file_path: note.file_path || "",
      file_type: note.file_type || "",
      is_published: note.is_published,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.title || !formData.subject_id || !formData.class_id || !formData.teacher_id) return;

    const callbacks = {
      onSuccess: () => setDialogOpen(false),
      onError: (err: Error) =>       toast.error(`Failed to save: ${err.message}`),
    };

    if (editingNote) {
      updateNote.mutate({ id: editingNote.id, ...formData }, callbacks);
    } else {
      createNote.mutate(formData, callbacks);
    }
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote.mutate(id, {
        onError: (err) =>         toast.error(`Failed to delete: ${err.message}`),
      });
    }
  }

  function handleTogglePublished(note: Note) {
    updateNote.mutate(
      { id: note.id, is_published: !note.is_published },
      { onError: (err) => alert(`Failed to update: ${err.message}`) }
    );
  }

  const publishedCount = notes.filter((n) => n.is_published).length;
  const draftCount = notes.filter((n) => !n.is_published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes & Study Materials</h2>
          <p className="text-gray-600">Upload and manage study materials for students.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Note
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Notes</p>
              <p className="text-2xl font-bold">{notes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Eye className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <EyeOff className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <FileText className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No notes yet.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add your first note
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const teacher = faculty.find((f) => f.id === note.teacher_id);
            const subject = SUBJECTS.find((s) => s.id === note.subject_id);

            return (
              <Card key={note.id} className={cn("transition-all", !note.is_published && "opacity-60")}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{note.title}</h3>
                        {note.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{note.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {subject?.name || note.subject_id}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {note.class_id}
                        </Badge>
                        <Badge
                          className={cn(
                            "border-0 text-[10px]",
                            note.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {note.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      {teacher && <span>By {teacher.full_name || teacher.name}</span>}
                      <span>•</span>
                      <span>{new Date(note.created_at).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}</span>
                      {note.file_path && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Upload className="h-3 w-3" />
                            {note.file_type?.toUpperCase() || "File"}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleTogglePublished(note)}>
                        {note.is_published ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                        {note.is_published ? "Unpublish" : "Publish"}
                      </Button>
                      {note.file_path && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={note.file_path} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3 w-3" /> View File
                          </a>
                        </Button>
                      )}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title *</Label>
              <Input
                id="note-title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Chapter 1 - Number Systems"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-description">Description</Label>
              <Textarea
                id="note-description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the note..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  value={formData.subject_id}
                  onValueChange={(v) => setFormData((p) => ({ ...p, subject_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select
                  value={formData.class_id}
                  onValueChange={(v) => setFormData((p) => ({ ...p, class_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Teacher *</Label>
              <Select
                value={formData.teacher_id}
                onValueChange={(v) => setFormData((p) => ({ ...p, teacher_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.full_name || f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-file-path">File URL</Label>
                <Input
                  id="note-file-path"
                  value={formData.file_path}
                  onChange={(e) => setFormData((p) => ({ ...p, file_path: e.target.value }))}
                  placeholder="/notes/chapter-1.pdf"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-file-type">File Type</Label>
                <Input
                  id="note-file-type"
                  value={formData.file_type}
                  onChange={(e) => setFormData((p) => ({ ...p, file_type: e.target.value }))}
                  placeholder="pdf, doc, image"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="note-published">Published</Label>
              <Switch
                id="note-published"
                checked={formData.is_published}
                onCheckedChange={(c) => setFormData((p) => ({ ...p, is_published: c }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title || !formData.subject_id || !formData.class_id || !formData.teacher_id || createNote.isPending || updateNote.isPending}
            >
              {(createNote.isPending || updateNote.isPending) ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                editingNote ? "Save Changes" : "Add Note"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
