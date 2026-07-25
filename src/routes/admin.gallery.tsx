import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Image, Upload, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

type GalleryItem = {
  id: string;
  url: string;
  caption: string;
  category: string;
  sort_order: number;
  is_active: boolean;
};

const categories = ["all", "campus", "classroom", "events", "sports"] as const;

const mockGallery: GalleryItem[] = [
  { id: "1", url: "/gallery/campus-exterior.jpg", caption: "Main Campus, G-11/2", category: "campus", sort_order: 1, is_active: true },
  { id: "2", url: "/gallery/teacher-board.jpg", caption: "Mathematics in motion", category: "classroom", sort_order: 2, is_active: true },
  { id: "3", url: "/gallery/students-group.jpg", caption: "Group study session", category: "events", sort_order: 3, is_active: true },
  { id: "4", url: "/gallery/library.jpg", caption: "The Reading Corner", category: "campus", sort_order: 4, is_active: true },
  { id: "5", url: "/gallery/lab.jpg", caption: "Science Lab", category: "campus", sort_order: 5, is_active: false },
  { id: "6", url: "/gallery/award.jpg", caption: "Recognising excellence", category: "events", sort_order: 6, is_active: true },
  { id: "7", url: "/gallery/sports-day.jpg", caption: "Annual Sports Day", category: "sports", sort_order: 7, is_active: true },
  { id: "8", url: "/gallery/empty-classroom.jpg", caption: "Where lessons begin", category: "classroom", sort_order: 8, is_active: true },
];

function AdminGallery() {
  const [images, setImages] = useState<GalleryItem[]>(mockGallery);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filtered =
    categoryFilter === "all"
      ? images
      : images.filter((img) => img.category === categoryFilter);

  function handleToggleActive(id: string) {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, is_active: !img.is_active } : img)),
    );
  }

  function handleDelete(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function handleDragStart(id: string) {
    setDraggedId(id);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;
    setImages((prev) => {
      const updated = [...prev];
      const dragIdx = updated.findIndex((i) => i.id === draggedId);
      const dropIdx = updated.findIndex((i) => i.id === targetId);
      const [removed] = updated.splice(dragIdx, 1);
      updated.splice(dropIdx, 0, removed);
      return updated.map((img, i) => ({ ...img, sort_order: i + 1 }));
    });
    setDraggedId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
          <p className="text-gray-600">Manage academy photos and images.</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">
          {filtered.length} image{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((img) => (
          <Card
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(img.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(img.id)}
            className={cn(
              "group relative overflow-hidden transition-opacity",
              !img.is_active && "opacity-60",
              draggedId === img.id && "ring-2 ring-primary",
            )}
          >
            <div className="aspect-square bg-gray-100">
              <img
                src={img.url}
                alt={img.caption}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {img.caption}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {img.category}
                  </Badge>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    className="cursor-grab rounded p-1 text-gray-400 hover:text-gray-600"
                    title="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(img.id)}
                >
                  {img.is_active ? (
                    <>
                      <Eye className="mr-1 h-3 w-3" />
                      Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-1 h-3 w-3" />
                      Inactive
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(img.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Image className="h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm text-gray-500">No images found.</p>
        </div>
      )}
    </div>
  );
}
