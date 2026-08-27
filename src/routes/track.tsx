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
  const [searchEmail, setSearchEmail] = useState("");
  const [searchToken, setSearchToken] = useState("");
  const [queriedId, setQueriedId] = useState("");
  const [queriedEmail, setQueriedEmail] = useState("");
  const [queriedToken, setQueriedToken] = useState("");
  const {
    data: application,
    isLoading,
    isError,
  } = useApplication(queriedId, queriedEmail, queriedToken);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchId.trim() && searchEmail.trim() && searchToken.trim()) {
      setQueriedId(searchId.trim());
      setQueriedEmail(searchEmail.trim());
      setQueriedToken(searchToken.trim());
    }
  }

  return (
    <>
      <PageHero
        title={
          <>
            Track your
            <br />
            application.
          </>
        }
        description="Enter your application number, application email, and private tracking token to check your status."
        backgroundImage={heroBg}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-2xl">
            <Card className="border-gold/20">
              <CardContent className="px-6 py-8 sm:px-8">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
                >
                  <div className="min-w-0 flex-1">
                    <label htmlFor="application-number" className="sr-only">
                      Application number
                    </label>
                    <Input
                      id="application-number"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="Application number (e.g. AMA-2026-0001)"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="application-email" className="sr-only">
                      Application email
                    </label>
                    <Input
                      id="application-email"
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="Email used in the application"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="tracking-token" className="sr-only">
                      Private tracking token
                    </label>
                    <Input
                      id="tracking-token"
                      value={searchToken}
                      onChange={(e) => setSearchToken(e.target.value)}
                      placeholder="Private tracking token"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 shrink-0">
                    <Search className="h-4 w-4" /> Track
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8">
              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-navy" />
                  <span className="text-sm text-muted-foreground">Searching...</span>
                </div>
              )}

              {(isError ||
                (queriedId && queriedEmail && queriedToken && !isLoading && !application)) && (
                <Card className="border-destructive/30">
                  <CardContent className="flex items-center gap-3 px-6 py-8">
                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        No matching application found
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Check both values and try again. The format is AMA-YYYY-XXXX.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {application && (
                <Card className="border-gold/20">
                  <CardContent className="px-6 py-8 sm:px-8">
                    <div className="mb-6 border-b border-border pb-4">
                      <p className="text-xs text-muted-foreground">Application number</p>
                      <p className="font-display text-xl font-black text-navy-deep">
                        {application.application_number}
                      </p>
                    </div>

                    <StatusTracker
                      status={application.status}
                      createdAt={application.created_at}
                      reviewedAt={application.reviewed_at}
                    />
                  </CardContent>
                </Card>
              )}

              {(!queriedId || !queriedEmail || !queriedToken) && !isLoading && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Enter your application number, email, and private tracking token above to view
                    the status.
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
