import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { StatusTracker } from "@/components/status-tracker";
import { useApplication } from "@/hooks/use-admissions";
import { buildPageHead } from "@/lib/seo";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/track")({
  head: () =>
    buildPageHead({
      title: "Track Application | Al-Mustafa Academy",
      description:
        "Check the status of your admission application at Al-Mustafa Academy. Enter your application number to see the current status.",
      path: "/track",
    }),
  component: TrackPage,
});

function TrackPage() {
  const [searchId, setSearchId] = useState("");
  const [queriedId, setQueriedId] = useState("");
  const { data: application, isLoading, isError } = useApplication(queriedId);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchId.trim()) {
      setQueriedId(searchId.trim());
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Application Status"
        title={
          <>
            Track your
            <br />
            <em className="font-serif-elegant text-shimmer">application.</em>
          </>
        }
        description="Enter your application number to check the current status of your admission application to Al-Mustafa Academy."
        backgroundImage={heroBg}
        stats={[
          { value: "24/7", label: "online tracking" },
          { value: "Real-time", label: "status updates" },
          { value: "Simple", label: "enter & search" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-2xl">
            {/* Search form */}
            <Card className="border-gold/20">
              <CardContent className="px-6 py-8 sm:px-8">
                <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <Input
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Enter application number (e.g. AMA-2026-0001)"
                      className="h-12 text-base"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 shrink-0">
                    <Search className="h-4 w-4" /> Track
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="mt-8">
              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-navy" />
                  <span className="text-sm text-muted-foreground">Searching…</span>
                </div>
              )}

              {isError && (
                <Card className="border-destructive/30">
                  <CardContent className="flex items-center gap-3 px-6 py-8">
                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        Application not found
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Please check the application number and try again. The format is AMA-YYYY-XXXX.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {application && (
                <Card className="border-gold/20">
                  <CardContent className="px-6 py-8 sm:px-8">
                    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Application Number
                        </p>
                        <p className="font-display text-xl font-black text-navy-deep">
                          {application.application_number}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Applicant
                        </p>
                        <p className="text-sm font-semibold text-navy-deep">
                          {application.student_name}
                        </p>
                      </div>
                    </div>

                    <StatusTracker
                      status={application.status}
                      createdAt={application.created_at}
                      reviewedAt={application.reviewed_at}
                      reviewerNotes={application.reviewer_notes}
                    />
                  </CardContent>
                </Card>
              )}

              {!queriedId && !isLoading && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Enter your application number above to view the status.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Try <span className="font-mono font-semibold">AMA-2026-0001</span> for a demo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
