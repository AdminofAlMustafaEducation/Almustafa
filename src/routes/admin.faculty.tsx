import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/faculty")({
  component: AdminFaculty,
});

type FacultyMember = {
  id: string;
  name: string;
  subject: string;
  designation: string;
  initials: string;
  photo_url?: string;
  campus: string;
  is_active: boolean;
};

const mockFaculty: FacultyMember[] = [
  { id: "1", name: "Syed Ali Azeem Kazmi", subject: "Mathematics", designation: "Director Academy", initials: "AA", photo_url: "/faculty/syed-ali-azeem-kazmi.jpg", campus: "main", is_active: true },
  { id: "2", name: "Syed Ali Abbas Kazmi", subject: "Mathematics", designation: "Director Academy", initials: "AB", photo_url: "/faculty/syed-ali-abbas-kazmi.jpg", campus: "main", is_active: true },
  { id: "3", name: "Syed Sajid Kazmi", subject: "Biology", designation: "V.P ICB G-6/3", initials: "SK", campus: "second", is_active: true },
  { id: "4", name: "Ch. Muhammad Zareef", subject: "Coordinator", designation: "IMCB G-10/4", initials: "MZ", photo_url: "/faculty/ch-muhammad-zareef.jpg", campus: "main", is_active: true },
  { id: "5", name: "Nabeel Kanwar", subject: "Physics", designation: "Lecturer IMCB H-9", initials: "NK", photo_url: "/faculty/nabeel-kanwar.jpg", campus: "main", is_active: true },
  { id: "6", name: "Zahid Abbas Hiraj", subject: "Admin Accounts", designation: "Bahria College", initials: "ZH", photo_url: "/faculty/zahid-abbas-hiraj.jpg", campus: "second", is_active: true },
  { id: "7", name: "Syed Assad Abbas", subject: "Chemistry", designation: "Lecturer IMCB G-11/1", initials: "AA", photo_url: "/faculty/syed-assad-abbas.jpg", campus: "main", is_active: true },
  { id: "8", name: "Mr. Sajid", subject: "Chemistry", designation: "Lecturer IMCB H-9", initials: "MS", campus: "main", is_active: true },
  { id: "9", name: "Amir Abbasi", subject: "English", designation: "Lecturer APS RWP", initials: "AA", campus: "second", is_active: true },
  { id: "10", name: "Abbas Malik", subject: "Computer", designation: "Lecturer Al-Kausar", initials: "AM", campus: "main", is_active: true },
  { id: "11", name: "Zaheer Malik", subject: "Accounting", designation: "Account Officer PAF", initials: "ZM", campus: "second", is_active: false },
];

function AdminFaculty() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(mockFaculty);

  function handleToggleActive(id: string) {
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_active: !f.is_active } : f)),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Faculty</h2>
          <p className="text-gray-600">Manage faculty members and their details.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Designation</th>
              <th>Campus</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map((member) => (
              <tr key={member.id} className={!member.is_active ? "opacity-60" : ""}>
                <td>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.photo_url} alt={member.name} />
                    <AvatarFallback className="bg-gray-200 text-sm font-medium">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                </td>
                <td className="font-medium">{member.name}</td>
                <td>{member.subject}</td>
                <td>{member.designation}</td>
                <td>
                  <Badge variant="secondary">
                    {member.campus === "main" ? "Main" : "Second"}
                  </Badge>
                </td>
                <td>
                  <Badge
                    className={cn(
                      "border-0",
                      member.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(member.id)}
                    >
                      {member.is_active ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {faculty.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No faculty members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
