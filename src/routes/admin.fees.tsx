import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  Ban,
  Pencil,
  Eye,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Fee } from "@/types/database";

export const Route = createFileRoute("/admin/fees")({
  component: FeesPage,
});

interface FeeRecord extends Fee {
  student_name: string;
  student_class: number;
  roll_number: string;
}

const statusConfig: Record<
  Fee["status"],
  { label: string; className: string; icon: typeof CheckCircle }
> = {
  paid: { label: "Paid", className: "badge-success", icon: CheckCircle },
  pending: { label: "Pending", className: "badge-warning", icon: Clock },
  overdue: { label: "Overdue", className: "badge-error", icon: AlertTriangle },
  waived: { label: "Waived", className: "badge-neutral", icon: Ban },
};

const feeTypeLabels: Record<string, string> = {
  monthly: "Monthly Fee",
  admission: "Admission Fee",
  exam: "Exam Fee",
  other: "Other",
};

const mockFees: FeeRecord[] = [
  {
    id: "f1",
    student_id: "s1",
    student_name: "Ahmed Khan",
    student_class: 9,
    roll_number: "2024-001",
    amount: 5000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    paid_date: "2025-01-08",
    status: "paid",
    payment_method: "Cash",
    receipt_number: "RCP-001",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2025-01-08T00:00:00Z",
  },
  {
    id: "f2",
    student_id: "s2",
    student_name: "Fatima Ali",
    student_class: 10,
    roll_number: "2024-002",
    amount: 5000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    paid_date: "2025-01-05",
    status: "paid",
    payment_method: "Bank Transfer",
    receipt_number: "RCP-002",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "f3",
    student_id: "s3",
    student_name: "Usman Ahmed",
    student_class: 11,
    roll_number: "2023-015",
    amount: 6000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    status: "pending",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2024-12-25T00:00:00Z",
  },
  {
    id: "f4",
    student_id: "s4",
    student_name: "Ayesha Malik",
    student_class: 12,
    roll_number: "2023-008",
    amount: 6000,
    fee_type: "monthly",
    month: "December 2024",
    due_date: "2024-12-10",
    status: "overdue",
    notes: "Reminder sent on Dec 20",
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
  {
    id: "f5",
    student_id: "s5",
    student_name: "Bilal Hussain",
    student_class: 9,
    roll_number: "2024-003",
    amount: 5000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    status: "pending",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2024-12-25T00:00:00Z",
  },
  {
    id: "f6",
    student_id: "s6",
    student_name: "Hamza Shah",
    student_class: 10,
    roll_number: "2024-004",
    amount: 5000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    paid_date: "2025-01-10",
    status: "paid",
    payment_method: "Cash",
    receipt_number: "RCP-006",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "f7",
    student_id: "s7",
    student_name: "Zainab Bibi",
    student_class: 12,
    roll_number: "2022-020",
    amount: 15000,
    fee_type: "admission",
    due_date: "2024-04-01",
    paid_date: "2024-03-28",
    status: "paid",
    payment_method: "Bank Transfer",
    receipt_number: "RCP-007",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-03-28T00:00:00Z",
  },
  {
    id: "f8",
    student_id: "s8",
    student_name: "Sara Iqbal",
    student_class: 11,
    roll_number: "2023-012",
    amount: 6000,
    fee_type: "monthly",
    month: "January 2025",
    due_date: "2025-01-10",
    status: "waived",
    notes: "Scholarship recipient",
    created_at: "2024-12-25T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "f9",
    student_id: "s1",
    student_name: "Ahmed Khan",
    student_class: 9,
    roll_number: "2024-001",
    amount: 2000,
    fee_type: "exam",
    due_date: "2025-02-15",
    status: "pending",
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "f10",
    student_id: "s3",
    student_name: "Usman Ahmed",
    student_class: 11,
    roll_number: "2023-015",
    amount: 6000,
    fee_type: "monthly",
    month: "December 2024",
    due_date: "2024-12-10",
    paid_date: "2024-12-12",
    status: "paid",
    payment_method: "Cash",
    receipt_number: "RCP-010",
    created_at: "2024-11-25T00:00:00Z",
    updated_at: "2024-12-12T00:00:00Z",
  },
];

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>(mockFees);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? fees
      : fees.filter((f) => f.status === statusFilter);

  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const collected = fees
    .filter((f) => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const pending = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);
  const overdue = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  function handleMarkPaid(id: string) {
    setFees((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: "paid" as const,
              paid_date: new Date().toISOString().split("T")[0],
              payment_method: "Cash",
              receipt_number: `RCP-${String(Math.floor(Math.random() * 9000) + 1000)}`,
              updated_at: new Date().toISOString(),
            }
          : f,
      ),
    );
  }

  const columns: Column<FeeRecord>[] = [
    {
      key: "student_name",
      label: "Student",
      sortable: true,
      render: (_value, row) => (
        <div>
          <p className="font-medium text-gray-900">{row.student_name}</p>
          <p className="text-xs text-gray-500">
            {row.roll_number} &middot; Class {row.student_class}
          </p>
        </div>
      ),
    },
    {
      key: "fee_type",
      label: "Fee Type",
      sortable: true,
      render: (_value, row) => (
        <div>
          <span>{feeTypeLabels[row.fee_type] ?? row.fee_type}</span>
          {row.month && (
            <p className="text-xs text-gray-500">{row.month}</p>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (_value, row) => (
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: "due_date",
      label: "Due Date",
      sortable: true,
      render: (_value, row) => formatDate(row.due_date),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => {
        const config = statusConfig[row.status];
        return (
          <span className={cn("badge", config.className)}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {row.status !== "paid" && row.status !== "waived" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700"
              onClick={() => handleMarkPaid(row.id)}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fees</h2>
          <p className="text-gray-600">
            Manage student fee records and payments.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Fees"
          value={formatCurrency(totalFees)}
          icon={CreditCard}
        />
        <StatsCard
          title="Collected"
          value={formatCurrency(collected)}
          icon={DollarSign}
          trend="up"
          description={`${fees.filter((f) => f.status === "paid").length} payments`}
        />
        <StatsCard
          title="Pending"
          value={formatCurrency(pending)}
          icon={Clock}
          description={`${fees.filter((f) => f.status === "pending").length} students`}
        />
        <StatsCard
          title="Overdue"
          value={formatCurrency(overdue)}
          icon={AlertTriangle}
          trend="down"
          description={`${fees.filter((f) => f.status === "overdue").length} students`}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="waived">Waived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <DataTable
        data={filtered}
        columns={columns}
        emptyMessage="No fee records found. Try adjusting your filters."
      />
    </div>
  );
}
