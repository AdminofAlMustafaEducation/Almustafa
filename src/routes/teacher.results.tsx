import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useTeacherTests,
  useBatchStudents,
  useTestResults,
  useSaveResults,
} from "@/hooks/use-portal";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Save, TrendingUp, TrendingDown, Award, Hash } from "lucide-react";

export const Route = createFileRoute("/teacher/results")({
  component: ResultsEntry,
  validateSearch: (search: Record<string, unknown>): { testId?: string } => {
    return {
      testId: search.testId as string | undefined,
    };
  },
});

interface StudentResult {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marksObtained: string;
}

function ResultsEntry() {
  const { user } = useAuth();
  const { tests } = useTeacherTests(user?.id || "");
  const { saveResults, isLoading: isSaving } = useSaveResults();

  const searchParams = useSearch({ from: "/teacher/results" });
  const [selectedTestId, setSelectedTestId] = useState<string>(searchParams?.testId || "");
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

  const selectedTest = tests.find((t) => t.id === selectedTestId);
  const { students, isLoading: isLoadingStudents } = useBatchStudents(
    selectedTest?.class_id || selectedTest?.batch_id || "",
  );
  const { results: existingResults } = useTestResults(selectedTestId);

  // Initialize results when test is selected
  const handleTestChange = (testId: string) => {
    setSelectedTestId(testId);
    const test = tests.find((t) => t.id === testId);
    if (test) {
      const batchStudents = students.map((s) => {
        const existing = existingResults.find((r) => r.student_id === s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          rollNumber: s.roll_number || "",
          marksObtained: existing ? String(existing.marks_obtained) : "",
        };
      });
      setStudentResults(batchStudents);
    }
  };

  const handleMarksChange = (studentId: string, marks: string) => {
    // Allow empty string or valid numbers
    if (marks === "" || /^\d*$/.test(marks)) {
      setStudentResults((prev) =>
        prev.map((r) => (r.studentId === studentId ? { ...r, marksObtained: marks } : r)),
      );
    }
  };

  const handleSave = async () => {
    if (!selectedTestId) return;

    const results = studentResults
      .filter((r) => r.marksObtained !== "")
      .map((r) => ({
        test_id: selectedTestId,
        student_id: r.studentId,
        marks_obtained: parseInt(r.marksObtained) || 0,
      }));

    await saveResults(results);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const validResults = studentResults.filter((r) => r.marksObtained !== "");
    if (validResults.length === 0 || !selectedTest) {
      return null;
    }

    const marks = validResults.map((r) => parseInt(r.marksObtained) || 0);
    const total = marks.reduce((sum, m) => sum + m, 0);
    const average = total / marks.length;
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const graded = validResults.length;
    const totalStudents = studentResults.length;

    return { average, highest, lowest, graded, totalStudents };
  }, [studentResults, selectedTest]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Results</h2>
        <p className="text-gray-600">Record test results for your students.</p>
      </div>

      {/* Test Selection */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="space-y-2">
          <Label htmlFor="test">Select Test</Label>
          <Select value={selectedTestId} onValueChange={handleTestChange}>
            <SelectTrigger id="test">
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              {tests.map((test) => (
                <SelectItem key={test.id} value={test.id}>
                  {test.name} - {test.subject} ({test.total_marks} marks)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      {stats && selectedTest && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Graded</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.graded}/{stats.totalStudents}
            </p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Average</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-blue-900">
              {stats.average.toFixed(1)}
              <span className="text-sm font-normal text-blue-600">/{selectedTest.total_marks}</span>
            </p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Highest</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-900">
              {stats.highest}
              <span className="text-sm font-normal text-green-600">
                /{selectedTest.total_marks}
              </span>
            </p>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Lowest</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-orange-900">
              {stats.lowest}
              <span className="text-sm font-normal text-orange-600">
                /{selectedTest.total_marks}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Results Table */}
      {selectedTestId && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900">
              {selectedTest?.name || "Student Results"}
            </h3>
            {selectedTest && (
              <p className="mt-1 text-sm text-gray-500">Total Marks: {selectedTest.total_marks}</p>
            )}
          </div>

          {isLoadingStudents ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
          ) : studentResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students found for this test.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll #</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-[150px]">Marks Obtained</TableHead>
                  <TableHead className="w-[100px]">Percentage</TableHead>
                  <TableHead className="w-[100px]">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentResults.map((result) => {
                  const marks = parseInt(result.marksObtained) || 0;
                  const percentage = selectedTest ? (marks / selectedTest.total_marks) * 100 : 0;
                  const grade = getGrade(percentage);

                  return (
                    <TableRow key={result.studentId}>
                      <TableCell className="font-mono text-sm">{result.rollNumber}</TableCell>
                      <TableCell className="font-medium">{result.studentName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={result.marksObtained}
                            onChange={(e) => handleMarksChange(result.studentId, e.target.value)}
                            placeholder="0"
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">
                            /{selectedTest?.total_marks}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {result.marksObtained !== "" ? (
                          <span className={percentage >= 50 ? "text-green-600" : "text-red-600"}>
                            {percentage.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.marksObtained !== "" ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${grade.color}`}
                          >
                            {grade.label}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {studentResults.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black text-white hover:bg-gray-800"
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Results
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedTestId && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Test</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose a test from the dropdown above to enter results.
          </p>
        </div>
      )}
    </div>
  );
}

function getGrade(percentage: number): { label: string; color: string } {
  if (percentage >= 90) return { label: "A+", color: "bg-green-100 text-green-800" };
  if (percentage >= 80) return { label: "A", color: "bg-green-100 text-green-800" };
  if (percentage >= 70) return { label: "B", color: "bg-blue-100 text-blue-800" };
  if (percentage >= 60) return { label: "C", color: "bg-yellow-100 text-yellow-800" };
  if (percentage >= 50) return { label: "D", color: "bg-orange-100 text-orange-800" };
  return { label: "F", color: "bg-red-100 text-red-800" };
}
