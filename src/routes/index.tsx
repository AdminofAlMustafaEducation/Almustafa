import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  Navigation,
  Phone,
  Quote,
  Star,
  Users,
} from "lucide-react";
import campusExterior from "@/assets/gallery/campus-exterior.jpg";
import library from "@/assets/gallery/library.jpg";
import studentPortrait from "@/assets/gallery/student-portrait.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import teacherBoard from "@/assets/gallery/teacher-board.jpg";
import doodlePen from "@/assets/eduor/doodle-pen.png";
import heroStudent from "@/assets/eduor/hero-student.png";
import { FacultyCard } from "@/components/faculty-card";
import { HoverExpandGallery } from "@/components/hover-expand-gallery";
import { academy, branches, faculty, programs } from "@/data/faculty";
import { brochureImages } from "@/data/brochures";
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
  const programTones = [
    "from-mint/90 via-white to-cream/90",
    "from-cream/95 via-white to-lavender/85",
    "from-lavender/90 via-white to-mint/80",
  ];
  const proofStats = [
    { value: "1998", label: "serving Islamabad families" },
    { value: "1-12", label: "junior to F.Sc coverage" },
    { value: "6 days", label: "weekly evening routine" },
    { value: "2", label: "campuses in G-11 & G-10" },
  ];
  const newsUpdates = [
    "Admissions open for Juniors, Matric and F.Sc evening batches.",
    "Weekly tests and revision sessions continue across active batches.",
    "Campus visits are open for parents before confirming admission.",
  ];
  const achievementCards = [
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
  ];
  const admissionSteps = [
    {
      step: "01",
      title: "Talk to the academy",
      detail:
        "Call, message or visit the campus so we can understand the student's class level and academic needs.",
      icon: Phone,
    },
    {
      step: "02",
      title: "Choose the right program",
      detail:
        "We help families place students into Juniors, Matric or F.Sc according to the correct learning stage.",
      icon: BookOpen,
    },
    {
      step: "03",
      title: "Meet the faculty plan",
      detail:
        "Teachers explain the routine, timing, subjects and the style of weekly follow-up before the session begins.",
      icon: Users,
    },
    {
      step: "04",
      title: "Confirm admission",
      detail:
        "Secure the seat and start with a clearer, more structured evening learning routine from day one.",
      icon: Award,
    },
  ];
  const faqs = [
    {
      question: "Which classes and programs does Al-Mustafa Academy offer?",
      answer:
        "The academy currently offers Juniors (Class 1-8), Matric and F.Sc programs, with separate teaching focus according to each level.",
    },
    {
      question: "Are classes suitable for students who need extra attention?",
      answer:
        "Yes. The academy uses focused batches and regular follow-up, which helps teachers notice gaps early and support students more closely.",
    },
    {
      question: "Do you prepare students for board-style exams?",
      answer:
        "Yes. Teaching is structured around concept clarity, revision, weekly testing and exam-oriented preparation for school and board performance.",
    },
    {
      question: "Can parents visit the campus before admission?",
      answer:
        "Yes. Families are encouraged to visit, see the environment, ask questions and understand the routine before confirming admission.",
    },
    {
      question: "Where are the campuses located?",
      answer:
        "The academy has two campuses in G-11/2 and G-10 Islamabad.",
    },
    {
      question: "How can we start the admission process?",
      answer:
        "The quickest way is to call the academy or use the contact page. From there, the team can guide you toward the right program and next steps.",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-academic-hero text-white">
        <div aria-hidden className="soft-grid absolute inset-0 opacity-25" />
        <img
          src={doodlePen}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-8 top-20 hidden w-56 select-none opacity-55 lg:block xl:w-72"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />

        <div className="container-fluid relative grid items-center gap-8 py-fluid-hero lg:grid-cols-12 lg:gap-12">
          <div className="animate-fade-up lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-soft backdrop-blur sm:text-sm">
              <Megaphone className="h-4 w-4" />
              Admissions Open | 2026 Session
            </div>

            <h1 className="headline-balance mt-5 font-display text-fluid-hero font-black tracking-tight text-white sm:mt-6">
              2026-27
              <br className="hidden sm:block" />
              <span className="text-gold-soft">Premier Evening Coaching Academy</span>
            </h1>

            <p className="mt-6 max-w-2xl text-fluid-base text-white/90 sm:mt-7">
              Trusted since 1998 for Juniors, Matric and F.Sc. Senior college lecturers, small
              batches, weekly tests and parent-aware follow-up help students build stronger habits
              after school.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold transition-transform hover:scale-[1.04] sm:px-8 sm:py-4 sm:text-sm"
              >
                Apply for Admission <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition-transform hover:scale-[1.03] sm:px-6 sm:py-3.5 sm:text-sm"
              >
                Explore Programs <ArrowRight className="h-4 w-4 text-gold-soft" />
              </Link>
              <a
                href={academy.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold-soft"
              >
                See campus updates <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={academy.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold-soft"
              >
                Watch on YouTube <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="admission-ribbon mt-8 grid gap-3 rounded-[1.7rem] p-3 text-navy-deep sm:mt-10 sm:grid-cols-3 sm:p-4">
              {[
                { icon: Award, value: "27 Years", label: "community trust" },
                { icon: Users, value: "Our Faculty", label: "experienced teachers" },
                { icon: MapPin, value: "2 Campuses", label: "in G-11 & G-10" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={value} className="rounded-[1.25rem] bg-white/72 p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-gold" />
                    <div>
                      <div className="font-display text-lg font-black">{value}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                        {label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-white/85 sm:gap-4 sm:text-sm">
              <span className="stat-pill">Small batches</span>
              <span className="stat-pill">Weekly tests</span>
              <span className="stat-pill">Parent feedback</span>
            </div>
          </div>

          <div
            className="relative animate-fade-up lg:col-span-5"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="mx-auto max-w-md sm:max-w-lg">
              <HoverExpandGallery images={brochureImages} className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-8 sm:py-10">
        <div className="container-fluid grid gap-5 lg:grid-cols-12 lg:items-stretch">
          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {proofStats.map((item) => (
              <div key={item.value} className="proof-tile rounded-[1.35rem] p-5 sm:p-6">
                <div className="font-display text-2xl font-black text-navy-deep sm:text-3xl">
                  {item.value}
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="news-panel rounded-[1.35rem] p-5 lg:col-span-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-gradient text-white shadow-gold">
                <Megaphone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky">
                  Latest Updates
                </p>
                <h2 className="font-display text-xl font-black text-navy-deep">
                  Admission desk is active now.
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {newsUpdates.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-alt bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Our Programs
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h1 font-black text-navy-deep">
              Programs built with <span className="scribble-underline">care</span> for each stage.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-fluid-base text-muted-foreground">
              Every level has its own pace, pressure and needs. The academy structure is adjusted
              for that instead of treating every batch the same.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {programs.map((program, i) => {
              const Icon = programIcons[i] ?? BookOpen;

              return (
                <Link
                  key={program.title}
                  to="/programs"
                  className={`card-lift group relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br ${programTones[i] ?? programTones[0]} p-6 shadow-soft sm:p-8 ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-[1.35rem] bg-white text-navy-deep shadow-soft sm:h-16 sm:w-16">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <span className="rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-sky">
                        Program 0{i + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 font-display text-xl font-black leading-tight text-navy-deep sm:text-2xl">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-fluid-sm text-navy-deep/72">{program.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.subjects.slice(0, 4).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-wider text-navy-deep/80"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold transition-all group-hover:gap-3">
                      See details <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 sm:mb-14">
            <div className="lg:col-span-7">
              <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky" />
                Results and Achievements
              </p>
              <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
                Better outcomes are built on <span className="scribble-underline">routine</span>,
                not noise.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-fluid-base text-muted-foreground lg:max-w-lg lg:ml-auto lg:text-right">
                We do not rely on flashy promises. We focus on the quieter systems that help
                students improve steadily across the session.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {achievementCards.map((card, index) => (
              <div key={card.title} className="paper-panel card-lift rounded-[1.7rem] p-5 sm:p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.26em] text-sky">
                  0{index + 1}
                </div>
                <h3 className="mt-3 font-display text-xl font-black text-navy-deep">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-mint/35 py-fluid-section">
        <div
          aria-hidden
          className="absolute right-0 top-10 h-64 w-64 rounded-full bg-lavender/60 blur-3xl"
        />
        <div className="container-fluid relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:mx-0 lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/30 p-3 shadow-elegant backdrop-blur-md sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.45rem]">
                <img
                  src={teacherBoard}
                  alt="Teacher writing on the chalkboard"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="glass-panel absolute -bottom-6 right-2 flex items-center gap-3 rounded-2xl px-4 py-3 sm:right-6 sm:px-5 sm:py-4 lg:right-12">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient sm:h-12 sm:w-12">
                <GraduationCap className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="font-display text-xl font-black leading-none text-navy-deep sm:text-2xl">
                  27+
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
                  Years of teaching
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 hidden aspect-square w-40 overflow-hidden rounded-3xl border-4 border-white shadow-elegant lg:block xl:w-48">
              <img
                src={studentPortrait}
                alt="A focused student"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              About the Academy
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              Good teachers, steady systems, and a culture that feels{" "}
              <span className="scribble-underline">human.</span>
            </h2>
            <p className="mt-5 text-fluid-base text-navy-deep/72 sm:mt-6">
              Al-Mustafa Academy began in 1998 with a single room and a clear idea: excellence is a
              quiet, daily practice. Today, eleven senior lecturers from IMCB, ICB, Bahria College,
              APS Rawalpindi and Al-Kausar               carry that same conviction across G-11/2 and G-10 campuses.
            </p>

            <div className="mt-7 space-y-4">
              {[
                {
                  title: "Senior College Lecturers",
                  detail:
                    "Experienced teachers who know how board-facing preparation should actually be paced.",
                },
                {
                  title: "Small, Focused Batches",
                  detail: "Students are seen, corrected and encouraged before confusion grows.",
                },
                {
                  title: "Weekly Tests and Feedback",
                  detail:
                    "Progress stays visible for both students and parents throughout the session.",
                },
              ].map((feature, i) => (
                <div key={feature.title} className="paper-panel flex items-start gap-4 p-4 sm:p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-navy-deep font-display text-sm font-black text-white">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="font-display text-lg font-black text-navy-deep">
                      {feature.title}
                    </div>
                    <div className="mt-1 text-fluid-sm text-muted-foreground">{feature.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy sm:mt-10 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              About us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell-alt bg-cream py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Admissions Process
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              A simple path from <span className="scribble-underline">first inquiry</span> to first
              class.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-fluid-base text-muted-foreground">
              The admission journey is designed to feel clear and low-stress for both students and
              parents.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 xl:grid-cols-4">
            {admissionSteps.map(({ step, title, detail, icon: Icon }) => (
              <div key={step} className="paper-panel card-lift rounded-[1.8rem] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-deep text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-sky">
                    {step}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-black text-navy-deep">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-gold-gradient py-4 text-white sm:py-5">
        <div className="animate-marquee flex gap-8 whitespace-nowrap font-display text-lg font-black uppercase tracking-wide sm:gap-12 sm:text-xl md:text-2xl">
          {Array.from({ length: 2 }).map((_, block) => (
            <div key={block} className="flex shrink-0 items-center gap-8 sm:gap-12">
              {[
                "Discipline",
                "|",
                "Sincerity",
                "|",
                "Excellence",
                "|",
                "Care",
                "|",
                "Mastery",
                "|",
                "Tradition",
                "|",
              ].map((word, i) => (
                <span
                  key={`${block}-${i}`}
                  className={i % 2 ? "text-sm opacity-75 sm:text-base" : ""}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell-alt bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
            <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Life Inside
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h1 font-black text-navy-deep">
              Glimpses from our <span className="scribble-underline">classrooms.</span>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5">
            <div className="group col-span-12 overflow-hidden rounded-[1.75rem] border border-white/65 shadow-soft md:col-span-7">
              <div className="relative aspect-[4/3]">
                <img
                  src={campusExterior}
                  alt="Campus at sunset"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-deep/85 to-transparent p-5 text-white">
                  <div className="text-[10px] uppercase tracking-[0.26em] text-gold-soft">
                    Campus atmosphere
                  </div>
                  <div className="mt-1 font-display text-2xl font-black">
                    A calm evening setting
                  </div>
                </div>
              </div>
            </div>

            <div className="group col-span-6 overflow-hidden rounded-[1.75rem] border border-white/65 shadow-soft md:col-span-5">
              <img
                src={library}
                alt="Library reading corner"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group col-span-6 overflow-hidden rounded-[1.75rem] border border-white/65 shadow-soft md:col-span-3">
              <img
                src={studentPortrait}
                alt="Student reading"
                className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group col-span-12 overflow-hidden rounded-[1.75rem] border border-white/65 shadow-soft md:col-span-5">
              <img
                src={studentsGroup}
                alt="Students collaborating"
                className="aspect-[5/4] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group relative col-span-12 overflow-hidden rounded-[1.75rem] border border-white/65 shadow-soft md:col-span-4">
              <img
                src={teacherBoard}
                alt="Teacher at chalkboard"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <Link
                to="/gallery"
                className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/78 text-center text-primary-foreground opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gold">View full</p>
                <p className="font-display text-2xl font-black sm:text-3xl">Gallery</p>
                <ArrowRight className="mt-2 h-5 w-5 text-gold" />
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy sm:px-7 sm:py-3.5 sm:text-sm"
            >
              Open the photo gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-lavender/35 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 sm:mb-14">
            <div className="lg:col-span-7">
              <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky" />
                Our Faculty
              </p>
              <h2 className="headline-balance mt-4 font-display text-fluid-h1 font-black text-navy-deep">
                The teachers who <span className="scribble-underline">shape</span> the difference.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                to="/faculty"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold transition-transform hover:scale-105 sm:px-7 sm:py-3.5 sm:text-sm"
              >
                Meet our faculty <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featured.map((member) => (
              <FacultyCard key={member.name} member={member} featured />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="paper-panel mx-auto max-w-5xl p-6 sm:p-8 md:p-10">
            <div className="grid gap-6 text-center md:grid-cols-12 md:items-center md:gap-10 md:text-left">
              <div className="flex justify-center md:col-span-2 md:block">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient shadow-gold sm:h-20 sm:w-20">
                  <Quote className="h-7 w-7 -scale-x-100 text-white sm:h-9 sm:w-9" />
                </span>
              </div>
              <div className="md:col-span-10">
                <blockquote className="headline-balance font-display text-fluid-h3 font-medium text-navy-deep">
                  &quot;They did not just teach my son Physics and Maths, they taught him how to{" "}
                  <span className="scribble-underline">think</span>. The teachers genuinely care,
                  and the results speak for themselves.&quot;
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-4 sm:mt-8 md:justify-start">
                  <div className="flex gap-0.5 text-gold">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-gold" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-navy-deep">A parent of an F.Sc graduate</div>
                    <div className="text-muted-foreground">G-11, Islamabad</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell-alt bg-lavender/25 py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              Frequently Asked Questions
            </p>
            <h2 className="headline-balance mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              Common questions from{" "}
              <span className="scribble-underline">parents and students.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-fluid-base text-muted-foreground">
              A few practical answers to the questions families usually ask before visiting the
              academy.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-14">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="paper-panel rounded-[1.7rem] p-5 sm:p-6">
                <summary className="cursor-pointer list-none font-display text-lg font-black text-navy-deep sm:text-xl">
                  <span className="flex items-start gap-4">
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.26em] text-sky">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                </summary>
                <p className="mt-4 pl-8 text-sm leading-relaxed text-muted-foreground sm:pl-10">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gold-gradient py-12 sm:py-16">
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-72 w-72 rounded-full border-2 border-dashed border-white/30"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full border-2 border-dashed border-white/20"
        />
        <div className="container-fluid">
          <div className="glass-panel rounded-[2rem] bg-white/14 p-6 text-white sm:p-8 md:grid md:grid-cols-3 md:items-center md:gap-8">
            <div className="md:col-span-2">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 sm:text-xs">
                <span className="inline-block h-2 w-2 bg-white" /> Admissions Open | 2026
              </p>
              <h3 className="headline-balance mt-3 font-display text-fluid-h2 font-black">
                Secure your child&apos;s seat for the new academic session.
              </h3>
              <p className="mt-4 max-w-2xl text-sm text-white/84 sm:text-base">
                Visit the campus, speak to the academy team, and find the right batch before seats
                close.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:justify-end">
              <a
                href={`tel:${academy.phoneIntl}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-deep shadow-elegant transition-colors hover:bg-navy-deep hover:text-white sm:px-7 sm:py-4 sm:text-sm"
              >
                <Phone className="h-5 w-5" /> Call {academy.phone}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/12 sm:px-7 sm:py-4 sm:text-sm"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-mint/30 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 sm:mb-10">
            <div className="lg:col-span-8">
              <p className="section-kicker text-xs font-bold uppercase tracking-[0.22em] text-sky sm:text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-sky" />
                Find Us
              </p>
              <h2 className="headline-balance mt-4 font-display text-fluid-h1 font-black text-navy-deep">
                Right here in <span className="scribble-underline">G-11 & G-10.</span>
              </h2>
              <p className="mt-5 max-w-xl text-fluid-base text-navy-deep/72">
                Two campuses in G-11/2 and G-10, offering easy
                parking, well-lit evenings, and right next to your neighbourhood.
              </p>
            </div>
            <div className="space-y-2 break-words lg:col-span-4 lg:text-right">
              <a
                href={`tel:${academy.phoneIntl}`}
                className="inline-flex items-center gap-2 border-b-2 border-gold pb-1 font-bold text-navy-deep transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4" /> {academy.phone}
              </a>
              <div>
                <a
                  href={`mailto:${academy.email}`}
                  className="inline-flex break-all text-xs text-muted-foreground transition-colors hover:text-navy-deep sm:text-sm"
                >
                  <Mail className="mr-2 h-4 w-4 shrink-0" /> {academy.email}
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-12 sm:gap-6">
            <div className="overflow-hidden rounded-[1.9rem] border border-white/65 bg-card shadow-elegant lg:col-span-8">
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

            <div className="grid gap-4 lg:col-span-4 sm:grid-cols-2 lg:grid-cols-1">
              {branches.map((branch, i) => (
                <div key={branch.id} className="paper-panel card-lift rounded-[1.7rem] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky">
                        Branch 0{i + 1}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-black text-navy-deep sm:text-xl">
                        {branch.label}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-xl bg-gold-gradient p-2 shadow-md sm:p-2.5">
                      <MapPin className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {branch.address}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    {branch.hours}
                  </p>
                  <a
                    href={branch.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 border-b-2 border-gold pb-0.5 text-xs font-bold text-navy-deep transition-colors hover:text-gold sm:text-sm"
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
