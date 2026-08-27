import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useTeacherBatches } from "@/hooks/use-portal";
import { Users, Calendar, FileText, CalendarCheck, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/admin/stats-card";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

function TeacherDashboard() {
  const { user } = useAuth();
  const { batches } = useTeacherBatches(user?.id || "");

  const stats = [
    {
      title: "My Batches",
      value: String(batches.length),
      icon: Users,
      description: "Active batches",
    },
    {
      title: "Today's Classes",
      value: "3",
      icon: Calendar,
      description: "Scheduled for today",
    },
    {
      title: "Pending Results",
      value: "2",
      icon: FileText,
      description: "Tests to grade",
      trend: "up" as const,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Attendance marked for Class 9 - Morning",
      time: "2 hours ago",
      icon: CalendarCheck,
    },
    {
      id: 2,
      action: "Mathematics Mid-Term results submitted",
      time: "Yesterday",
      icon: BarChart3,
    },
    {
      id: 3,
      action: "New test created: English Unit Test",
      time: "2 days ago",
      icon: FileText,
    },
    {
      id: 4,
      action: "Attendance marked for Class 10 - Morning",
      time: "2 days ago",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || "Teacher"}!</h2>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your classes today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Button asChild className="justify-start bg-black text-white hover:bg-gray-800">
              <Link to="/teacher/attendance">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Mark Attendance
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/teacher/results">
                <BarChart3 className="mr-2 h-4 w-4" />
                Enter Results
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/teacher/tests">
                <FileText className="mr-2 h-4 w-4" />
                Manage Tests
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  <activity.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Batches */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="font-semibold text-gray-900">My Batches</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300"
            >
              <h4 className="font-medium text-gray-900">{batch.name}</h4>
              <p className="mt-1 text-sm text-gray-500">{batch.schedule}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                  {batch.program.replace(/_/g, " ")}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
