import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Video, Plus, Pencil, Trash2, ExternalLink, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  useLiveClasses,
  useCreateLiveClass,
  useUpdateLiveClass,
  useDeleteLiveClass,
} from "@/hooks/use-live-classes";
import { useAuth } from "@/hooks/use-auth";
import { useTeacherProfile } from "@/hooks/use-portal";
import { GRADES, SUBJECTS } from "@/lib/academy";
import { cn } from "@/lib/utils";
import type { LiveClass } from "@/types/database";

export const Route = createFileRoute("/teacher/live-classes")({
  component: TeacherLiveClasses,
});

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

function TeacherLiveClasses() {
  const { user } = useAuth();
  const { data: teacherProfile } = useTeacherProfile(user?.id);
  const { data: liveClasses = [], isLoading } = useLiveClasses();
  const createLiveClass = useCreateLiveClass();
  const updateLiveClass = useUpdateLiveClass();
  const deleteLiveClass = useDeleteLiveClass();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    class_id: "",
    start_time: "",
    end_time: "",
    meeting_url: "",
    status: "scheduled" as LiveClass["status"],
  });

  function handleAdd() {
    setEditingClass(null);
    setFormData({
      title: "",
      subject_id: "",
      class_id: "",
      start_time: "",
      end_time: "",
      meeting_url: "",
      status: "scheduled",
    });
    setDialogOpen(true);
  }

  function handleEdit(lc: LiveClass) {
    setEditingClass(lc);
    setFormData({
      title: lc.title,
      subject_id: lc.subject_id || "",
      class_id: lc.class_id,
      start_time: lc.start_time.slice(0, 16),
      end_time: lc.end_time.slice(0, 16),
      meeting_url: lc.meeting_url,
      status: lc.status,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.title || !formData.class_id || !formData.meeting_url) return;

    const callbacks = {
      onSuccess: () => {
        setDialogOpen(false);
        toast.success(editingClass ? "Live class updated" : "Live class scheduled");
      },
      onError: (err: Error) => toast.error(`Failed to save: ${err.message}`),
    };

    const data = {
      ...formData,
      teacher_id: teacherProfile?.id || "",
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString(),
      subject_id: formData.subject_id || undefined,
    };

    if (editingClass) {
      updateLiveClass.mutate({ id: editingClass.id, ...data }, callbacks);
    } else {
      createLiveClass.mutate(data, callbacks);
    }
  }

  function handleDelete(id: string) {
    if (confirm("Delete this live class?")) {
      deleteLiveClass.mutate(id, {
        onSuccess: () => toast.success("Live class deleted"),
        onError: (err) => toast.error(`Failed: ${err.message}`),
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-sm text-gray-500">
            Schedule and manage your live classes with Google Meet.
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Class
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : liveClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <Video className="h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No live classes scheduled.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Schedule a class
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {liveClasses.map((lc) => {
            const subject = SUBJECTS.find((s) => s.id === lc.subject_id);
            const config = statusConfig[lc.status] || statusConfig.scheduled;

            return (
              <Card key={lc.id}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{lc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {lc.class_id} {subject ? `• ${subject.name}` : ""}
                        </p>
                      </div>
                      <Badge className={cn("border-0", config.color)}>{config.label}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(lc.start_time).toLocaleString("en-PK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(lc.end_time).toLocaleTimeString("en-PK", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={lc.meeting_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3" /> Join Meeting
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(lc)}>
                        <Pencil className="mr-1 h-3 w-3" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(lc.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit Live Class" : "Schedule Live Class"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Mathematics - Grade 9"
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
                    <SelectValue placeholder="Select" />
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
                    <SelectValue placeholder="Select" />
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
                <Label>Start Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Google Meet URL *</Label>
              <Input
                value={formData.meeting_url}
                onChange={(e) => setFormData((p) => ({ ...p, meeting_url: e.target.value }))}
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.title ||
                !formData.class_id ||
                !formData.meeting_url ||
                createLiveClass.isPending ||
                updateLiveClass.isPending
              }
            >
              {createLiveClass.isPending || updateLiveClass.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : editingClass ? (
                "Save"
              ) : (
                "Schedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
