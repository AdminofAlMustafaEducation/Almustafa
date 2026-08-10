import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Eye, Check, X, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInquiries, useUpdateInquiry } from "@/hooks/use-inquiries";
import { cn } from "@/lib/utils";
import type { Inquiry } from "@/types/database";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800" },
  responded: { label: "Responded", color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-600" },
};

function AdminInquiries() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: inquiries = [], isLoading, error } = useInquiries(
    statusFilter === "all" ? undefined : { status: statusFilter }
  );
  const updateInquiry = useUpdateInquiry();

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const allInquiries = useInquiries().data || [];
  const stats = {
    total: allInquiries.length,
    newCount: allInquiries.filter((i) => i.status === "new").length,
    responded: allInquiries.filter((i) => i.status === "responded").length,
    closed: allInquiries.filter((i) => i.status === "closed").length,
  };

  function handleStatusChange(id: string, newStatus: Inquiry["status"]) {
    updateInquiry.mutate(
      { id, status: newStatus, responded_at: newStatus === "responded" ? new Date().toISOString() : undefined },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedInquiry(null);
        },
        onError: (err) =>         toast.error(`Failed to update: ${err.message}`),
      }
    );
  }

  function handleView(inquiry: Inquiry) {
    setSelectedInquiry(inquiry);
    setDialogOpen(true);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-red-400" />
          <p className="mt-2 text-sm text-red-600">Failed to load inquiries: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const config = statusConfig[row.status];
        return <Badge className={cn("border-0", config?.color)}>{config?.label || row.status}</Badge>;
      },
    },
    {
      key: "created_at",
      label: "Date",
      render: (row) => new Date(row.created_at).toLocaleDateString("en-PK", { month: "short", day: "numeric" }),
    },
    {
      key: "id",
      label: "Actions",
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inquiries</h2>
          <p className="text-gray-600">Manage contact form submissions and inquiries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Inquiries" value={String(stats.total)} icon={MessageSquare} />
        <StatsCard title="New" value={String(stats.newCount)} icon={MessageSquare} trend="up" />
        <StatsCard title="Responded" value={String(stats.responded)} icon={CheckCircle} />
        <StatsCard title="Closed" value={String(stats.closed)} icon={XCircle} />
      </div>

      <DataTable
        data={inquiries}
        columns={columns}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search by name..."
        emptyMessage="No inquiries found."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedInquiry.name}</span></div>
                <div><span className="text-gray-500">Email:</span> {selectedInquiry.email || "N/A"}</div>
                <div><span className="text-gray-500">Phone:</span> {selectedInquiry.phone || "N/A"}</div>
                <div><span className="text-gray-500">Subject:</span> {selectedInquiry.subject || "N/A"}</div>
                <div>
                  <span className="text-gray-500">Status:</span>{" "}
                  <Badge className={cn("border-0", statusConfig[selectedInquiry.status]?.color)}>
                    {statusConfig[selectedInquiry.status]?.label || selectedInquiry.status}
                  </Badge>
                </div>
                <div><span className="text-gray-500">Date:</span> {new Date(selectedInquiry.created_at).toLocaleString()}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <p className="text-sm text-gray-900 rounded-lg bg-gray-50 p-3">{selectedInquiry.message}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedInquiry.status === "new" && (
                  <Button size="sm" onClick={() => handleStatusChange(selectedInquiry.id, "responded")}>
                    <CheckCircle className="mr-1 h-3 w-3" /> Mark Responded
                  </Button>
                )}
                {selectedInquiry.status !== "closed" && (
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(selectedInquiry.id, "closed")}>
                    <XCircle className="mr-1 h-3 w-3" /> Close
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
