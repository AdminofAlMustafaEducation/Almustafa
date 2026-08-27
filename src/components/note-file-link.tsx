import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getNoteFileUrl } from "@/hooks/use-notes";

type NoteFileLinkProps = {
  filePath: string;
  children: ReactNode;
};

export function NoteFileLink({ filePath, children }: NoteFileLinkProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSignedUrl(null);
    setFailed(false);

    void getNoteFileUrl(filePath)
      .then((url) => {
        if (!cancelled) setSignedUrl(url || null);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  if (failed) {
    return (
      <Button variant="outline" size="sm" disabled>
        File unavailable
      </Button>
    );
  }

  if (!signedUrl) {
    return (
      <Button variant="outline" size="sm" disabled>
        Preparing file…
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={signedUrl} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  );
}
