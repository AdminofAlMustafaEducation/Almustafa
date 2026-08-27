import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTeacherBatches, useTeacherTests } from "@/hooks/use-portal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Pencil, Trash2, BarChart3, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher/tests")({
  component: TestManagement,
});

interface TestFormData {
  name: string;
  subject: string;
  batch_id: string;
  total_marks: number;
  test_date: string;
}

const initialFormData: TestFormData = {
  name: "",
  subject: "",
  batch_id: "",
  total_marks: 100,
  test_date: new Date().toISOString().split("T")[0],
};

function TestManagement() {
  const { user } = useAuth();
  const { batches } = useTeacherBatches(user?.id || "");
  const { tests, addTest, updateTest, deleteTest } = useTeacherTests(user?.id || "");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestFormData>(initialFormData);

  const handleOpenCreate = () => {
    setEditingTest(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (testId: string) => {
    const test = tests.find((t) => t.id === testId);
    if (test) {
      setEditingTest(testId);
      setFormData({
        name: test.name,
        subject: test.subject,
        batch_id: test.batch_id,
        total_marks: test.total_marks,
        test_date: test.test_date,
      });
      setIsDialogOpen(true);
    }
  };

  const handleSave = () => {
    if (editingTest) {
      updateTest(editingTest, formData);
    } else {
      addTest(formData);
    }
    setIsDialogOpen(false);
    setFormData(initialFormData);
    setEditingTest(null);
  };

  const handleDelete = (testId: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      deleteTest(testId);
    }
  };

  const getBatchName = (batchId: string) => {
    return batches.find((b) => b.id === batchId)?.name || "Unknown Batch";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Management</h2>
          <p className="text-gray-600">Create and manage tests for your batches.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate} className="bg-black text-white hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTest ? "Edit Test" : "Create New Test"}</DialogTitle>
              <DialogDescription>
                {editingTest
                  ? "Update the test details below."
                  : "Fill in the details to create a new test."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics Mid-Term"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Select
                  value={formData.batch_id}
                  onValueChange={(value) => setFormData({ ...formData, batch_id: value })}
                >
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        total_marks: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test_date">Test Date</Label>
                  <Input
                    id="test_date"
                    type="date"
                    value={formData.test_date}
                    onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
                {editingTest ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {tests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Tests Yet</h3>
            <p className="mt-2 text-sm text-gray-500">Create your first test to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{test.subject}</Badge>
                  </TableCell>
                  <TableCell>{getBatchName(test.batch_id)}</TableCell>
                  <TableCell>{test.total_marks}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(test.test_date)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/teacher/results" search={{ testId: test.id }}>
                          <BarChart3 className="mr-1 h-4 w-4" />
                          Results
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(test.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(test.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
