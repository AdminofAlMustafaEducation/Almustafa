import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useStudentProfile, useStudentAttendance } from "@/hooks/use-student-portal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/attendance")({
  component: AttendancePage,
});

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AttendancePage() {
  const { user } = useAuth();
  const { data: profile } = useStudentProfile(user?.id);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const { data: attendance = [], isLoading } = useStudentAttendance(
    profile?.id ?? "",
    year,
    month,
  );

  // Build attendance lookup by date string
  const attendanceMap = new Map<string, (typeof attendance)[0]["status"]>();
  for (const record of attendance) {
    attendanceMap.set(record.attendance_date, record.status);
  }

  // Calendar grid calculation
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Summary stats
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const lateCount = attendance.filter((a) => a.status === "late").length;
  const totalDays = attendance.length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  function goToPrevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Build calendar days array
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">Track your monthly attendance record.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Total Days</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{totalDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Present</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{presentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Absent</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{absentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-medium text-gray-500">Percentage</p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold",
                percentage >= 80
                  ? "text-green-600"
                  : percentage >= 60
                    ? "text-yellow-600"
                    : "text-red-600",
              )}
            >
              {percentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-base">
              {monthNames[month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Day labels */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {dayLabels.map((day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-xs font-semibold text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const status = attendanceMap.get(dateStr);
                  const isToday =
                    today.getFullYear() === year &&
                    today.getMonth() === month &&
                    today.getDate() === day;

                  return (
                    <div
                      key={dateStr}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors",
                        isToday && "ring-2 ring-black ring-offset-1",
                        status === "present" && "bg-green-100 text-green-800",
                        status === "absent" && "bg-red-100 text-red-800",
                        status === "late" && "bg-yellow-100 text-yellow-800",
                        !status && "text-gray-400",
                      )}
                      title={
                        status
                          ? `${day}: ${status.charAt(0).toUpperCase() + status.slice(1)}`
                          : `${day}: No record`
                      }
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-100 ring-1 ring-green-200" />
                  <span className="text-xs text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-100 ring-1 ring-red-200" />
                  <span className="text-xs text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-yellow-100 ring-1 ring-yellow-200" />
                  <span className="text-xs text-gray-600">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border border-gray-200" />
                  <span className="text-xs text-gray-600">No record</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
