import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Award, BookOpen } from "lucide-react";
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
import { useStudentProfile, useStudentResults } from "@/hooks/use-student-portal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portal/results")({
  component: ResultsPage,
});

function getGrade(pct: number): { grade: string; className: string } {
  if (pct >= 90) return { grade: "A+", className: "bg-green-100 text-green-800" };
  if (pct >= 80) return { grade: "A", className: "bg-green-100 text-green-700" };
  if (pct >= 70) return { grade: "B", className: "bg-blue-100 text-blue-700" };
  if (pct >= 60) return { grade: "C", className: "bg-yellow-100 text-yellow-700" };
  if (pct >= 50) return { grade: "D", className: "bg-orange-100 text-orange-700" };
  return { grade: "F", className: "bg-red-100 text-red-700" };
}

function ResultsPage() {
  const { user } = useAuth();
  const { data: profile } = useStudentProfile(user?.id);
  const { data: results = [], isLoading } = useStudentResults(profile?.id ?? "");

  // Overall stats
  const totalMarks = results.reduce((sum, r) => sum + r.total_marks, 0);
  const obtainedMarks = results.reduce((sum, r) => sum + r.marks_obtained, 0);
  const overallPct = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  const overallGrade = getGrade(overallPct);

  // Subject-wise performance
  const subjectMap = new Map<string, { obtained: number; total: number; count: number }>();
  for (const r of results) {
    const existing = subjectMap.get(r.subject) ?? { obtained: 0, total: 0, count: 0 };
    existing.obtained += r.marks_obtained;
    existing.total += r.total_marks;
    existing.count += 1;
    subjectMap.set(r.subject, existing);
  }

  const subjectStats = Array.from(subjectMap.entries())
    .map(([subject, data]) => ({
      subject,
      avg: Math.round(data.obtained / data.count),
      pct: Math.round((data.obtained / data.total) * 100),
      tests: data.count,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
        <p className="text-gray-600">View your academic performance and grades.</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <TrendingUp className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Overall Percentage</p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  overallPct >= 80
                    ? "text-green-600"
                    : overallPct >= 60
                      ? "text-yellow-600"
                      : "text-red-600",
                )}
              >
                {overallPct}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <Award className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Grade</p>
              <p className="text-2xl font-bold text-gray-900">{overallGrade.grade}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <BookOpen className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Performance */}
      {subjectStats.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjectStats.map((stat) => (
                <div key={stat.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{stat.subject}</span>
                    <span className="text-gray-600">
                      {stat.pct}% (avg {stat.avg}/{100})
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        stat.pct >= 80
                          ? "bg-green-500"
                          : stat.pct >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${stat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent" />
            </div>
          ) : results.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No test results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => {
                    const pct = Math.round((result.marks_obtained / result.total_marks) * 100);
                    const grade = getGrade(pct);
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.test_name}</TableCell>
                        <TableCell>{result.subject}</TableCell>
                        <TableCell className="hidden sm:table-cell text-gray-500">
                          {new Date(result.test_date).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {result.marks_obtained}/{result.total_marks}
                        </TableCell>
                        <TableCell className="text-right font-mono">{pct}%</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={cn("text-xs", grade.className)}>
                            {grade.grade}
                          </Badge>
                        </TableCell>
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
