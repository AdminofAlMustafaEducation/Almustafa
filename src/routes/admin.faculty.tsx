import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useFaculty, useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from "@/hooks/use-faculty";
import { cn } from "@/lib/utils";
import type { Faculty } from "@/types/database";

export const Route = createFileRoute("/admin/faculty")({
  component: AdminFaculty,
});

const campusOptions = [
  { value: "main", label: "Main Campus" },
  { value: "second", label: "Second Campus" },
];

function AdminFaculty() {
  const { data: faculty = [], isLoading } = useFaculty();
  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    designation: "",
    initials: "",
    photo_url: "",
    campus: "main",
    is_active: true,
  });

  function handleAdd() {
    setEditingFaculty(null);
    setFormData({ name: "", subject: "", designation: "", initials: "", photo_url: "", campus: "main", is_active: true });
    setDialogOpen(true);
  }

  function handleEdit(member: Faculty) {
    setEditingFaculty(member);
    setFormData({
      name: member.name,
      subject: member.subject,
      designation: member.designation || "",
      initials: member.initials || "",
      photo_url: member.photo_url || "",
      campus: member.campus || "main",
      is_active: member.is_active,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.name || !formData.subject) return;

    const initials = formData.initials || formData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    if (editingFaculty) {
      updateFaculty.mutate({ id: editingFaculty.id, ...formData, initials });
    } else {
      createFaculty.mutate({ ...formData, initials, sort_order: faculty.length + 1 });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      deleteFaculty.mutate(id);
    }
  }

  function handleToggleActive(member: Faculty) {
    updateFaculty.mutate({ id: member.id, is_active: !member.is_active });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Faculty</h2>
          <p className="text-gray-600">Manage faculty members and their details.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Faculty
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
                    <AvatarFallback className="bg-gray-200 text-sm font-medium">{member.initials}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="font-medium">{member.name}</td>
                <td>{member.subject}</td>
                <td>{member.designation}</td>
                <td><Badge variant="secondary">{member.campus === "main" ? "Main" : "Second"}</Badge></td>
                <td>
                  <Badge className={cn("border-0", member.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleToggleActive(member)}>
                      {member.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {faculty.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No faculty members found.</p>
            <Button variant="outline" className="mt-4" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Faculty
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingFaculty ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="faculty-name">Name</Label>
              <Input id="faculty-name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Syed Ali Azeem Kazmi" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-subject">Subject</Label>
                <Input id="faculty-subject" value={formData.subject} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-designation">Designation</Label>
                <Input id="faculty-designation" value={formData.designation} onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))} placeholder="e.g. Director Academy" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-initials">Initials</Label>
                <Input id="faculty-initials" value={formData.initials} onChange={(e) => setFormData((p) => ({ ...p, initials: e.target.value.toUpperCase() }))} placeholder="Auto-generated" maxLength={3} />
              </div>
              <div className="space-y-2">
                <Label>Campus</Label>
                <Select value={formData.campus} onValueChange={(v) => setFormData((p) => ({ ...p, campus: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{campusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty-photo">Photo URL</Label>
              <Input id="faculty-photo" value={formData.photo_url} onChange={(e) => setFormData((p) => ({ ...p, photo_url: e.target.value }))} placeholder="/faculty/name.jpg" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="faculty-active">Active</Label>
              <Switch id="faculty-active" checked={formData.is_active} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.subject}>{editingFaculty ? "Save Changes" : "Add Faculty"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
