import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  FlaskConical,
  GraduationCap,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Play,
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
import { academy, branches, faculty, programs } from "@/data/faculty";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Al-Mustafa Academy | Premier Evening Coaching in G-11/2 Islamabad",
      description:
        "Registration open for Juniors (1-8), Matric and F.Sc. Trusted since 1998 in G-11/2 Islamabad with senior college lecturers, small batches and proven results.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  const featured = faculty.slice(0, 3);
  const programIcons = [BookOpen, FlaskConical, GraduationCap];

  return (
    <>
      <section className="relative overflow-hidden bg-pastel">
        <img
          src={doodlePen}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-8 top-24 hidden w-56 select-none opacity-70 lg:block xl:w-72"
        />
        <div aria-hidden className="pointer-events-none absolute right-[6%] top-[18%] hidden h-[28rem] w-[28rem] rounded-full border-2 border-dashed border-gold/40 xl:block 2xl:h-[34rem] 2xl:w-[34rem] animate-spin-slow" />
        <div aria-hidden className="pointer-events-none absolute right-[12%] top-[28%] hidden h-[20rem] w-[20rem] rounded-full border-2 border-dashed border-sky/40 xl:block 2xl:h-[24rem] 2xl:w-[24rem]" />

        <div className="container-fluid relative grid items-center gap-8 py-fluid-hero md:grid-cols-12 md:gap-10">
          <div className="animate-fade-up md:col-span-7">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 bg-sky" />
              Welcome to Al-Mustafa
              <span className="inline-block h-2 w-2 bg-sky" />
            </p>

            <h1 className="mt-5 font-display text-fluid-hero font-black tracking-tight text-navy-deep sm:mt-6">
              Bright minds <br className="hidden sm:block" />
              deserve a <span className="scribble-underline">brighter</span> <br className="hidden sm:block" />
              evening academy.
            </h1>

            <p className="mt-6 max-w-xl text-fluid-base text-navy-deep/70 sm:mt-7">
              Trusted in G-11/2 Islamabad since 1998. Senior college lecturers teaching Juniors, Matric and F.Sc, with the discipline, care and proven results parents talk about.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-9">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-gold transition-transform hover:scale-[1.04] sm:px-8 sm:py-4 sm:text-sm"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={academy.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 font-semibold text-navy-deep"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-deep text-white shadow-elegant transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                  <Play className="h-4 w-4 fill-white" />
                </span>
                <span className="text-xs sm:text-sm">Watch our story</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-navy-deep/70 sm:mt-12 sm:gap-x-8 sm:text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold" /> 27 years trusted
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gold" /> 11 senior lecturers
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> 2 G-11/2 campuses
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up md:col-span-5" style={{ animationDelay: "0.15s" }}>
            <div className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md">
              <div aria-hidden className="absolute inset-6 rounded-full bg-white/50 blur-2xl" />
              <img
                src={heroStudent}
                alt="A bright student ready for evening coaching at Al-Mustafa Academy"
                className="relative h-full w-full object-contain drop-shadow-2xl"
                loading="eager"
                width={1024}
                height={1024}
              />

              <div className="absolute left-0 top-2 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-elegant sm:-left-4 sm:top-4 sm:gap-3 sm:px-4 sm:py-3 animate-wiggle">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-gradient sm:h-10 sm:w-10">
                  <CalendarCheck className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground sm:text-[10px]">
                    Since
                  </div>
                  <div className="font-display text-sm font-bold text-navy-deep sm:text-base">1998</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-0 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-elegant sm:-right-6 sm:bottom-6 sm:gap-3 sm:px-4 sm:py-3">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <div className="leading-tight">
                  <div className="font-display text-xs font-bold text-navy-deep sm:text-sm">Loved by parents</div>
                  <div className="text-[9px] text-muted-foreground sm:text-[10px]">G-11/2 community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 bg-sky" />
              Our Programs
              <span className="inline-block h-2 w-2 bg-sky" />
            </p>
            <h2 className="mt-4 font-display text-fluid-h1 font-black text-navy-deep">
              Programs built for <br className="hidden md:block" />
              <span className="scribble-underline">every</span> stage.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {programs.map((program, i) => {
              const Icon = programIcons[i] ?? BookOpen;
              const tones = [
                { ring: "bg-mint", chip: "bg-sky text-white" },
                { ring: "bg-cream", chip: "bg-gold text-white" },
                { ring: "bg-lavender", chip: "bg-navy-deep text-white" },
              ];
              const tone = tones[i] ?? tones[0];

              return (
                <Link
                  key={program.title}
                  to="/programs"
                  className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant sm:p-8 ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <div className={`absolute -top-6 left-8 h-12 w-16 rounded-b-2xl ${tone.ring}`} />
                  <div className="relative">
                    <div className={`grid h-14 w-14 place-items-center rounded-full ${tone.chip} shadow-md sm:h-16 sm:w-16`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold leading-tight text-navy-deep sm:mt-6 sm:text-2xl">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-fluid-sm text-muted-foreground">
                      {program.description.split(".")[0]}.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {program.subjects.slice(0, 4).map((subject) => (
                        <span
                          key={subject}
                          className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wider text-navy-deep/70"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold transition-all group-hover:gap-3 sm:mt-6">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-mint/40 py-fluid-section">
        <div aria-hidden className="absolute right-0 top-10 h-64 w-64 rounded-full bg-lavender/60 blur-3xl" />
        <div className="container-fluid relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="relative mx-auto w-full max-w-md lg:col-span-6 lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-elegant sm:rounded-[2rem]">
              <img
                src={teacherBoard}
                alt="Teacher writing on the chalkboard"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-6 right-2 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-elegant sm:right-6 sm:px-5 sm:py-4 lg:right-12">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient sm:h-12 sm:w-12">
                <GraduationCap className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="font-display text-xl font-black leading-none text-navy-deep sm:text-2xl">27+</div>
                <div className="text-[10px] text-muted-foreground sm:text-xs">Years teaching</div>
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
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 bg-sky" />
              About the Academy
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 font-black text-navy-deep">
              Where good teachers <br />
              raise <span className="scribble-underline">great</span> students.
            </h2>
            <p className="mt-5 text-fluid-base text-navy-deep/70 sm:mt-6">
              Al-Mustafa Academy began in 1998 with a single room and a clear idea - excellence is a quiet, daily practice. Today, eleven senior lecturers from IMCB, ICB, Bahria College, APS Rawalpindi and Al-Kausar share that same conviction across two G-11/2 campuses.
            </p>

            <ul className="mt-6 space-y-4 sm:mt-8">
              {[
                { title: "Senior College Lecturers", detail: "Taught by the people who set and mark your child's papers." },
                { title: "Small, Focused Batches", detail: "Personal attention so no student is ever invisible." },
                { title: "Weekly Tests and Feedback", detail: "Real progress measured every week, never guessed." },
              ].map((feature) => (
                <li key={feature.title} className="flex items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-gradient text-[10px] font-black uppercase text-white">
                    OK
                  </span>
                  <div>
                    <div className="font-display font-bold text-navy-deep">{feature.title}</div>
                    <div className="text-fluid-sm text-muted-foreground">{feature.detail}</div>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy sm:mt-10 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              About us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gold-gradient py-4 text-white overflow-hidden sm:py-5">
        <div className="animate-marquee flex gap-8 whitespace-nowrap font-display text-lg font-black uppercase tracking-wide sm:gap-12 sm:text-xl md:text-2xl">
          {Array.from({ length: 2 }).map((_, block) => (
            <div key={block} className="flex shrink-0 items-center gap-8 sm:gap-12">
              {["Discipline", "*", "Sincerity", "*", "Excellence", "*", "Care", "*", "Mastery", "*", "Tradition", "*"].map((word, i) => (
                <span key={`${block}-${i}`} className={i % 2 ? "text-sm opacity-80 sm:text-base" : ""}>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
              <span className="inline-block h-2 w-2 bg-sky" /> Life Inside <span className="inline-block h-2 w-2 bg-sky" />
            </p>
            <h2 className="mt-4 font-display text-fluid-h1 font-black text-navy-deep">
              Glimpses from our <span className="scribble-underline">classrooms.</span>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5">
            <div className="group col-span-12 aspect-[4/3] overflow-hidden rounded-2xl shadow-card md:col-span-7">
              <img
                src={campusExterior}
                alt="Campus at sunset"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group col-span-6 aspect-square overflow-hidden rounded-2xl shadow-card md:col-span-5">
              <img
                src={library}
                alt="Library reading corner"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group col-span-6 aspect-[4/5] overflow-hidden rounded-2xl shadow-card md:col-span-3">
              <img
                src={studentPortrait}
                alt="Student reading"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group col-span-12 aspect-[5/4] overflow-hidden rounded-2xl shadow-card md:col-span-5">
              <img
                src={studentsGroup}
                alt="Students collaborating"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="group relative col-span-12 aspect-square overflow-hidden rounded-2xl shadow-card md:col-span-4">
              <img
                src={teacherBoard}
                alt="Teacher at chalkboard"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <Link
                to="/gallery"
                className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/80 text-center text-primary-foreground opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
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

      <section className="bg-lavender/40 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 sm:mb-14">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
                <span className="inline-block h-2 w-2 bg-sky" /> Our Faculty
              </p>
              <h2 className="mt-4 font-display text-fluid-h1 font-black text-navy-deep">
                The teachers who <span className="scribble-underline">make</span> the difference.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link
                to="/faculty"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-gold transition-transform hover:scale-105 sm:px-7 sm:py-3.5 sm:text-sm"
              >
                Meet all 11 faculty <ArrowRight className="h-4 w-4" />
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
        <div className="mx-auto grid max-w-5xl gap-6 px-4 text-center md:grid-cols-12 md:items-center md:gap-10 md:text-left sm:px-6 lg:px-8">
          <div className="flex justify-center md:col-span-2 md:block">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient shadow-gold sm:h-20 sm:w-20">
              <Quote className="h-7 w-7 -scale-x-100 text-white sm:h-9 sm:w-9" />
            </span>
          </div>
          <div className="md:col-span-10">
            <blockquote className="font-display text-fluid-h3 font-medium text-navy-deep">
              &quot;They did not just teach my son Physics and Maths, they taught him how to <span className="scribble-underline">think</span>. The teachers genuinely care, and the results speak for themselves.&quot;
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
      </section>

      <section className="relative overflow-hidden bg-gold-gradient py-12 sm:py-16">
        <div aria-hidden className="absolute -right-10 -top-10 h-72 w-72 rounded-full border-2 border-dashed border-white/30" />
        <div aria-hidden className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full border-2 border-dashed border-white/20" />
        <div className="container-fluid grid gap-6 md:grid-cols-3 md:items-center md:gap-8">
          <div className="md:col-span-2">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 sm:text-xs">
              <span className="inline-block h-2 w-2 bg-white" /> Admissions Open | 2026
            </p>
            <h3 className="mt-3 font-display text-fluid-h2 font-black text-white">
              Secure your child&apos;s seat
              <br className="hidden md:block" />
              for the new session.
            </h3>
          </div>
          <div className="flex md:justify-end">
            <a
              href={`tel:${academy.phoneIntl}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-deep shadow-elegant transition-colors hover:bg-navy-deep hover:text-white sm:px-7 sm:py-4 sm:text-sm"
            >
              <Phone className="h-5 w-5" /> Call {academy.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-mint/30 py-fluid-section">
        <div className="container-fluid">
          <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 sm:mb-10">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-sky sm:text-sm">
                <span className="inline-block h-2 w-2 bg-sky" /> Find Us
              </p>
              <h2 className="mt-4 font-display text-fluid-h1 font-black text-navy-deep">
                Right here in <span className="scribble-underline">G-11/2.</span>
              </h2>
              <p className="mt-5 max-w-xl text-fluid-base text-navy-deep/70">
                Two campuses, a five-minute walk apart, on Sachal Sarmast Road and Street 58. Easy parking, well-lit evenings, and right next to your neighbourhood.
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
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant lg:col-span-8 sm:rounded-3xl">
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
                <div
                  key={branch.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elegant sm:rounded-3xl sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky">Branch 0{i + 1}</p>
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
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{branch.hours}</p>
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
