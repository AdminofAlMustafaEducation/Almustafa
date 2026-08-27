import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTeacherBatches, useBatchStudents, useSaveAttendance } from "@/hooks/use-portal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarCheck, Check, X, Clock, Save, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teacher/attendance")({
  component: MarkAttendance,
});

type AttendanceStatus = "present" | "absent" | "late";

interface StudentAttendance {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
}

function MarkAttendance() {
  const { user } = useAuth();
  const { batches } = useTeacherBatches(user?.id || "");
  const { saveAttendance, isLoading: isSaving } = useSaveAttendance();

  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendance[]>([]);

  const { students, isLoading: isLoadingStudents } = useBatchStudents(selectedBatchId);

  // Initialize attendance when batch is selected
  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    const batchStudents = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      rollNumber: s.roll_number || "",
      status: "present" as AttendanceStatus,
    }));
    setAttendanceRecords(batchStudents);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.studentId === studentId ? { ...record, status } : record)),
    );
  };

  const handleMarkAllPresent = () => {
    setAttendanceRecords((prev) =>
      prev.map((record) => ({ ...record, status: "present" as AttendanceStatus })),
    );
  };

  const handleSave = async () => {
    if (!selectedBatchId) return;

    const records = attendanceRecords.map((record) => ({
      student_id: record.studentId,
      batch_id: selectedBatchId,
      date: selectedDate,
      status: record.status,
    }));

    await saveAttendance(records);
    // Show success message or toast
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
        <p className="text-gray-600">Record student attendance for your classes.</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="batch">Select Batch</Label>
            <Select value={selectedBatchId} onValueChange={handleBatchChange}>
              <SelectTrigger id="batch">
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      {selectedBatchId && attendanceRecords.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">{attendanceRecords.length}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Present</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-900">{presentCount}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Absent</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-red-900">{absentCount}</p>
          </div>
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">Late</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-yellow-900">{lateCount}</p>
          </div>
        </div>
      )}

      {/* Student List */}
      {selectedBatchId && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900">Student List</h3>
            <Button variant="outline" size="sm" onClick={handleMarkAllPresent}>
              <Check className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>
          </div>

          {isLoadingStudents ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found in this batch.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {attendanceRecords.map((record) => (
                <div key={record.studentId} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700">
                      {record.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{record.studentName}</p>
                      <p className="text-sm text-gray-500">Roll # {record.rollNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={record.status === "present" ? "default" : "outline"}
                      className={cn(
                        "min-w-[90px]",
                        record.status === "present" && "bg-green-600 text-white hover:bg-green-700",
                      )}
                      onClick={() => handleStatusChange(record.studentId, "present")}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === "absent" ? "default" : "outline"}
                      className={cn(
                        "min-w-[90px]",
                        record.status === "absent" && "bg-red-600 text-white hover:bg-red-700",
                      )}
                      onClick={() => handleStatusChange(record.studentId, "absent")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === "late" ? "default" : "outline"}
                      className={cn(
                        "min-w-[90px]",
                        record.status === "late" && "bg-yellow-600 text-white hover:bg-yellow-700",
                      )}
                      onClick={() => handleStatusChange(record.studentId, "late")}
                    >
                      <Clock className="mr-1 h-4 w-4" />
                      Late
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {attendanceRecords.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Attendance
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedBatchId && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <CalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Batch</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose a batch from the dropdown above to mark attendance.
          </p>
        </div>
      )}
    </div>
  );
}
