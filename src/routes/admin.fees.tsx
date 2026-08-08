import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Eye, Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
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
import { useFees, useUpdateFee } from "@/hooks/use-fees";
import { cn } from "@/lib/utils";
import type { Fee } from "@/types/database";

export const Route = createFileRoute("/admin/fees")({
  component: FeesPage,
});

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  waived: "bg-gray-100 text-gray-600",
};

function FeesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: allFees = [], isLoading } = useFees();
  const { data: filteredFees = [] } = useFees(statusFilter === "all" ? undefined : { status: statusFilter });
  const updateFee = useUpdateFee();

  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalAmount = allFees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = allFees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = allFees.filter((f) => f.status === "pending").reduce((sum, f) => sum + f.amount, 0);

  function handleMarkPaid(fee: Fee) {
    updateFee.mutate(
      {
        id: fee.id,
        status: "paid",
        paid_date: new Date().toISOString().split("T")[0],
        payment_method: "cash",
        receipt_number: `RCP-${Date.now().toString().slice(-6)}`,
      },
      {
        onSuccess: () => setDialogOpen(false),
        onError: (err) => alert(`Failed to update: ${err.message}`),
      }
    );
  }

  function handleView(fee: Fee) {
    setSelectedFee(fee);
    setDialogOpen(true);
  }

  const columns: Column<Fee>[] = [
    {
      key: "student_id",
      label: "Student",
      sortable: true,
      render: (_v, row) => <span className="font-medium">Student #{row.student_id}</span>,
    },
    {
      key: "fee_type",
      label: "Type",
      render: (_v, row) => <span className="capitalize">{row.fee_type}</span>,
    },
    { key: "month", label: "Month" },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_v, row) => <span className="font-medium">Rs. {row.amount.toLocaleString()}</span>,
    },
    { key: "due_date", label: "Due Date", render: (_v, row) => new Date(row.due_date).toLocaleDateString("en-PK", { month: "short", day: "numeric" }) },
    {
      key: "status",
      label: "Status",
      render: (_v, row) => <Badge className={cn("border-0", statusColors[row.status])}>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</Badge>,
    },
    {
      key: "id",
      label: "Actions",
      render: (_v, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === "pending" && (
            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleMarkPaid(row)}>
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fees</h2>
          <p className="text-gray-600">Track student fee payments and outstanding balances.</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Fees" value={`Rs. ${totalAmount.toLocaleString()}`} icon={CreditCard} />
        <StatsCard title="Collected" value={`Rs. ${paidAmount.toLocaleString()}`} icon={Check} trend="up" />
        <StatsCard title="Pending" value={`Rs. ${pendingAmount.toLocaleString()}`} icon={CreditCard} />
        <StatsCard title="Records" value={String(allFees.length)} icon={CreditCard} />
      </div>

      <DataTable data={filteredFees} columns={columns} isLoading={isLoading} emptyMessage="No fee records found." />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fee Details</DialogTitle>
          </DialogHeader>
          {selectedFee && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Student:</span> <span className="font-medium">#{selectedFee.student_id}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{selectedFee.fee_type}</span></div>
                <div><span className="text-gray-500">Month:</span> <span className="font-medium">{selectedFee.month || "N/A"}</span></div>
                <div><span className="text-gray-500">Amount:</span> <span className="font-medium">Rs. {selectedFee.amount.toLocaleString()}</span></div>
                <div><span className="text-gray-500">Due Date:</span> <span className="font-medium">{new Date(selectedFee.due_date).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500">Status:</span> <Badge className={cn("border-0", statusColors[selectedFee.status])}>{selectedFee.status}</Badge></div>
                {selectedFee.paid_date && <div><span className="text-gray-500">Paid Date:</span> <span className="font-medium">{new Date(selectedFee.paid_date).toLocaleDateString()}</span></div>}
                {selectedFee.receipt_number && <div><span className="text-gray-500">Receipt:</span> <span className="font-mono">{selectedFee.receipt_number}</span></div>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            {selectedFee?.status === "pending" && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleMarkPaid(selectedFee)}>
                <Check className="mr-1 h-3 w-3" /> Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
