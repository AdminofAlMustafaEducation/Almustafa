import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, MessageCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/chat-agents")({
  component: AdminChatAgents,
});

type ChatAgent = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  whatsappNumber: string;
  isActive: boolean;
  sortOrder: number;
};

const defaultAgents: ChatAgent[] = [
  {
    id: "1",
    name: "Al-Mustafa Academy",
    role: "Admissions",
    photoUrl: "/brand/almustafa-logo.jpg",
    whatsappNumber: "+923350555696",
    isActive: true,
    sortOrder: 1,
  },
];

function AdminChatAgents() {
  const [agents, setAgents] = useState<ChatAgent[]>(defaultAgents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<ChatAgent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    photoUrl: "",
    whatsappNumber: "",
    isActive: true,
  });

  function handleAdd() {
    setEditingAgent(null);
    setFormData({ name: "", role: "", photoUrl: "", whatsappNumber: "", isActive: true });
    setDialogOpen(true);
  }

  function handleEdit(agent: ChatAgent) {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      role: agent.role,
      photoUrl: agent.photoUrl || "",
      whatsappNumber: agent.whatsappNumber,
      isActive: agent.isActive,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formData.name || !formData.whatsappNumber) return;

    if (editingAgent) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? { ...a, ...formData, photoUrl: formData.photoUrl || undefined }
            : a
        )
      );
    } else {
      const newAgent: ChatAgent = {
        id: Date.now().toString(),
        ...formData,
        photoUrl: formData.photoUrl || undefined,
        sortOrder: agents.length + 1,
      };
      setAgents((prev) => [...prev, newAgent]);
    }
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  function handleToggleActive(id: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chat Agents</h2>
          <p className="text-gray-600">Manage WhatsApp chat agents shown on the website.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      {/* Info card */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-start gap-3 p-4">
          <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          <div className="text-sm text-green-800">
            <p className="font-semibold">How it works:</p>
            <p className="mt-1 text-green-700">
              Active agents appear in the WhatsApp chat widget on all pages. If multiple agents are active,
              visitors can choose who to chat with. Each agent links to their own WhatsApp number.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className={cn(
              "group relative overflow-hidden transition-all",
              !agent.isActive && "opacity-60"
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.photoUrl} alt={agent.name} />
                      <AvatarFallback className="bg-green-100 text-sm font-bold text-green-700">
                        {agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {agent.isActive && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {agent.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="font-mono text-xs">{agent.whatsappNumber}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(agent)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(agent.id)}
                >
                  {agent.isActive ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(agent.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <MessageCircle className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No chat agents found.</p>
          <Button variant="outline" className="mt-4" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first agent
          </Button>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name">Name</Label>
              <Input
                id="agent-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Ali Kazmi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-role">Role</Label>
              <Input
                id="agent-role"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Admissions, Director, Support"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-photo">Photo URL</Label>
              <Input
                id="agent-photo"
                value={formData.photoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, photoUrl: e.target.value }))}
                placeholder="/brand/almustafa-logo.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-whatsapp">WhatsApp Number</Label>
              <Input
                id="agent-whatsapp"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="+923350555696"
              />
              <p className="text-[11px] text-gray-500">Include country code (e.g. +92 for Pakistan)</p>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="agent-active">Active</Label>
              <Switch
                id="agent-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.whatsappNumber}>
              {editingAgent ? "Save Changes" : "Add Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
