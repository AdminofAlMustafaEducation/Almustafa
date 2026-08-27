import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useStudentProfile, useStudentFees } from "@/hooks/use-student-portal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/fees")({
  component: FeesPage,
});

const statusConfig: Record<
  string,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  paid: { label: "Paid", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-800", icon: AlertCircle },
  waived: { label: "Waived", className: "bg-gray-100 text-gray-600", icon: CheckCircle2 },
};

const feeTypeLabels: Record<string, string> = {
  monthly: "Monthly Fee",
  admission: "Admission Fee",
  exam: "Exam Fee",
  other: "Other",
};

function FeesPage() {
  const { user } = useAuth();
  const { data: profile } = useStudentProfile(user?.id);
  const { data: fees = [], isLoading } = useStudentFees(profile?.id ?? "");

  const totalPaid = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees
    .filter((f) => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOverdue = fees
    .filter((f) => f.status === "overdue")
    .reduce((sum, f) => sum + f.amount, 0);
  const balance = totalPending + totalOverdue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Status</h1>
        <p className="text-gray-600">View your fee records and payment status.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <CreditCard className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Due</p>
              <p className="text-xl font-bold text-gray-900">
                Rs. {(totalPaid + balance).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Paid</p>
              <p className="text-xl font-bold text-green-700">Rs. {totalPaid.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                balance > 0 ? "bg-red-50" : "bg-gray-100",
              )}
            >
              {balance > 0 ? (
                <AlertCircle className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Balance</p>
              <p
                className={cn("text-xl font-bold", balance > 0 ? "text-red-700" : "text-green-700")}
              >
                {balance > 0 ? `Rs. ${balance.toLocaleString()}` : "All Clear"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fee Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
          ) : fees.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No fee records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Paid Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => {
                    const config = statusConfig[fee.status] ?? statusConfig.pending;
                    return (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.month ?? "-"}</TableCell>
                        <TableCell className="text-gray-600">
                          {feeTypeLabels[fee.fee_type] ?? fee.fee_type}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          Rs. {fee.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-500">
                          {fee.due_date
                            ? new Date(fee.due_date).toLocaleDateString("en-PK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs", config.className)}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-500">-</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
