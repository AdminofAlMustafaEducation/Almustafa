import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, GraduationCap, Users, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
import { useStudents } from "@/hooks/use-students";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Student } from "@/types/database";

export const Route = createFileRoute("/admin/students")({
  component: StudentsPage,
});

const statusConfig: Record<Student["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "badge-success" },
  inactive: { label: "Inactive", className: "badge-neutral" },
  graduated: { label: "Graduated", className: "badge-info" },
  withdrawn: { label: "Withdrawn", className: "badge-error" },
};

const programLabels: Record<string, string> = {
  matric: "Matric",
  fsc_pre_medical: "FSc Pre-Medical",
  fsc_pre_engineering: "FSc Pre-Engineering",
};

const campusLabels: Record<string, string> = {
  main: "Main",
  second: "Second",
};

function StudentsPage() {
  const [classFilter, setClassFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: students = [], isLoading } = useStudents({
    classLevel: classFilter !== "all" ? Number(classFilter) : undefined,
    search: search || undefined,
  });

  const activeCount = students.filter((s) => s.status === "active").length;
  const graduatedCount = students.filter((s) => s.status === "graduated").length;
  const inactiveCount = students.filter(
    (s) => s.status === "inactive" || s.status === "withdrawn",
  ).length;

  const columns: Column<Student>[] = [
    {
      key: "roll_number",
      label: "Roll #",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_value, row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          {row.email && <p className="text-xs text-gray-500">{row.email}</p>}
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
      render: (_value, row) => {
        const program = row.program ?? "unassigned";
        return programLabels[program] ?? program;
      },
    },
    {
      key: "campus",
      label: "Campus",
      render: (_value, row) => {
        const campus = row.campus ?? "unassigned";
        return campusLabels[campus] ?? campus;
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => {
        const config = statusConfig[row.status];
        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <Link
            to="/admin/students/$studentId"
            params={{ studentId: row.id }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600">Manage student records and information.</p>
        </div>
        <Link to="/admin/students/add">
          <Button>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Students" value={students.length} icon={Users} />
        <StatsCard title="Active" value={activeCount} icon={UserCheck} trend="up" />
        <StatsCard title="Graduated" value={graduatedCount} icon={GraduationCap} />
        <StatsCard title="Inactive / Withdrawn" value={inactiveCount} icon={UserX} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
          />
        </div>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="9">Class 9</SelectItem>
            <SelectItem value="10">Class 10</SelectItem>
            <SelectItem value="11">Class 11</SelectItem>
            <SelectItem value="12">Class 12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={students}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No students found. Try adjusting your filters or add a new student."
      />
    </div>
  );
}
