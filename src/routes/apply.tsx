import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { ApplicationWizard } from "@/components/application-wizard";
import { buildPageHead } from "@/lib/seo";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/apply")({
  head: () =>
    buildPageHead({
      title: "Apply for Admission | Al-Mustafa Academy, G-11/2 Islamabad",
      description:
        "Submit your online admission application for Class 9-12 at Al-Mustafa Academy. Matric and F.Sc coaching in G-11/2 Islamabad.",
      path: "/apply",
    }),
  component: ApplyPage,
});

function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions Open"
        title={
          <>
            Apply for
            <br />
            <em className="font-serif-elegant text-shimmer">admission.</em>
          </>
        }
        description="Fill out the form below to apply for classes 9 through 12 at Al-Mustafa Academy. It only takes a few minutes — submit once and track your status online."
        backgroundImage={heroBg}
        stats={[
          { value: "9-12", label: "classes available" },
          { value: "3", label: "programs offered" },
          { value: "2", label: "campus locations" },
          { value: "1998", label: "trusted since" },
        ]}
      />

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-3xl">
            <ApplicationWizard />
          </div>
        </div>
      </section>
    </>
  );
}
