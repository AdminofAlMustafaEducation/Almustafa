import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Plus, Eye, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/admin/stats-card";
import { DataTable } from "@/components/admin/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/admissions")({
  component: AdminAdmissions,
});

type Application = {
  id: string;
  application_number: string;
  student_name: string;
  email: string;
  phone: string;
  class_level: number;
  program: string;
  campus: string;
  parent_name: string;
  parent_phone: string;
  status: "pending" | "reviewing" | "approved" | "rejected" | "enrolled";
  reviewer_notes?: string;
  created_at: string;
};

const mockApplications: Application[] = [
  { id: "1", application_number: "AMA-2026-0001", student_name: "Hassan Ali", email: "hassan@example.com", phone: "0300-1111111", class_level: 9, program: "matric", campus: "main", parent_name: "Ali Ahmad", parent_phone: "0300-2222222", status: "pending", created_at: "2026-08-07T10:00:00Z" },
  { id: "2", application_number: "AMA-2026-0002", student_name: "Zainab Fatima", email: "zainab@example.com", phone: "0301-3333333", class_level: 11, program: "fsc_pre_medical", campus: "main", parent_name: "Fatima Bibi", parent_phone: "0301-4444444", status: "reviewing", created_at: "2026-08-06T14:00:00Z" },
  { id: "3", application_number: "AMA-2026-0003", student_name: "Omar Shah", email: "omar@example.com", phone: "0302-5555555", class_level: 10, program: "matric", campus: "second", parent_name: "Shah Muhammad", parent_phone: "0302-6666666", status: "approved", reviewer_notes: "Good academic record", created_at: "2026-08-05T09:00:00Z" },
  { id: "4", application_number: "AMA-2026-0004", student_name: "Sara Khan", email: "sara@example.com", phone: "0303-7777777", class_level: 12, program: "fsc_pre_engineering", campus: "main", parent_name: "Imran Khan", parent_phone: "0303-8888888", status: "rejected", reviewer_notes: "Incomplete documents", created_at: "2026-08-04T16:00:00Z" },
  { id: "5", application_number: "AMA-2026-0005", student_name: "Bilal Ahmed", email: "bilal@example.com", phone: "0304-9999999", class_level: 9, program: "matric", campus: "main", parent_name: "Ahmed Raza", parent_phone: "0304-0000000", status: "enrolled", created_at: "2026-08-03T11:00:00Z" },
];

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-800", icon: Eye },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: Check },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: X },
  enrolled: { label: "Enrolled", color: "bg-purple-100 text-purple-800", icon: Check },
};

function AdminAdmissions() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState("");

  const filtered = statusFilter === "all" ? applications : applications.filter((a) => a.status === statusFilter);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  function handleStatusChange(id: string, newStatus: Application["status"]) {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: newStatus, reviewer_notes: reviewerNotes || a.reviewer_notes } : a)
    );
    setDialogOpen(false);
    setSelectedApp(null);
    setReviewerNotes("");
  }

  function handleView(app: Application) {
    setSelectedApp(app);
    setReviewerNotes(app.reviewer_notes || "");
    setDialogOpen(true);
  }

  const columns = [
    {
      key: "application_number",
      header: "App #",
      render: (row: Application) => (
        <span className="font-mono text-xs">{row.application_number}</span>
      ),
    },
    { key: "student_name", header: "Student Name", render: (row: Application) => <span className="font-medium">{row.student_name}</span> },
    { key: "program", header: "Program", render: (row: Application) => <span className="capitalize">{row.program.replace(/_/g, " ")}</span> },
    { key: "class_level", header: "Class", render: (row: Application) => row.class_level },
    { key: "campus", header: "Campus", render: (row: Application) => <Badge variant="secondary">{row.campus === "main" ? "Main" : "Second"}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (row: Application) => {
        const config = statusConfig[row.status];
        return <Badge className={cn("border-0", config.color)}>{config.label}</Badge>;
      },
    },
    {
      key: "created_at",
      header: "Applied",
      render: (row: Application) => new Date(row.created_at).toLocaleDateString("en-PK", { month: "short", day: "numeric" }),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Application) => (
        <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admissions</h2>
          <p className="text-gray-600">Review and manage admission applications.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title="Total Applications" value={String(stats.total)} icon={FileText} />
        <StatsCard title="Pending Review" value={String(stats.pending)} icon={Clock} />
        <StatsCard title="Under Review" value={String(stats.reviewing)} icon={Eye} />
        <StatsCard title="Approved" value={String(stats.approved)} icon={Check} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <DataTable
          data={filtered}
          columns={columns}
          searchKey="student_name"
          searchPlaceholder="Search by student name..."
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">App #:</span> <span className="font-mono">{selectedApp.application_number}</span></div>
                <div><span className="text-gray-500">Student:</span> <span className="font-medium">{selectedApp.student_name}</span></div>
                <div><span className="text-gray-500">Email:</span> {selectedApp.email}</div>
                <div><span className="text-gray-500">Phone:</span> {selectedApp.phone}</div>
                <div><span className="text-gray-500">Class:</span> {selectedApp.class_level}</div>
                <div><span className="text-gray-500">Program:</span> <span className="capitalize">{selectedApp.program.replace(/_/g, " ")}</span></div>
                <div><span className="text-gray-500">Campus:</span> {selectedApp.campus}</div>
                <div><span className="text-gray-500">Parent:</span> {selectedApp.parent_name}</div>
                <div><span className="text-gray-500">Parent Phone:</span> {selectedApp.parent_phone}</div>
                <div>
                  <span className="text-gray-500">Status:</span>{" "}
                  <Badge className={cn("border-0", statusConfig[selectedApp.status].color)}>
                    {statusConfig[selectedApp.status].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewer-notes">Reviewer Notes</Label>
                <Textarea
                  id="reviewer-notes"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            {selectedApp?.status === "pending" && (
              <Button variant="secondary" onClick={() => handleStatusChange(selectedApp.id, "reviewing")}>
                <Eye className="mr-1 h-3 w-3" /> Start Review
              </Button>
            )}
            {selectedApp?.status !== "approved" && selectedApp?.status !== "enrolled" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(selectedApp!.id, "approved")}>
                <Check className="mr-1 h-3 w-3" /> Approve
              </Button>
            )}
            {selectedApp?.status !== "rejected" && selectedApp?.status !== "enrolled" && (
              <Button variant="destructive" onClick={() => handleStatusChange(selectedApp!.id, "rejected")}>
                <X className="mr-1 h-3 w-3" /> Reject
              </Button>
            )}
            {selectedApp?.status === "approved" && (
              <Button onClick={() => handleStatusChange(selectedApp.id, "enrolled")}>
                <Check className="mr-1 h-3 w-3" /> Mark Enrolled
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
