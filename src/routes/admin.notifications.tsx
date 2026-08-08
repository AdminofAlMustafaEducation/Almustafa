import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  isActive: boolean;
  sortOrder: number;
};

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Admissions Open 2026-27",
    message: "Registration is now open for Juniors, Matric and F.Sc evening batches. Visit our campus or call for details.",
    date: "2026-08-08",
    isRead: false,
    isActive: true,
    sortOrder: 1,
  },
];

function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    isActive: true,
  });

  function handleAdd() {
    setEditingNotif(null);
    setFormData({ title: "", message: "", isActive: true });
    setDialogOpen(true);
  }

  function handleEdit(notif: Notification) {
    setEditingNotif(notif);
    setFormData({
      title: notif.title,
      message: notif.message,
      isActive: notif.isActive,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.title || !formData.message) return;

    if (editingNotif) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === editingNotif.id
            ? { ...n, ...formData }
            : n
        )
      );
    } else {
      const newNotif: Notification = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString().split("T")[0],
        isRead: false,
        sortOrder: notifications.length + 1,
      };
      setNotifications((prev) => [...prev, newNotif]);
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleToggleActive(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isActive: !n.isActive } : n))
    );
  }

  function handleToggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage announcements shown to visitors.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Notification
        </Button>
      </div>

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">How it works:</p>
            <p className="mt-1 text-blue-700">
              Active notifications appear in the notification bell (bottom-left of all pages).
              Unread notifications show a red badge count. Visitors can click to view and mark as read.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              "transition-all",
              !notif.isActive && "opacity-60"
            )}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-deep text-white">
                  <Bell className="h-4 w-4" />
                </div>
                {!notif.isRead && notif.isActive && (
                  <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {new Date(notif.date).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Badge>
                    <Badge
                      className={cn(
                        "border-0 text-[10px]",
                        notif.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {notif.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      className={cn(
                        "border-0 text-[10px]",
                        notif.isRead
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {notif.isRead ? "Read" : "Unread"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(notif)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRead(notif.id)}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    {notif.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(notif.id)}
                  >
                    {notif.isActive ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(notif.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Bell className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No notifications found.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first notification
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNotif ? "Edit Notification" : "Add New Notification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notif-title">Title</Label>
              <Input
                id="notif-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Admissions Open"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-message">Message</Label>
              <Textarea
                id="notif-message"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Write the notification message..."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-active">Active</Label>
              <Switch
                id="notif-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.message}>
              {editingNotif ? "Save Changes" : "Add Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
