import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Download, ExternalLink, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/hooks/use-notes";
import { SUBJECTS } from "@/lib/academy";

export const Route = createFileRoute("/portal/notes")({
  component: PortalNotes,
});

function PortalNotes() {
  // In real implementation, filter by student's class
  const { data: notes = [], isLoading } = useNotes({ published: true });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Notes & Study Materials</h1>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notes & Study Materials</h1>
        <p className="text-sm text-gray-500">Study materials shared by your teachers.</p>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No notes available yet.</p>
          <p className="text-xs text-gray-400">Your teachers will upload study materials here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const subject = SUBJECTS.find((s) => s.id === note.subject_id);

            return (
              <Card key={note.id} className="transition-all hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{note.title}</h3>
                        {note.description && (
                          <p className="mt-1 text-sm text-gray-500">{note.description}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {subject?.name || note.subject_id}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {note.class_id}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <span>
                        {new Date(note.created_at).toLocaleDateString("en-PK", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {note.file_path && (
                      <div className="mt-3">
                        <Button variant="outline" size="sm" asChild>
                          <a href={note.file_path} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-1 h-3 w-3" /> Download
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="text-center">
        <Link to="/portal" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
