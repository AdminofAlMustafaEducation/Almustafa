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
import { useNotifications, useCreateNotification, useUpdateNotification, useDeleteNotification } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

function AdminNotifications() {
  const { data: notifications = [], isLoading } = useNotifications();
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();
  const deleteNotification = useDeleteNotification();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<{ id: string; title: string; message: string; date: string; is_read: boolean; is_active: boolean; sort_order: number } | null>(null);
  const [formData, setFormData] = useState({ title: "", message: "", is_active: true });

  function handleAdd() {
    setEditingNotif(null);
    setFormData({ title: "", message: "", is_active: true });
    setDialogOpen(true);
  }

  function handleEdit(notif: typeof editingNotif) {
    if (!notif) return;
    setEditingNotif(notif);
    setFormData({ title: notif.title, message: notif.message, is_active: notif.is_active });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.title || !formData.message) return;

    if (editingNotif) {
      updateNotification.mutate({ id: editingNotif.id, ...formData });
    } else {
      createNotification.mutate({
        ...formData,
        date: new Date().toISOString().split("T")[0],
        is_read: false,
        sort_order: notifications.length + 1,
      });
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteNotification.mutate(id);
    }
  }

  function handleToggleActive(notif: typeof editingNotif) {
    if (!notif) return;
    updateNotification.mutate({ id: notif.id, is_active: !notif.is_active });
  }

  function handleToggleRead(notif: typeof editingNotif) {
    if (!notif) return;
    updateNotification.mutate({ id: notif.id, is_read: !notif.is_read });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage announcements shown to visitors.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Notification
        </Button>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">How it works:</p>
            <p className="mt-1 text-blue-700">Active notifications appear in the notification bell (bottom-left of all pages). Unread notifications show a red badge count.</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className={cn("transition-all", !notif.is_active && "opacity-60")}>
            <CardContent className="flex items-start gap-4 p-4">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-deep text-white">
                  <Bell className="h-4 w-4" />
                </div>
                {!notif.is_read && notif.is_active && (
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
                      {new Date(notif.date).toLocaleDateString("en-PK", { month: "short", day: "numeric" })}
                    </Badge>
                    <Badge className={cn("border-0 text-[10px]", notif.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                      {notif.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(notif)}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleRead(notif)}>
                    <Check className="mr-1 h-3 w-3" /> {notif.is_read ? "Mark Unread" : "Mark Read"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(notif)}>
                    {notif.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(notif.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Bell className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No notifications found.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add your first notification
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingNotif ? "Edit Notification" : "Add New Notification"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notif-title">Title</Label>
              <Input id="notif-title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Admissions Open" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-message">Message</Label>
              <Textarea id="notif-message" value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} placeholder="Write the notification message..." rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-active">Active</Label>
              <Switch id="notif-active" checked={formData.is_active} onCheckedChange={(c) => setFormData((p) => ({ ...p, is_active: c }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.message}>{editingNotif ? "Save Changes" : "Add Notification"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
