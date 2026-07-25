import { createFileRoute } from "@tanstack/react-router";
import { Users, FileText, MessageSquare, GraduationCap } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    {
      title: "Total Students",
      value: "187",
      icon: Users,
      description: "+12 this month",
      trend: "up" as const,
    },
    {
      title: "Pending Admissions",
      value: "23",
      icon: FileText,
      description: "5 new today",
      trend: "up" as const,
    },
    {
      title: "New Inquiries",
      value: "8",
      icon: MessageSquare,
      description: "3 unread",
      trend: "neutral" as const,
    },
    {
      title: "Active Faculty",
      value: "11",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
          <p className="mt-2 text-sm text-gray-500">
            Connect to Supabase to see inquiries.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-900">Admission Pipeline</h3>
          <p className="mt-2 text-sm text-gray-500">
            Connect to Supabase to see applications.
          </p>
        </div>
      </div>
    </div>
  );
}
