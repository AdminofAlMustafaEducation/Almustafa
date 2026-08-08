import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Eye, Check, X, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/admin/stats-card";
import { DataTable, type Column } from "@/components/admin/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-admissions";
import { cn } from "@/lib/utils";
import type { Application } from "@/types/database";

export const Route = createFileRoute("/admin/admissions")({
  component: AdminAdmissions,
});

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-800", icon: Eye },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: Check },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: X },
  enrolled: { label: "Enrolled", color: "bg-purple-100 text-purple-800", icon: Check },
};

function AdminAdmissions() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: applications = [], isLoading, error } = useApplications(
    statusFilter === "all" ? undefined : { status: statusFilter }
  );
  const updateStatus = useUpdateApplicationStatus();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState("");

  const allApps = useApplications().data || [];
  const stats = {
    total: allApps.length,
    pending: allApps.filter((a) => a.status === "pending").length,
    reviewing: allApps.filter((a) => a.status === "reviewing").length,
    approved: allApps.filter((a) => a.status === "approved").length,
  };

  function handleStatusChange(id: string, newStatus: Application["status"]) {
    updateStatus.mutate(
      { id, status: newStatus, reviewer_notes: reviewerNotes || undefined },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedApp(null);
          setReviewerNotes("");
        },
        onError: (err) => {
          alert(`Failed to update: ${err.message}`);
        },
      }
    );
  }

  function handleView(app: Application) {
    setSelectedApp(app);
    setReviewerNotes(app.reviewer_notes || "");
    setDialogOpen(true);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-2 text-sm text-red-600">Failed to load applications: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const columns: Column<Application>[] = [
    {
      key: "application_number",
      header: "App #",
      render: (row) => <span className="font-mono text-xs">{row.application_number}</span>,
    },
    { key: "student_name", header: "Student Name", render: (row) => <span className="font-medium">{row.student_name}</span> },
    {
      key: "program",
      header: "Program",
      render: (row) => <span className="capitalize">{row.program.replace(/_/g, " ")}</span>,
    },
    { key: "class_level", header: "Class" },
    {
      key: "campus",
      header: "Campus",
      render: (row) => <Badge variant="secondary">{row.campus === "main" ? "Main" : "Second"}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const config = statusConfig[row.status];
        if (!config) return <Badge>{row.status}</Badge>;
        return (
          <Badge className={cn("border-0", config.color)}>
            <config.icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      header: "Applied",
      render: (row) => new Date(row.created_at).toLocaleDateString("en-PK", { month: "short", day: "numeric" }),
    },
    {
      key: "id",
      header: "Actions",
      render: (row) => (
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
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
          data={applications}
          columns={columns}
          isLoading={isLoading}
          searchKey="student_name"
          searchPlaceholder="Search by student name..."
          emptyMessage="No applications found."
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
                  <Badge className={cn("border-0", statusConfig[selectedApp.status]?.color)}>
                    {statusConfig[selectedApp.status]?.label || selectedApp.status}
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
            {selectedApp && updateStatus.isPending && (
              <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</Button>
            )}
            {selectedApp && !updateStatus.isPending && (
              <>
                {selectedApp.status === "pending" && (
                  <Button variant="secondary" onClick={() => handleStatusChange(selectedApp.id, "reviewing")}>
                    <Eye className="mr-1 h-3 w-3" /> Start Review
                  </Button>
                )}
                {selectedApp.status !== "approved" && selectedApp.status !== "enrolled" && (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusChange(selectedApp.id, "approved")}>
                    <Check className="mr-1 h-3 w-3" /> Approve
                  </Button>
                )}
                {selectedApp.status !== "rejected" && selectedApp.status !== "enrolled" && (
                  <Button variant="destructive" onClick={() => handleStatusChange(selectedApp.id, "rejected")}>
                    <X className="mr-1 h-3 w-3" /> Reject
                  </Button>
                )}
                {selectedApp.status === "approved" && (
                  <Button onClick={() => handleStatusChange(selectedApp.id, "enrolled")}>
                    <Check className="mr-1 h-3 w-3" /> Mark Enrolled
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
