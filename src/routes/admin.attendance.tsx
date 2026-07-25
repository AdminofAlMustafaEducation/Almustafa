import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Users,
  UserCheck,
  UserX,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useBatches,
  useAttendance,
  useAttendanceStats,
  useMarkAttendance,
  type AttendanceRecord,
} from "@/hooks/use-attendance";

export const Route = createFileRoute("/admin/attendance")({
  component: AttendancePage,
});

const statusConfig: Record<
  "present" | "absent" | "late",
  { label: string; className: string }
> = {
  present: { label: "Present", className: "badge-success" },
  absent: { label: "Absent", className: "badge-error" },
  late: { label: "Late", className: "badge-warning" },
};

function AttendancePage() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [localRecords, setLocalRecords] = useState<
    Map<string, "present" | "absent" | "late">
  >(new Map());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: batches = [] } = useBatches();
  const { data: records = [], isLoading } = useAttendance(
    selectedBatch,
    selectedDate,
  );
  const { data: stats } = useAttendanceStats(selectedBatch, selectedDate);
  const markAttendance = useMarkAttendance();

  // Merge server records with local edits
  const displayRecords = records.map((r) => ({
    ...r,
    status: localRecords.has(r.student_id)
      ? localRecords.get(r.student_id)!
      : r.status,
  }));

  function handleStatusChange(
    studentId: string,
    status: "present" | "absent" | "late",
  ) {
    setLocalRecords((prev) => {
      const next = new Map(prev);
      next.set(studentId, status);
      return next;
    });
  }

  function handleMarkAllPresent() {
    setLocalRecords((prev) => {
      const next = new Map(prev);
      for (const r of records) {
        next.set(r.student_id, "present");
      }
      return next;
    });
  }

  function handleSave() {
    if (!selectedBatch || localRecords.size === 0) return;

    const inputRecords = Array.from(localRecords.entries()).map(
      ([studentId, status]) => ({
        student_id: studentId,
        status,
      }),
    );

    markAttendance.mutate(
      { batch_id: selectedBatch, date: selectedDate, records: inputRecords },
      {
        onSuccess: () => {
          setLocalRecords(new Map());
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        },
      },
    );
  }

  const hasChanges = localRecords.size > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
          <p className="text-gray-600">
            Mark and manage student attendance by batch.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedBatch && (
            <Button variant="outline" onClick={handleMarkAllPresent}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || markAttendance.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {saveSuccess ? "Saved!" : markAttendance.isPending ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-48 md:text-sm"
        />
      </div>

      {/* Stats */}
      {selectedBatch && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Students" value={stats.totalStudents} icon={Users} />
          <StatsCard
            title="Present"
            value={stats.present}
            icon={UserCheck}
            trend="up"
          />
          <StatsCard title="Absent" value={stats.absent} icon={UserX} />
          <StatsCard
            title="Attendance Rate"
            value={`${stats.percentage}%`}
            icon={CalendarDays}
            description={`${stats.late} late`}
          />
        </div>
      )}

      {/* Table */}
      {!selectedBatch ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
          <CalendarDays className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">
            Select a batch to view and mark attendance.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <table className="admin-table w-full">
            <thead>
              <tr>
                <th>Roll #</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    Loading attendance...
                  </td>
                </tr>
              ) : displayRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No students found in this batch.
                  </td>
                </tr>
              ) : (
                displayRecords.map((record) => (
                  <tr key={record.student_id}>
                    <td className="font-medium">{record.roll_number}</td>
                    <td>{record.student_name}</td>
                    <td>
                      {record.status ? (
                        <span
                          className={cn(
                            "badge",
                            statusConfig[record.status].className,
                          )}
                        >
                          {record.status === "late" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {statusConfig[record.status].label}
                        </span>
                      ) : (
                        <span className="badge badge-neutral">Not Marked</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {(["present", "absent", "late"] as const).map(
                          (status) => (
                            <Button
                              key={status}
                              variant={
                                record.status === status ? "default" : "outline"
                              }
                              size="sm"
                              className={cn(
                                "h-7 text-xs",
                                record.status === status &&
                                  status === "present" &&
                                  "bg-green-600 hover:bg-green-700",
                                record.status === status &&
                                  status === "absent" &&
                                  "bg-red-600 hover:bg-red-700",
                                record.status === status &&
                                  status === "late" &&
                                  "bg-yellow-500 hover:bg-yellow-600 text-black",
                              )}
                              onClick={() =>
                                handleStatusChange(record.student_id, status)
                              }
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Button>
                          ),
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
