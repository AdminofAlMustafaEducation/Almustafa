import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  GraduationCap,
  CreditCard,
  BookOpen,
  MapPin,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useStudentProfile, useStudentResults, useStudentFees } from "@/hooks/use-student-portal";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});

const programLabels: Record<string, string> = {
  matric: "Matric",
  fsc_pre_medical: "FSc Pre-Medical",
  fsc_pre_engineering: "FSc Pre-Engineering",
};

const campusLabels: Record<string, string> = {
  main: "Main Campus",
  second: "Second Campus",
};

function PortalDashboard() {
  const { user } = useAuth();
  const { data: profile } = useStudentProfile(user?.id);
  const { data: results = [] } = useStudentResults(profile?.id ?? "");
  const { data: fees = [] } = useStudentFees(profile?.id ?? "");

  const recentResults = results.slice(-4).reverse();
  const upcomingFees = fees
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .slice(0, 3);

  const totalPaid = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const totalDue = fees
    .filter((f) => f.status === "pending" || f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Assalam-o-Alaikum, {profile?.name ?? user?.name ?? "Student"}
        </h1>
        <p className="text-gray-600">Welcome to your student portal.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Attendance</p>
              <CalendarCheck className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">87%</p>
            <p className="text-xs text-green-600">Good standing</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Class</p>
              <GraduationCap className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">{profile?.class_level ?? "-"}</p>
            <p className="text-xs text-gray-500">
              {profile ? (programLabels[profile.program ?? ""] ?? profile.program ?? "-") : "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Campus</p>
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {profile ? (campusLabels[profile.campus ?? ""] ?? profile.campus ?? "-") : "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Roll #</p>
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-lg font-bold text-gray-900">{profile?.roll_number ?? "-"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Link
          to="/portal/attendance"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CalendarCheck className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Attendance</p>
              <p className="text-xs text-gray-500">Monthly calendar</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>

        <Link
          to="/portal/results"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <TrendingUp className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Results</p>
              <p className="text-xs text-gray-500">Test scores & grades</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>

        <Link
          to="/portal/fees"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CreditCard className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Fee Status</p>
              <p className="text-xs text-gray-500">
                {totalDue > 0 ? `Rs. ${totalDue.toLocaleString()} due` : "All clear"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      </div>

      {/* Bottom Grid: Recent Results + Upcoming Fees */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Test Results */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Results</CardTitle>
              <Link
                to="/portal/results"
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentResults.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No results yet.</p>
            ) : (
              <div className="space-y-3">
                {recentResults.map((result) => {
                  const pct = Math.round((result.marks_obtained / result.total_marks) * 100);
                  return (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{result.subject}</p>
                        <p className="text-xs text-gray-500">{result.test_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {result.marks_obtained}/{result.total_marks}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            pct >= 80
                              ? "border-green-200 bg-green-50 text-green-700"
                              : pct >= 60
                                ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                : "border-red-200 bg-red-50 text-red-700",
                          )}
                        >
                          {pct}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Fees */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Fees</CardTitle>
              <Link
                to="/portal/fees"
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingFees.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">No pending fees. All paid!</p>
            ) : (
              <div className="space-y-3">
                {upcomingFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {fee.month ?? fee.fee_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due:{" "}
                        {fee.due_date
                          ? new Date(fee.due_date).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                            })
                          : "No due date"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        Rs. {fee.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          fee.status === "overdue"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-yellow-200 bg-yellow-50 text-yellow-700",
                        )}
                      >
                        {fee.status === "overdue" ? "Overdue" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Summary */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">Total Paid</span>
              <span className="text-sm font-semibold text-green-700">
                Rs. {totalPaid.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
