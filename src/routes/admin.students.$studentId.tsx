import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudent } from "@/hooks/use-students";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/students/$studentId")({
  component: StudentDetail,
});

function StudentDetail() {
  const { studentId } = Route.useParams();
  const { data: student, isLoading } = useStudent(studentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Not Found</h2>
        <p className="text-gray-600">The student with ID "{studentId}" was not found.</p>
        <Link to="/admin/students">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students
          </Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
    graduated: "bg-blue-100 text-blue-800",
    withdrawn: "bg-red-100 text-red-800",
  };
  const studentName = student.name ?? student.full_name;
  const program = student.program ?? "Not assigned";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{studentName}</h2>
            <p className="text-gray-600">Roll Number: {student.roll_number || "N/A"}</p>
          </div>
        </div>
        <Badge className={cn("border-0 text-sm", statusColors[student.status])}>
          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.photo_url} alt={studentName} />
              <AvatarFallback className="bg-gray-200 text-2xl font-bold">
                {studentName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-xl font-bold text-gray-900">{studentName}</h3>
            <p className="text-sm text-gray-500 capitalize">{program.replace(/_/g, " ")}</p>
            <Badge variant="secondary" className="mt-2">
              Class {student.class_level}
            </Badge>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{student.email}</span>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{student.phone}</span>
              </div>
            )}
            {student.date_of_birth && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>
                  DOB:{" "}
                  {new Date(student.date_of_birth).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {student.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{student.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-gray-400" />
              <span>Campus: {student.campus === "main" ? "Main Campus" : "Second Campus"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Parent Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parent / Guardian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-500">Name:</span>{" "}
              <span className="font-medium">{student.parent_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{student.parent_phone}</span>
            </div>
            {student.parent_cnic && (
              <div className="text-sm">
                <span className="text-gray-500">CNIC:</span> {student.parent_cnic}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Academic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Academic Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">Program</p>
              <p className="font-medium capitalize">{program.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Class Level</p>
              <p className="font-medium">Class {student.class_level}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Campus</p>
              <p className="font-medium">{student.campus === "main" ? "Main" : "Second"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Admission Date</p>
              <p className="font-medium">
                {new Date(student.admission_date).toLocaleDateString("en-PK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
