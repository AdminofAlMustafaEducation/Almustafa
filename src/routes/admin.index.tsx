import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, FileText, MessageSquare, GraduationCap, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/use-students";
import { useFaculty } from "@/hooks/use-faculty";
import { useInquiries } from "@/hooks/use-inquiries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  responded: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
};

function AdminDashboard() {
  const { data: students = [] } = useStudents();
  const { data: faculty = [] } = useFaculty();
  const { data: inquiries = [] } = useInquiries();

  const activeStudents = students.filter((s) => s.status === "active").length;
  const activeFaculty = faculty.filter((f) => f.is_active).length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const recentInquiries = inquiries.slice(0, 5);

  const stats = [
    {
      title: "Total Students",
      value: String(students.length),
      icon: Users,
      description: `${activeStudents} active`,
      trend: "up" as const,
    },
    {
      title: "Active Faculty",
      value: String(activeFaculty),
      icon: GraduationCap,
      description: `${faculty.length} total`,
    },
    {
      title: "Inquiries",
      value: String(inquiries.length),
      icon: MessageSquare,
      description: `${newInquiries} new`,
      trend: newInquiries > 0 ? "up" as const : "neutral" as const,
    },
    {
      title: "Applications",
      value: "0",
      icon: FileText,
      description: "Connect Supabase",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
            <Link to="/admin/inquiries">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                    {inquiry.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                      <Badge className={cn("border-0 text-[10px]", statusColors[inquiry.status])}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 truncate">{inquiry.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid gap-3">
            <Link to="/admin/students/add">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Add New Student
              </Button>
            </Link>
            <Link to="/admin/admissions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Review Applications
              </Button>
            </Link>
            <Link to="/admin/attendance">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" /> Mark Attendance
              </Button>
            </Link>
            <Link to="/admin/notifications">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" /> Manage Notifications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
