import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
import { cn } from "@/lib/utils";
import type { Batch } from "@/types/database";

export const Route = createFileRoute("/admin/batches")({
  component: BatchesPage,
});

const programLabels: Record<string, string> = {
  matric: "Matric",
  fsc_pre_medical: "FSc Pre-Medical",
  fsc_pre_engineering: "FSc Pre-Engineering",
};

const campusLabels: Record<string, string> = {
  main: "Main",
  second: "Second",
};

const teacherNames: Record<string, string> = {
  t1: "Syed Ali Azeem Kazmi",
  t2: "Nabeel Kanwar",
  t3: "Syed Assad Abbas",
  t4: "Amir Abbasi",
  t5: "Abbas Malik",
  t6: "Mr. Sajid",
};

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
  {
    id: "b7",
    name: "Class 9 - Weekend",
    class_level: 9,
    program: "matric",
    campus: "second",
    teacher_id: "t2",
    schedule: "Sat-Sun 9:00-12:00",
    capacity: 25,
    session: "2024-2025",
    is_active: false,
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-08-15T00:00:00Z",
  },
];

function BatchesPage() {
  const [batches] = useState<Batch[]>(mockBatches);

  const activeBatches = batches.filter((b) => b.is_active);
  const totalCapacity = batches.reduce((sum, b) => sum + b.capacity, 0);
  const mainCampus = batches.filter((b) => b.campus === "main").length;

  const columns: Column<Batch>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_value, row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.schedule && (
            <p className="text-xs text-gray-500">{row.schedule}</p>
          )}
        </div>
      ),
    },
    {
      key: "class_level",
      label: "Class",
      sortable: true,
      render: (_value, row) => <span>Class {row.class_level}</span>,
    },
    {
      key: "program",
      label: "Program",
      sortable: true,
      render: (_value, row) => programLabels[row.program] ?? row.program,
    },
    {
      key: "campus",
      label: "Campus",
      render: (_value, row) => (
        <Badge variant="secondary">
          {campusLabels[row.campus] ?? row.campus}
        </Badge>
      ),
    },
    {
      key: "teacher_id",
      label: "Teacher",
      render: (_value, row) => (
        <span className="text-gray-700">
          {row.teacher_id ? teacherNames[row.teacher_id] ?? "—" : "—"}
        </span>
      ),
    },
    {
      key: "capacity",
      label: "Capacity",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          <span>{row.capacity}</span>
        </div>
      ),
    },
    {
      key: "session",
      label: "Session",
      sortable: true,
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batches</h2>
          <p className="text-gray-600">
            Manage class batches, schedules, and teacher assignments.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Batch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Batches"
          value={batches.length}
          icon={Calendar}
        />
        <StatsCard
          title="Active"
          value={activeBatches.length}
          icon={GraduationCap}
          trend="up"
        />
        <StatsCard
          title="Total Capacity"
          value={totalCapacity}
          icon={Users}
        />
        <StatsCard title="Main Campus" value={mainCampus} icon={Calendar} />
      </div>

      {/* Table */}
      <DataTable
        data={batches}
        columns={columns}
        emptyMessage="No batches found. Add a new batch to get started."
      />
    </div>
  );
}
