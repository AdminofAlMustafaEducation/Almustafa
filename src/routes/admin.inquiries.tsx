import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

type InquiryItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "responded" | "closed";
  created_at: string;
};

const mockInquiries: InquiryItem[] = [
  {
    id: "1",
    name: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "0300-1234567",
    subject: "Admission Inquiry",
    message:
      "I would like to know about the admission process for my son who is currently in class 8. What are the requirements and fees for class 9 FSc Pre-Medical?",
    status: "new",
    created_at: "2025-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima.ali@email.com",
    phone: "0312-9876543",
    subject: "Fee Structure",
    message:
      "Could you please share the complete fee structure for FSc Pre-Engineering? Also, do you offer any scholarships or discounts?",
    status: "new",
    created_at: "2025-01-19T14:15:00Z",
  },
  {
    id: "3",
    name: "Muhammad Asif",
    email: "asif@email.com",
    phone: "0333-5551234",
    subject: "Campus Visit",
    message:
      "I would like to visit the campus with my daughter. What are the visiting hours? Can we meet the faculty?",
    status: "responded",
    created_at: "2025-01-18T09:00:00Z",
  },
  {
    id: "4",
    name: "Sara Malik",
    email: "sara.m@email.com",
    phone: "0345-1112233",
    subject: "Transfer Student",
    message:
      "My son wants to transfer from another academy. Is it possible to join mid-session? What documents are required?",
    status: "responded",
    created_at: "2025-01-17T16:45:00Z",
  },
  {
    id: "5",
    name: "Usman Ahmed",
    email: "usman.a@email.com",
    phone: "0321-7778899",
    subject: "Timings Query",
    message:
      "What are the coaching timings for class 10 students? Do you have separate batches for boys and girls?",
    status: "closed",
    created_at: "2025-01-15T11:20:00Z",
  },
  {
    id: "6",
    name: "Zainab Bibi",
    email: "zainab@email.com",
    phone: "0300-4445566",
    subject: "Results Inquiry",
    message:
      "I want to check the board results of last year's students. What was the pass percentage?",
    status: "closed",
    created_at: "2025-01-12T08:30:00Z",
  },
];

const statusConfig = {
  new: { label: "New", className: "bg-blue-100 text-blue-800" },
  responded: { label: "Responded", className: "bg-green-100 text-green-800" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600" },
};

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(mockInquiries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const filtered =
    statusFilter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === statusFilter);

  function handleUpdateStatus(id: string, status: "responded" | "closed") {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inquiries</h2>
        <p className="text-gray-600">Manage contact form submissions.</p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filtered.length} inquir{filtered.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inq) => {
              const status = statusConfig[inq.status];
              return (
                <tr key={inq.id}>
                  <td className="font-medium">{inq.name}</td>
                  <td>{inq.email}</td>
                  <td>{inq.phone}</td>
                  <td>{inq.subject}</td>
                  <td>
                    <Badge className={cn("border-0", status.className)}>
                      {status.label}
                    </Badge>
                  </td>
                  <td>{formatDate(inq.created_at)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {inq.status === "new" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleUpdateStatus(inq.id, "responded")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {inq.status !== "closed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleUpdateStatus(inq.id, "closed")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No inquiries found.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedInquiry?.subject}</DialogTitle>
            <DialogDescription>
              From {selectedInquiry?.name} &middot; {selectedInquiry && formatDate(selectedInquiry.created_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email</span>
                <p className="font-medium">{selectedInquiry?.email}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone</span>
                <p className="font-medium">{selectedInquiry?.phone}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Message</span>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {selectedInquiry?.message}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedInquiry?.status === "new" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedInquiry.id, "responded")}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Mark as Responded
                </Button>
              )}
              {selectedInquiry?.status !== "closed" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedInquiry!.id, "closed")}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
