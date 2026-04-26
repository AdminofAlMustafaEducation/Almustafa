import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, Star, MapPin, Quote, Navigation, Mail, Play, GraduationCap, BookOpen, FlaskConical, Users, Award, CalendarCheck } from "lucide-react";
import campusExterior from "@/assets/gallery/campus-exterior.jpg";
import teacherBoard from "@/assets/gallery/teacher-board.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import library from "@/assets/gallery/library.jpg";
import studentPortrait from "@/assets/gallery/student-portrait.jpg";
import heroStudent from "@/assets/eduor/hero-student.png";
import doodlePen from "@/assets/eduor/doodle-pen.png";
import { academy, branches, faculty, programs } from "@/data/faculty";
import { FacultyCard } from "@/components/faculty-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Al-Mustafa Academy — Premier Evening Coaching, G-11/2 Islamabad" },
      { name: "description", content: "Registration open for Juniors (1–8), Matric & F.Sc. Trusted since 1998 in G-11/2 Islamabad. Senior college lecturers · Small batches · Proven results." },
      { property: "og:title", content: "Al-Mustafa Academy — Since 1998" },
      { property: "og:description", content: "Registration open · Juniors · Matric · F.Sc · G-11/2 Islamabad" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = faculty.slice(0, 3);
  const programIcons = [BookOpen, FlaskConical, GraduationCap];

  return (
    <>
      {/* HERO — Eduor-style pastel wash with cheerful student */}
      <section className="relative bg-pastel overflow-hidden">
        {/* decorative pen doodle, top-left */}
        <img
          src={doodlePen}
          alt=""
          aria-hidden
          className="hidden lg:block absolute -left-8 top-24 w-56 xl:w-72 opacity-70 pointer-events-none select-none"
        />
        {/* dashed orbit rings around photo area */}
        <div aria-hidden className="hidden xl:block pointer-events-none absolute right-[6%] top-[18%] w-[28rem] h-[28rem] 2xl:w-[34rem] 2xl:h-[34rem] rounded-full border-2 border-dashed border-gold/40 animate-spin-slow" />
        <div aria-hidden className="hidden xl:block pointer-events-none absolute right-[12%] top-[28%] w-[20rem] h-[20rem] 2xl:w-[24rem] 2xl:h-[24rem] rounded-full border-2 border-dashed border-sky/40" />

        <div className="relative container-fluid py-fluid-hero grid md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* LEFT — headline */}
          <div className="md:col-span-7 animate-fade-up">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
              <span className="inline-block w-2 h-2 bg-sky" />
              Welcome to Al-Mustafa
              <span className="inline-block w-2 h-2 bg-sky" />
            </p>

            <h1 className="mt-5 sm:mt-6 font-display font-black text-navy-deep tracking-tight text-fluid-hero">
              Bright minds <br className="hidden sm:block"/>deserve a{" "}
              <span className="scribble-underline">brighter</span> <br className="hidden sm:block"/>evening academy.
            </h1>

            <p className="mt-6 sm:mt-7 max-w-xl text-fluid-base text-navy-deep/70">
              Trusted in G-11/2 Islamabad since 1998. Senior college lecturers teaching Juniors, Matric and F.Sc — with the discipline, care and proven results parents talk about.
            </p>

            <div className="mt-7 sm:mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold-gradient text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-gold hover:scale-[1.04] transition-transform uppercase tracking-wider text-xs sm:text-sm"
              >
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={academy.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-navy-deep font-semibold"
              >
                <span className="grid place-items-center h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-navy-deep text-white shadow-elegant transition-transform group-hover:scale-110">
                  <Play className="h-4 w-4 fill-white" />
                </span>
                <span className="text-xs sm:text-sm">Watch our story</span>
              </a>
            </div>

            {/* mini trust strip */}
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3 text-xs sm:text-sm text-navy-deep/70">
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-gold" /> 27 years trusted</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /> 11 senior lecturers</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> 2 G-11/2 campuses</div>
            </div>
          </div>

          {/* RIGHT — cheerful student cutout */}
          <div className="md:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-square w-full max-w-sm sm:max-w-md mx-auto">
              {/* soft blob behind */}
              <div aria-hidden className="absolute inset-6 rounded-full bg-white/50 blur-2xl" />
              <img
                src={heroStudent}
                alt="A bright student ready for evening coaching at Al-Mustafa Academy"
                className="relative h-full w-full object-contain drop-shadow-2xl"
                loading="eager"
                width={1024}
                height={1024}
              />

              {/* Floating since-1998 pill */}
              <div className="absolute top-2 left-0 sm:top-4 sm:-left-4 bg-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-elegant border border-border flex items-center gap-2 sm:gap-3 animate-wiggle">
                <span className="grid place-items-center h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gold-gradient">
                  <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </span>
                <div className="leading-tight">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">Since</div>
                  <div className="font-display font-bold text-navy-deep text-sm sm:text-base">1998</div>
                </div>
              </div>

              {/* Floating rating pill */}
              <div className="absolute bottom-4 sm:bottom-6 right-0 sm:-right-6 bg-white rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-elegant border border-border flex items-center gap-2 sm:gap-3">
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(i => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                </div>
                <div className="leading-tight">
                  <div className="font-display font-bold text-navy-deep text-xs sm:text-sm">Loved by parents</div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground">G-11/2 community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS — Eduor "We Success For Categories" pattern */}
      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="text-center max-w-2xl mx-auto">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
              <span className="inline-block w-2 h-2 bg-sky" />
              Our Programs
              <span className="inline-block w-2 h-2 bg-sky" />
            </p>
            <h2 className="mt-4 font-display text-fluid-h1 text-navy-deep font-black">
              Programs built for <br className="hidden md:block"/>
              <span className="scribble-underline">every</span> stage.
            </h2>
          </div>

          <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {programs.map((p, i) => {
              const Icon = programIcons[i] ?? BookOpen;
              const tones = [
                { ring: "bg-mint", chip: "bg-sky text-white" },
                { ring: "bg-cream", chip: "bg-gold text-white" },
                { ring: "bg-lavender", chip: "bg-navy-deep text-white" },
              ];
              const tone = tones[i] ?? tones[0];
              return (
                <Link
                  key={p.title}
                  to="/programs"
                  className={`group relative bg-card rounded-3xl p-6 sm:p-8 shadow-card border border-border hover:-translate-y-1 hover:shadow-elegant transition-all overflow-hidden ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  {/* decorative tab */}
                  <div className={`absolute -top-6 left-8 w-16 h-12 rounded-b-2xl ${tone.ring}`} />
                  <div className="relative">
                    <div className={`grid place-items-center h-14 w-14 sm:h-16 sm:w-16 rounded-full ${tone.chip} shadow-md`}>
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="mt-5 sm:mt-6 font-display text-xl sm:text-2xl text-navy-deep font-bold leading-tight">{p.title}</h3>
                    <p className="mt-3 text-fluid-sm text-muted-foreground">{p.description.split(".")[0]}.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {p.subjects.slice(0, 4).map((s) => (
                        <span key={s} className="text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-muted text-navy-deep/70">{s}</span>
                      ))}
                    </div>
                    <span className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-sm font-bold text-gold group-hover:gap-3 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT — split with photo */}
      <section className="bg-mint/40 py-fluid-section relative overflow-hidden">
        <div aria-hidden className="absolute right-0 top-10 w-64 h-64 rounded-full bg-lavender/60 blur-3xl" />
        <div className="relative container-fluid grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 relative max-w-md mx-auto lg:max-w-none lg:mx-0 w-full">
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-elegant aspect-[4/5]">
              <img src={teacherBoard} alt="Teacher writing on the chalkboard" className="h-full w-full object-cover" loading="lazy" />
            </div>
            {/* badge overlay */}
            <div className="absolute -bottom-6 right-2 sm:right-6 lg:right-12 bg-white rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-elegant border border-border flex items-center gap-3">
              <div className="grid place-items-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gold-gradient">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <div className="font-display font-black text-xl sm:text-2xl text-navy-deep leading-none">27+</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Years teaching</div>
              </div>
            </div>
            {/* second photo */}
            <div className="hidden lg:block absolute -bottom-10 -left-10 w-40 xl:w-48 aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-elegant">
              <img src={studentPortrait} alt="A focused student" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
              <span className="inline-block w-2 h-2 bg-sky" />
              About the Academy
            </p>
            <h2 className="mt-4 font-display text-fluid-h2 text-navy-deep font-black">
              Where good teachers <br/>raise <span className="scribble-underline">great</span> students.
            </h2>
            <p className="mt-5 sm:mt-6 text-fluid-base text-navy-deep/70">
              Al-Mustafa Academy began in 1998 with a single room and a clear idea — that excellence is a quiet, daily practice. Today, eleven senior lecturers from IMCB, ICB, Bahria College, APS Rawalpindi and Al-Kausar share that same conviction across two G-11/2 campuses.
            </p>

            <ul className="mt-6 sm:mt-8 space-y-4">
              {[
                { t: "Senior College Lecturers", d: "Taught by the people who set and mark your child's papers." },
                { t: "Small, Focused Batches", d: "Personal attention so no student is ever invisible." },
                { t: "Weekly Tests & Feedback", d: "Real progress measured every week, never guessed." },
              ].map((f) => (
                <li key={f.t} className="flex items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 grid place-items-center h-7 w-7 rounded-full bg-gold-gradient text-white text-xs font-black shrink-0">✓</span>
                  <div>
                    <div className="font-display font-bold text-navy-deep">{f.t}</div>
                    <div className="text-fluid-sm text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/about" className="mt-8 sm:mt-10 inline-flex items-center gap-2 bg-navy-deep text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-navy transition-colors uppercase tracking-wider text-xs sm:text-sm">
              About us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE OF VALUES */}
      <section className="bg-gold-gradient text-white py-4 sm:py-5 overflow-hidden">
        <div className="flex gap-8 sm:gap-12 whitespace-nowrap animate-marquee font-display font-black uppercase text-lg sm:text-xl md:text-2xl tracking-wide">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-8 sm:gap-12 items-center shrink-0">
              {["Discipline", "✦", "Sincerity", "✦", "Excellence", "✦", "Care", "✦", "Mastery", "✦", "Tradition", "✦"].map((w, i) => (
                <span key={`${k}-${i}`} className={i % 2 ? "text-sm sm:text-base opacity-80" : ""}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PHOTO COLLAGE — life inside */}
      <section className="bg-background py-fluid-section">
        <div className="container-fluid">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
              <span className="inline-block w-2 h-2 bg-sky" /> Life Inside <span className="inline-block w-2 h-2 bg-sky" />
            </p>
            <h2 className="mt-4 font-display text-fluid-h1 text-navy-deep font-black">
              Glimpses from our <span className="scribble-underline">classrooms.</span>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5">
            <div className="col-span-12 md:col-span-7 aspect-[4/3] rounded-2xl overflow-hidden shadow-card group">
              <img src={campusExterior} alt="Campus at sunset" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="col-span-6 md:col-span-5 aspect-square rounded-2xl overflow-hidden shadow-card group">
              <img src={library} alt="Library reading corner" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="col-span-6 md:col-span-3 aspect-[4/5] rounded-2xl overflow-hidden shadow-card group">
              <img src={studentPortrait} alt="Student reading" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="col-span-12 md:col-span-5 aspect-[5/4] rounded-2xl overflow-hidden shadow-card group">
              <img src={studentsGroup} alt="Students collaborating" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            <div className="col-span-12 md:col-span-4 aspect-square rounded-2xl overflow-hidden shadow-card group relative">
              <img src={teacherBoard} alt="Teacher at chalkboard" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
              <Link to="/gallery" className="absolute inset-0 bg-navy-deep/80 flex flex-col items-center justify-center text-center text-primary-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                <p className="text-xs uppercase tracking-widest text-gold font-bold">View full</p>
                <p className="font-display text-2xl sm:text-3xl font-black">Gallery</p>
                <ArrowRight className="h-5 w-5 mt-2 text-gold" />
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-2 bg-navy-deep text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-navy transition-colors uppercase tracking-wider text-xs sm:text-sm">
              Open the photo gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FACULTY — featured */}
      <section className="bg-lavender/40 py-fluid-section">
        <div className="container-fluid">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 mb-10 sm:mb-14 lg:items-end">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
                <span className="inline-block w-2 h-2 bg-sky" /> Our Faculty
              </p>
              <h2 className="mt-4 font-display text-fluid-h1 text-navy-deep font-black">
                The teachers who <span className="scribble-underline">make</span> the difference.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link to="/faculty" className="inline-flex items-center gap-2 bg-gold-gradient text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:scale-105 transition-transform uppercase tracking-wider font-bold text-xs sm:text-sm shadow-gold">
                Meet all 11 faculty <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featured.map((m) => <FacultyCard key={m.name} member={m} featured />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — editorial pull quote */}
      <section className="bg-background py-fluid-section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-6 md:gap-10 md:items-center">
          <div className="md:col-span-2 flex md:block justify-center">
            <span className="grid place-items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gold-gradient shadow-gold">
              <Quote className="h-7 w-7 sm:h-9 sm:w-9 text-white -scale-x-100" />
            </span>
          </div>
          <div className="md:col-span-10 text-center md:text-left">
            <blockquote className="font-display text-fluid-h3 text-navy-deep font-medium">
              "They didn't just teach my son Physics and Maths — they taught him how to <span className="scribble-underline">think</span>. The teachers genuinely care, and the results speak for themselves."
            </blockquote>
            <div className="mt-6 sm:mt-8 flex items-center justify-center md:justify-start gap-4">
              <div className="flex gap-0.5 text-gold">
                {[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-gold" />)}
              </div>
              <div className="text-sm">
                <div className="font-bold text-navy-deep">A parent of an F.Sc graduate</div>
                <div className="text-muted-foreground">G-11, Islamabad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gold-gradient py-12 sm:py-16 overflow-hidden">
        <div aria-hidden className="absolute -top-10 -right-10 w-72 h-72 rounded-full border-2 border-dashed border-white/30" />
        <div aria-hidden className="absolute -bottom-16 -left-10 w-72 h-72 rounded-full border-2 border-dashed border-white/20" />
        <div className="container-fluid grid md:grid-cols-3 gap-6 md:gap-8 md:items-center">
          <div className="md:col-span-2">
            <p className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/90 font-bold">
              <span className="inline-block w-2 h-2 bg-white" /> Admissions Open · 2026
            </p>
            <h3 className="mt-3 font-display text-fluid-h2 text-white font-black">
              Secure your child's seat<br className="hidden md:block"/> for the new session.
            </h3>
          </div>
          <div className="flex md:justify-end">
            <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 bg-white text-navy-deep font-bold px-6 sm:px-7 py-3.5 sm:py-4 rounded-full hover:bg-navy-deep hover:text-white transition-colors shadow-elegant uppercase tracking-wider text-xs sm:text-sm">
              <Phone className="h-5 w-5" /> Call {academy.phone}
            </a>
          </div>
        </div>
      </section>

      {/* LOCATION & MAP */}
      <section className="bg-mint/30 py-fluid-section border-t border-border">
        <div className="container-fluid">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 lg:items-end mb-8 sm:mb-10">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wide text-sky uppercase">
                <span className="inline-block w-2 h-2 bg-sky" /> Find Us
              </p>
              <h2 className="mt-4 font-display text-fluid-h1 text-navy-deep font-black">
                Right here in <span className="scribble-underline">G-11/2.</span>
              </h2>
              <p className="mt-5 text-fluid-base text-navy-deep/70 max-w-xl">
                Two campuses, a five-minute walk apart, on Sachal Sarmast Road and Street 58. Easy parking, well-lit evenings, and right next to your neighbourhood.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-2 break-words">
              <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 text-navy-deep font-bold border-b-2 border-gold pb-1 hover:text-gold transition-colors">
                <Phone className="h-4 w-4" /> {academy.phone}
              </a>
              <div>
                <a href={`mailto:${academy.email}`} className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-navy-deep transition-colors break-all">
                  <Mail className="h-4 w-4 shrink-0" /> {academy.email}
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Map */}
            <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant border border-border bg-card">
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

            {/* Address cards */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {branches.map((b, i) => (
                <div key={b.id} className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-6 shadow-card hover:shadow-elegant transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-sky font-bold">Branch 0{i + 1}</p>
                      <h3 className="mt-1 font-display text-lg sm:text-xl text-navy-deep font-black">{b.label}</h3>
                    </div>
                    <span className="bg-gold-gradient text-white rounded-xl p-2 sm:p-2.5 shadow-md shrink-0">
                      <MapPin className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">{b.address}</p>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">{b.hours}</p>
                  <a
                    href={b.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-deep border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
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