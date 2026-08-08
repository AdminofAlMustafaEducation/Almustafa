import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Plus, Pencil, Trash2, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useBatches, useCreateBatch, useUpdateBatch, useDeleteBatch } from "@/hooks/use-batches";
import { cn } from "@/lib/utils";
import type { Batch } from "@/types/database";

export const Route = createFileRoute("/admin/batches")({
  component: BatchesPage,
});

const programOptions = [
  { value: "juniors", label: "Juniors (1-8)" },
  { value: "matric", label: "Matric" },
  { value: "fsc_pre_medical", label: "FSc Pre-Medical" },
  { value: "fsc_pre_engineering", label: "FSc Pre-Engineering" },
];

const campusOptions = [
  { value: "main", label: "Main Campus" },
  { value: "second", label: "Second Campus" },
];

function BatchesPage() {
  const { data: batches = [], isLoading } = useBatches();
  const createBatch = useCreateBatch();
  const updateBatch = useUpdateBatch();
  const deleteBatch = useDeleteBatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    class_level: 9,
    program: "matric",
    campus: "main",
    capacity: 30,
    session: "2026-27",
    is_active: true,
  });

  const activeBatches = batches.filter((b) => b.is_active);
  const totalCapacity = batches.reduce((sum, b) => sum + b.capacity, 0);
  const mainCampus = batches.filter((b) => b.campus === "main").length;

  function handleAdd() {
    setEditingBatch(null);
    setFormData({ name: "", class_level: 9, program: "matric", campus: "main", capacity: 30, session: "2026-27", is_active: true });
    setDialogOpen(true);
  }

  function handleEdit(batch: Batch) {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      class_level: batch.class_level,
      program: batch.program,
      campus: batch.campus,
      capacity: batch.capacity,
      session: batch.session,
      is_active: batch.is_active,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.name) return;

    if (editingBatch) {
      updateBatch.mutate({ id: editingBatch.id, ...formData });
    } else {
      createBatch.mutate(formData);
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteBatch.mutate(id);
    }
  }

  const columns: Column<Batch>[] = [
    { key: "name", label: "Batch Name", sortable: true, render: (_v, row) => <span className="font-medium">{row.name}</span> },
    { key: "class_level", label: "Class", sortable: true },
    {
      key: "program",
      label: "Program",
      render: (_v, row) => (
        <span className="capitalize">{row.program.replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "campus",
      label: "Campus",
      render: (_v, row) => <Badge variant="secondary">{row.campus === "main" ? "Main" : "Second"}</Badge>,
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (_v, row) => (
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.capacity}</span>
        </div>
      ),
    },
    { key: "session", label: "Session", sortable: true },
    {
      key: "is_active",
      label: "Status",
      render: (_v, row) => (
        <Badge className={cn("border-0", row.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_v, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batches</h2>
          <p className="text-gray-600">Manage class batches, schedules, and teacher assignments.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Batch
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Batches" value={String(batches.length)} icon={Calendar} />
        <StatsCard title="Active" value={String(activeBatches.length)} icon={GraduationCap} trend="up" />
        <StatsCard title="Total Capacity" value={String(totalCapacity)} icon={Users} />
        <StatsCard title="Main Campus" value={String(mainCampus)} icon={Calendar} />
      </div>

      <DataTable
        data={batches}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No batches found. Add a new batch to get started."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-name">Batch Name</Label>
              <Input id="batch-name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Class 9 - Morning" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Program</Label>
                <Select value={formData.program} onValueChange={(v) => setFormData((p) => ({ ...p, program: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{programOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campus</Label>
                <Select value={formData.campus} onValueChange={(v) => setFormData((p) => ({ ...p, campus: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{campusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-class">Class Level</Label>
                <Input id="batch-class" type="number" value={formData.class_level} onChange={(e) => setFormData((p) => ({ ...p, class_level: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-capacity">Capacity</Label>
                <Input id="batch-capacity" type="number" value={formData.capacity} onChange={(e) => setFormData((p) => ({ ...p, capacity: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-session">Session</Label>
              <Input id="batch-session" value={formData.session} onChange={(e) => setFormData((p) => ({ ...p, session: e.target.value }))} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="batch-active">Active</Label>
              <Switch id="batch-active" checked={formData.is_active} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name}>{editingBatch ? "Save Changes" : "Add Batch"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
