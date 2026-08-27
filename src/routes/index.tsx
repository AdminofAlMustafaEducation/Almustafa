import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Mail,
  MapPin,
  Navigation,
  Phone,
} from "lucide-react";
import campusExterior from "@/assets/gallery/campus-exterior.jpg";
import library from "@/assets/gallery/library.jpg";
import studentPortrait from "@/assets/gallery/student-portrait.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import teacherBoard from "@/assets/gallery/teacher-board.jpg";
import { FacultyCard } from "@/components/faculty-card";
import { academy, branches, faculty, programs } from "@/data/faculty";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Al-Mustafa Academy | Premier Evening Coaching in G-11/2 & G-10 Islamabad",
      description:
        "Registration open for Juniors (1-8), Matric and F.Sc. Trusted since 1998 in G-11/2 & G-10 Islamabad with senior college lecturers, small batches and proven results.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const featured = faculty.slice(0, 3);
  const programIcons = [BookOpen, FlaskConical, GraduationCap];
  const faqs = [
    {
      question: "Which classes and programs does Al-Mustafa Academy offer?",
      answer:
        "The academy currently offers Juniors (Class 1-8), Matric and F.Sc programs, with separate teaching focus according to each level.",
    },
    {
      question: "Are classes suitable for students who need extra attention?",
      answer:
        "Yes. Focused batches and regular follow-up help teachers notice gaps early and support students more closely.",
    },
    {
      question: "Do you prepare students for board-style exams?",
      answer:
        "Yes. Teaching is structured around concept clarity, revision, weekly testing and exam-oriented preparation.",
    },
    {
      question: "Can parents visit the campus before admission?",
      answer:
        "Yes. Families are encouraged to visit, see the environment and understand the routine before confirming admission.",
    },
    {
      question: "Where are the campuses located?",
      answer: "The academy has two campuses in G-11/2 and G-10 Islamabad.",
    },
    {
      question: "How can we start the admission process?",
      answer:
        "Call the academy or use the apply page. The team will guide you toward the right program and next steps.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="container-fluid relative grid items-center gap-10 py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold text-gold-soft">Admissions open for 2026</p>
            <h1 className="headline-balance mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Evening coaching families trust.
            </h1>
            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-white/85 sm:text-lg">
              Juniors, Matric and F.Sc in G-11 and G-10. Senior lecturers, small batches, weekly
              tests.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-sm font-bold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Apply <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View programs
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={studentsGroup}
                alt="Students at Al-Mustafa Academy"
                className="aspect-[4/3] w-full object-cover"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-10 sm:py-12">
        <div className="container-fluid grid grid-cols-2 gap-6 lg:grid-cols-4">
          {[
            { value: "1998", label: "Serving Islamabad families" },
            { value: "1-12", label: "Junior to F.Sc coverage" },
            { value: "6 days", label: "Weekly evening routine" },
            { value: "2", label: "Campuses in G-11 and G-10" },
          ].map((item) => (
            <div key={item.value}>
              <div className="font-display text-3xl font-black text-navy-deep">{item.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance max-w-2xl font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl lg:text-5xl">
            Programs shaped for each stage.
          </h2>
          <p className="mt-4 max-w-[65ch] text-base text-muted-foreground">
            Every level has its own pace and pressure. We adjust the structure instead of treating
            every batch the same.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="grid gap-5">
              {programs.slice(0, 2).map((program, i) => {
                const Icon = programIcons[i] ?? BookOpen;
                return (
                  <Link
                    key={program.title}
                    to="/programs"
                    className="paper-panel group block p-6 transition-transform hover:-translate-y-0.5 sm:p-8"
                  >
                    <Icon className="h-7 w-7 text-gold" />
                    <h3 className="mt-5 font-display text-2xl font-black text-navy-deep">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {program.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.subjects.slice(0, 4).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-navy-deep"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold">
                      See details <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
            {programs[2] ? (
              <Link
                to="/programs"
                className="paper-panel group relative overflow-hidden p-6 transition-transform hover:-translate-y-0.5 sm:p-8 lg:min-h-full"
              >
                <img
                  src={teacherBoard}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-15"
                  loading="lazy"
                  decoding="async"
                />
                <div className="relative flex h-full flex-col">
                  <GraduationCap className="h-7 w-7 text-gold" />
                  <h3 className="mt-5 font-display text-2xl font-black text-navy-deep">
                    {programs[2].title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {programs[2].description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {programs[2].subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-navy-deep"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-gold">
                    See details <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-fluid-section">
        <div className="container-fluid grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={teacherBoard}
                alt="Teacher writing on the chalkboard"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
              Good teachers, steady systems, and a culture that feels human.
            </h2>
            <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-muted-foreground">
              Al-Mustafa Academy began in 1998 with a single room and a clear idea: excellence is a
              quiet, daily practice. Today, senior lecturers from IMCB, ICB, Bahria College, APS
              Rawalpindi and Al-Kausar carry that same conviction across G-11/2 and G-10.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                {
                  title: "Senior college lecturers",
                  detail:
                    "Teachers who know how board-facing preparation should actually be paced.",
                },
                {
                  title: "Small, focused batches",
                  detail: "Students are seen, corrected and encouraged before confusion grows.",
                },
                {
                  title: "Weekly tests and feedback",
                  detail:
                    "Progress stays visible for both students and parents throughout the session.",
                },
              ].map((feature) => (
                <li key={feature.title}>
                  <div className="font-display text-lg font-bold text-navy-deep">
                    {feature.title}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.detail}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy-deep underline-offset-4 hover:underline"
            >
              About the academy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance max-w-2xl font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            Better outcomes come from routine, not noise.
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {[
              {
                title: "Senior teaching guidance",
                detail:
                  "Students learn from experienced lecturers who understand classroom pacing, exam patterns and concept-building.",
              },
              {
                title: "Weekly test rhythm",
                detail:
                  "Regular testing and revision keep progress visible, so weak areas are caught before they become bigger problems.",
              },
              {
                title: "Focused batch culture",
                detail:
                  "Smaller groups make it easier for teachers to notice confusion, correct mistakes and encourage consistency.",
              },
              {
                title: "Parent-aware follow-up",
                detail:
                  "The academy experience is built to feel transparent and reassuring for families, not just students.",
              },
            ].map((card) => (
              <div key={card.title} className="border-t border-border pt-5">
                <h3 className="font-display text-xl font-bold text-navy-deep">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-fluid-section text-white">
        <div className="container-fluid">
          <h2 className="headline-balance max-w-2xl font-display text-3xl font-black tracking-tight sm:text-4xl">
            From first inquiry to first class.
          </h2>
          <p className="mt-4 max-w-[65ch] text-base text-white/75">
            The admission journey is designed to feel clear and low-stress for both students and
            parents.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Talk to us",
                detail:
                  "Call, message or visit so we can understand the student's class level and needs.",
              },
              {
                title: "Choose the program",
                detail:
                  "We place students into Juniors, Matric or F.Sc according to the right learning stage.",
              },
              {
                title: "Meet the faculty plan",
                detail:
                  "Teachers explain the routine, timing, subjects and weekly follow-up before the session begins.",
              },
              {
                title: "Confirm admission",
                detail:
                  "Secure the seat and start with a clearer evening learning routine from day one.",
              },
            ].map((step) => (
              <div key={step.title}>
                <h3 className="font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
              Life inside the classrooms.
            </h2>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-deep underline-offset-4 hover:underline"
            >
              Open the gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4">
            <div className="col-span-12 overflow-hidden rounded-2xl md:col-span-7">
              <img
                src={campusExterior}
                alt="Campus at sunset"
                className="aspect-[4/3] h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="col-span-6 overflow-hidden rounded-2xl md:col-span-5">
              <img
                src={library}
                alt="Library reading corner"
                className="aspect-square h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="col-span-6 overflow-hidden rounded-2xl md:col-span-4">
              <img
                src={studentPortrait}
                alt="A focused student"
                className="aspect-[4/5] h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="col-span-12 overflow-hidden rounded-2xl md:col-span-8">
              <img
                src={teacherBoard}
                alt="Teacher at chalkboard"
                className="aspect-[16/9] h-full w-full object-cover md:aspect-[5/2]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="headline-balance max-w-xl font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
              The teachers who shape the difference.
            </h2>
            <Link
              to="/faculty"
              className="inline-flex items-center gap-2 text-sm font-bold text-navy-deep underline-offset-4 hover:underline"
            >
              Meet the faculty <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((member) => (
              <FacultyCard key={member.name} member={member} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid max-w-4xl">
          <blockquote className="headline-balance font-display text-2xl font-medium leading-snug text-navy-deep sm:text-3xl">
            &quot;They did not just teach my son Physics and Maths, they taught him how to
            think.&quot;
          </blockquote>
          <div className="mt-6 text-sm">
            <div className="font-bold text-navy-deep">A parent of an F.Sc graduate</div>
            <div className="text-muted-foreground">G-11, Islamabad</div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-fluid-section">
        <div className="container-fluid">
          <h2 className="headline-balance max-w-2xl font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
            Common questions from parents and students.
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="paper-panel rounded-2xl p-5 sm:p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-bold text-navy-deep">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-gradient py-14 sm:py-16">
        <div className="container-fluid flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
              Secure a seat for the new academic session.
            </h2>
            <p className="mt-3 text-base text-navy-deep/80">
              Visit the campus, speak to the team, and find the right batch before seats close.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${academy.phoneIntl}`}
              className="inline-flex items-center gap-2 rounded-full border border-navy-deep/20 px-6 py-3.5 text-sm font-bold text-navy-deep transition-colors hover:bg-white/40"
            >
              <Phone className="h-4 w-4" /> {academy.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mb-8 grid gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="headline-balance font-display text-3xl font-black tracking-tight text-navy-deep sm:text-4xl">
                Two campuses in G-11 and G-10.
              </h2>
              <p className="mt-4 max-w-xl text-base text-muted-foreground">
                Easy parking, well-lit evenings, and close to the neighbourhood.
              </p>
            </div>
            <div className="space-y-1 lg:col-span-4 lg:text-right">
              <a
                href={`tel:${academy.phoneIntl}`}
                className="inline-flex items-center gap-2 font-bold text-navy-deep hover:text-gold"
              >
                <Phone className="h-4 w-4" /> {academy.phone}
              </a>
              <div>
                <a
                  href={`mailto:${academy.email}`}
                  className="inline-flex break-all text-sm text-muted-foreground hover:text-navy-deep"
                >
                  <Mail className="mr-2 h-4 w-4 shrink-0" /> {academy.email}
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            <div className="overflow-hidden rounded-2xl lg:col-span-8">
              <iframe
                title="Al-Mustafa Academy on Google Maps"
                src={academy.mapsEmbed}
                width="100%"
                style={{ border: 0, display: "block", height: "clamp(280px, 50vw, 480px)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="grid gap-4 lg:col-span-4">
              {branches.map((branch) => (
                <div key={branch.id} className="paper-panel rounded-2xl p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold text-navy-deep">
                      {branch.label}
                    </h3>
                    <MapPin className="h-5 w-5 shrink-0 text-gold" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {branch.address}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{branch.hours}</p>
                  <a
                    href={branch.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-deep hover:text-gold"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Get directions
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
