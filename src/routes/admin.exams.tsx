import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Plus, Save, Eye, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useExams, useCreateExam, useExamResults, useSaveExamResults, useDeleteExam } from "@/hooks/use-exams";
import { useStudents } from "@/hooks/use-students";
import { GRADES, SUBJECTS } from "@/lib/academy";
import { cn } from "@/lib/utils";
import type { Exam } from "@/types/database";

export const Route = createFileRoute("/admin/exams")({
  component: AdminExams,
});

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  open: { label: "Open", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  published: { label: "Published", color: "bg-purple-100 text-purple-800" },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-600" },
};

function AdminExams() {
  const { data: exams = [], isLoading } = useExams();
  const { data: students = [] } = useStudents();
  const createExam = useCreateExam();
  const deleteExam = useDeleteExam();

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject_id: "",
    grade: "9th",
    total_marks: 100,
    exam_date: new Date().toISOString().split("T")[0],
  });

  function handleCreate() {
    if (!formData.name || !formData.grade) return;

    // For mock mode, use grade as class_id
    // For Supabase, we'd need to look up the class UUID
    const examData = {
      name: formData.name,
      subject_id: formData.subject_id || undefined,
      class_id: formData.grade, // Will be resolved to UUID in hook
      teacher_id: "current-user", // Will be resolved to UUID in hook
      exam_date: formData.exam_date,
      total_marks: Number(formData.total_marks),
      status: "draft" as const,
    };

    createExam.mutate(examData, {
      onSuccess: () => {
        setDialogOpen(false);
        setFormData({ name: "", subject_id: "", grade: "9th", total_marks: 100, exam_date: new Date().toISOString().split("T")[0] });
      },
      onError: (err) => alert(`Failed to create exam: ${err.message}`),
    });
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this exam?")) {
      deleteExam.mutate(id, {
        onError: (err) => alert(`Failed to delete: ${err.message}`),
      });
    }
  }

  // Filter students for selected exam's grade
  const examStudents = selectedExam
    ? students.filter((s) => s.grade === selectedExam.class_id || String(s.class_level) === selectedExam.class_id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exams</h2>
          <p className="text-gray-600">Create exams, enter results, share via WhatsApp.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Exam
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Exams</p>
              <p className="text-2xl font-bold">{exams.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Exam List */}
        <div className="space-y-2 lg:col-span-1">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Exams</p>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : exams.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
              <ClipboardList className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">No exams yet.</p>
            </div>
          ) : (
            exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  selectedExam?.id === exam.id
                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{exam.name}</p>
                    <p className="text-xs text-gray-500">{exam.class_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{exam.exam_date}</p>
                    <p className="text-xs font-medium text-gray-500">/{exam.total_marks}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {selectedExam ? (
            <ExamResultsPanel
              exam={selectedExam}
              students={examStudents}
              onDelete={handleDelete}
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
              <p className="text-sm text-gray-500">Select an exam to view results.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Exam Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Exam Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Weekly Test 1, Midterm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
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
                <Label>Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(v) => setFormData((p) => ({ ...p, grade: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={formData.total_marks}
                  onChange={(e) => setFormData((p) => ({ ...p, total_marks: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.exam_date}
                  onChange={(e) => setFormData((p) => ({ ...p, exam_date: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || createExam.isPending}>
              {createExam.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExamResultsPanel({
  exam,
  students,
  onDelete,
}: {
  exam: Exam;
  students: { id: string; full_name?: string; name?: string }[];
  onDelete: (id: string) => void;
}) {
  const { data: results = [] } = useExamResults(exam.id);
  const saveResults = useSaveExamResults();
  const [marks, setMarks] = useState<Record<string, string>>({});

  function handleSave() {
    const resultsToSave = Object.entries(marks)
      .filter(([_, val]) => val !== "")
      .map(([studentId, val]) => ({
        exam_id: exam.id,
        student_id: studentId,
        marks_obtained: Number(val),
      }));

    if (resultsToSave.length === 0) return;

    saveResults.mutate(resultsToSave, {
      onSuccess: () => {
        alert("Results saved successfully!");
        setMarks({});
      },
      onError: (err) => alert(`Failed to save: ${err.message}`),
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{exam.name}</CardTitle>
            <p className="text-sm text-gray-500">
              {exam.class_id} • {exam.exam_date} • /{exam.total_marks}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saveResults.isPending}>
              <Save className="mr-1 h-3 w-3" />
              {saveResults.isPending ? "Saving..." : "Save Results"}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(exam.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No students in this grade.</p>
        ) : (
          <div className="space-y-2">
            {students.map((student) => {
              const existingResult = results.find((r) => r.student_id === student.id);
              const studentName = student.full_name || student.name || "Unknown";

              return (
                <div key={student.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{studentName}</p>
                  </div>
                  <Input
                    type="number"
                    max={exam.total_marks}
                    value={marks[student.id] ?? existingResult?.marks_obtained ?? ""}
                    onChange={(e) => setMarks((m) => ({ ...m, [student.id]: e.target.value }))}
                    className="h-9 w-24"
                    placeholder="0"
                  />
                  <span className="inline-flex w-12 justify-center rounded-md bg-gray-100 px-2 py-1 text-sm font-semibold">
                    {existingResult?.grade || "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
