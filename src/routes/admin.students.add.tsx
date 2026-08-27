import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StudentForm, type StudentFormValues } from "@/components/admin/student-form";
import { useCreateStudent } from "@/hooks/use-students";
import type { Student } from "@/types/database";

export const Route = createFileRoute("/admin/students/add")({
  component: AddStudentPage,
});

function AddStudentPage() {
  const navigate = useNavigate();
  const createStudent = useCreateStudent();

  const handleSubmit = (data: StudentFormValues) => {
    const program: Student["program"] =
      data.program === "fsc_pre_medical"
        ? "fsc_pre_medical"
        : data.program === "fsc_pre_engineering"
          ? "fsc_pre_engineering"
          : "matric";
    const campus: Student["campus"] = data.campus === "second" ? "second" : "main";
    const studentData = {
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
      date_of_birth: data.date_of_birth || undefined,
      address: data.address || undefined,
      parent_cnic: data.parent_cnic || undefined,
      admission_date: new Date().toISOString().split("T")[0],
      program,
      campus,

      status: "active" as const,
    };

    createStudent.mutate(studentData, {
      onSuccess: () => {
        void navigate({ to: "/admin/students" });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
          <p className="text-gray-600">Fill in the details to enroll a new student.</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={() => void navigate({ to: "/admin/students" })}
          isLoading={createStudent.isPending}
        />
      </div>

      {createStudent.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">Failed to create student. Please try again.</p>
        </div>
      )}
    </div>
  );
}
