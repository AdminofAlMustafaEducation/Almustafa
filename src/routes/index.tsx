import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, Sparkles, Star, MapPin, Quote, Navigation, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import campusExterior from "@/assets/gallery/campus-exterior.jpg";
import teacherBoard from "@/assets/gallery/teacher-board.jpg";
import studentsGroup from "@/assets/gallery/students-group.jpg";
import library from "@/assets/gallery/library.jpg";
import studentPortrait from "@/assets/gallery/student-portrait.jpg";
import notebook from "@/assets/gallery/notebook.jpg";
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

  return (
    <>
      {/* HERO — editorial split */}
      <section className="relative bg-navy-deep text-primary-foreground overflow-hidden">
        {/* faint geometric backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.78 0.14 80) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Top meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-10 border-b border-gold/20">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold-soft/80">
              <span className="h-px w-8 bg-gold" />
              <span>Vol. XXVII · Session 2026</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
              <Sparkles className="h-3 w-3" /> Registration Open
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-x-10 gap-y-14 pt-14">
            {/* LEFT — Headline */}
            <div className="lg:col-span-7 animate-fade-up">
              <p className="font-serif-elegant italic text-xl text-gold-soft/70">An evening academy in G-11/2, Islamabad —</p>
              <h1 className="mt-3 font-display font-bold leading-[0.95] tracking-tight text-[3.4rem] sm:text-7xl lg:text-[6.5rem]">
                Where bright<br/>
                minds find<br/>
                <em className="font-serif-elegant text-shimmer not-italic"><span className="italic">their</span> light.</em>
              </h1>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-7 py-3.5 rounded-full shadow-gold hover:scale-[1.03] transition-transform">
                  Enroll Today <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 border border-gold/50 text-gold-soft px-7 py-3.5 rounded-full hover:bg-gold/10 transition-colors">
                  <Phone className="h-4 w-4" /> {academy.phone}
                </a>
              </div>
            </div>

            {/* RIGHT — Photo collage */}
            <div className="lg:col-span-5 relative animate-fade-up min-h-[420px]" style={{ animationDelay: "0.15s" }}>
              <div className="relative h-full">
                {/* main photo */}
                <div className="absolute top-0 right-0 w-[78%] aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant border border-gold/20">
                  <img src={teacherBoard} alt="Teacher writing on chalkboard" className="h-full w-full object-cover" loading="eager" />
                </div>
                {/* secondary photo */}
                <div className="absolute bottom-0 left-0 w-[55%] aspect-square rounded-2xl overflow-hidden shadow-elegant border-2 border-gold/40">
                  <img src={studentsGroup} alt="Students in discussion" className="h-full w-full object-cover" loading="eager" />
                </div>
                {/* floating logo badge */}
                <div className="absolute -top-2 -left-2 lg:top-6 lg:-left-6 bg-navy-deep border border-gold/40 rounded-2xl p-3 shadow-gold backdrop-blur z-10">
                  <img src={logo} alt="Logo" className="h-14 w-14" width={56} height={56} />
                </div>
                {/* est badge */}
                <div className="absolute bottom-6 right-2 bg-gold text-navy-deep px-4 py-2 rounded-full font-display font-bold text-sm shadow-gold rotate-[6deg] z-10">
                  Since 1998
                </div>
              </div>
            </div>
          </div>

          {/* Hero footer — rich data row */}
          <div className="mt-20 pt-8 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { k: "27", s: "yrs", l: "Of trusted teaching" },
              { k: "11", s: "+", l: "Senior faculty members" },
              { k: "2", s: "", l: "Branches in G-11/2" },
              { k: "1000s", s: "", l: "Alumni across Pakistan" },
            ].map((s) => (
              <div key={s.l} className="flex flex-col">
                <div className="font-display text-4xl md:text-5xl text-gold font-bold leading-none">
                  {s.k}<span className="text-2xl text-gold-soft/70 font-serif-elegant italic ml-1">{s.s}</span>
                </div>
                <div className="mt-2 text-xs text-primary-foreground/60 uppercase tracking-[0.18em]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* gold underline */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </section>

      {/* MARQUEE OF VALUES */}
      <section className="bg-gold text-navy-deep py-5 overflow-hidden border-b-2 border-navy-deep/20">
        <div className="flex gap-12 whitespace-nowrap animate-marquee font-display text-2xl md:text-3xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12 items-center shrink-0">
              {["Discipline", "✦", "Sincerity", "✦", "Excellence", "✦", "Care", "✦", "Mastery", "✦", "Tradition", "✦"].map((w, i) => (
                <span key={`${k}-${i}`} className={i % 2 ? "text-base" : "italic font-serif-elegant"}>{w}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* WELCOME — magazine spread */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* sidebar label */}
            <aside className="lg:col-span-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 01</p>
              <p className="mt-2 font-serif-elegant italic text-2xl text-navy">A welcome —</p>
              <div className="mt-4 h-px w-12 bg-navy" />
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Three short paragraphs on who we are, why we teach, and what we believe.
              </p>
            </aside>

            <div className="lg:col-span-9">
              <p className="font-display text-3xl md:text-5xl text-navy leading-[1.15] font-medium">
                For twenty-seven years, families in <em className="font-serif-elegant text-gold">G-11/2</em> have walked through the same gate every evening — and walked out a little wiser, a little surer, a little better.
              </p>

              <div className="mt-12 grid md:grid-cols-2 gap-10 items-start">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Al-Mustafa Academy began in 1998 with a single room and a clear idea: that good teaching is patient, that students learn best when they are seen, and that excellence is a quiet, daily practice.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Today, eleven senior lecturers — drawn from <em>IMCB</em>, <em>ICB</em>, <em>Bahria College</em>, <em>APS Rawalpindi</em> and <em>Al-Kausar</em> — share that same conviction across two campuses, three programs and hundreds of students each year.
                  </p>
                  <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-navy font-semibold border-b border-gold pb-1 hover:text-gold transition-colors">
                    Read our full story <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="relative">
                  <img src={notebook} alt="Hands writing in notebook" loading="lazy" className="rounded-2xl shadow-card aspect-[4/5] object-cover w-full" />
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Quiet hours · Evening study</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS — editorial list */}
      <section className="bg-navy-deep text-primary-foreground py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 02 · Programs</p>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-[1.05]">
                From <em className="font-serif-elegant text-gold">first letters</em><br/>to <em className="font-serif-elegant text-shimmer">final exams.</em>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-primary-foreground/70 leading-relaxed">
                Three carefully-built programs, each taught by lecturers who set and mark the very papers your child will sit.
              </p>
            </div>
          </div>

          {/* Numbered list with hover image */}
          <div className="border-t border-gold/20">
            {programs.map((p, i) => (
              <Link
                key={p.title}
                to="/programs"
                className="group grid grid-cols-12 gap-4 items-center py-8 border-b border-gold/20 hover:bg-navy/40 transition-colors px-2 md:px-4"
              >
                <div className="col-span-2 md:col-span-1">
                  <span className="font-serif-elegant italic text-2xl text-gold-soft/60">0{i+1}</span>
                </div>
                <div className="col-span-10 md:col-span-5">
                  <h3 className="font-display text-2xl md:text-4xl text-primary-foreground group-hover:text-gold transition-colors">{p.title}</h3>
                </div>
                <div className="hidden md:block md:col-span-5 text-sm text-primary-foreground/70 leading-relaxed">
                  {p.subjects.slice(0, 5).join(" · ")}
                </div>
                <div className="col-span-12 md:col-span-1 flex md:justify-end">
                  <ArrowRight className="h-5 w-5 text-gold group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO COLLAGE — life inside */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 03 · Life Inside</p>
            <h2 className="mt-3 font-display text-4xl md:text-6xl text-navy font-bold leading-tight">
              Glimpses from our <em className="font-serif-elegant text-gold">classrooms.</em>
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-5">
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
              <Link to="/gallery" className="absolute inset-0 bg-navy-deep/70 flex flex-col items-center justify-center text-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-serif-elegant italic text-2xl text-gold">View full</p>
                <p className="font-display text-3xl">Gallery</p>
                <ArrowRight className="h-5 w-5 mt-2 text-gold" />
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-navy font-semibold border-b border-gold pb-1 hover:text-gold transition-colors">
              Open the photo gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FACULTY — featured */}
      <section className="bg-navy-deep text-primary-foreground py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 mb-14 items-end">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 04 · Faculty</p>
              <h2 className="mt-3 font-display text-5xl md:text-6xl font-bold leading-[1.05]">
                The teachers who<br/><em className="font-serif-elegant text-shimmer">make the difference.</em>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Link to="/faculty" className="inline-flex items-center gap-2 border border-gold/40 text-gold-soft px-6 py-3 rounded-full hover:bg-gold hover:text-navy-deep transition-colors text-sm">
                Meet all 11 faculty <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((m) => <FacultyCard key={m.name} member={m} featured />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — editorial pull quote */}
      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-2">
            <Quote className="h-16 w-16 text-gold/40 -scale-x-100" />
          </div>
          <div className="md:col-span-10">
            <blockquote className="font-serif-elegant text-3xl md:text-5xl italic leading-[1.15] text-navy">
              "They didn't just teach my son Physics and Maths — they taught him how to <span className="text-gold">think</span>. The teachers genuinely care, and the results speak for themselves."
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex gap-0.5 text-gold">
                {[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-gold" />)}
              </div>
              <div className="text-sm">
                <div className="font-semibold text-navy">A parent of an F.Sc graduate</div>
                <div className="text-muted-foreground">G-11, Islamabad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHES STRIP */}
      <section className="bg-navy text-primary-foreground py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 05 · Visit</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight">
                Two branches in <em className="font-serif-elegant text-gold">G-11/2.</em>
              </h2>
            </div>
            <Link to="/contact" className="text-sm text-gold-soft border-b border-gold pb-1 hover:text-gold">
              See both on map →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((b, i) => (
              <a key={b.id} href={b.mapsLink} target="_blank" rel="noopener noreferrer" className="group relative bg-navy-deep rounded-2xl border border-gold/20 hover:border-gold/60 transition-colors p-7 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/5 group-hover:bg-gold/15 transition-colors" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gold-soft/70">Branch 0{i+1}</div>
                    <h3 className="mt-2 font-display text-2xl text-gold font-bold">{b.label}</h3>
                    <p className="mt-3 text-primary-foreground/75 text-sm leading-relaxed flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /> {b.address}
                    </p>
                    <p className="mt-2 text-xs text-primary-foreground/55">{b.hours}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gold-gradient py-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-navy-deep/80 font-bold">Admissions Open · 2026</p>
            <h3 className="mt-2 font-display text-3xl md:text-5xl text-navy-deep font-bold leading-tight">
              Secure your child's seat<br className="hidden md:block"/> for the new session.
            </h3>
          </div>
          <div className="flex md:justify-end">
            <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 bg-navy-deep text-gold font-semibold px-7 py-4 rounded-full hover:bg-navy transition-colors shadow-elegant">
              <Phone className="h-5 w-5" /> Call {academy.phone}
            </a>
          </div>
        </div>
      </section>

      {/* LOCATION & MAP */}
      <section className="bg-background py-20 md:py-28 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-10">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.4em] text-gold font-bold">No. 06 · Find Us</p>
              <h2 className="mt-3 font-display text-4xl md:text-6xl text-navy font-bold leading-[1.05]">
                Right here in <em className="font-serif-elegant text-gold">G-11/2.</em>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl leading-relaxed">
                Two campuses, a five-minute walk apart, on Sachal Sarmast Road and Street 58. Easy parking, well-lit evenings, and right next to your neighbourhood.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-2">
              <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 text-navy font-semibold border-b border-gold pb-1 hover:text-gold transition-colors">
                <Phone className="h-4 w-4" /> {academy.phone}
              </a>
              <div>
                <a href={`mailto:${academy.email}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors">
                  <Mail className="h-4 w-4" /> {academy.email}
                </a>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Map */}
            <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-elegant border border-border bg-card">
              <iframe
                title="Al-Mustafa Academy on Google Maps"
                src={academy.mapsEmbed}
                width="100%"
                height="480"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Address cards */}
            <div className="lg:col-span-4 space-y-4">
              {branches.map((b, i) => (
                <div key={b.id} className="bg-card rounded-2xl border border-border p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Branch 0{i + 1}</p>
                      <h3 className="mt-1 font-display text-xl text-navy font-bold">{b.label}</h3>
                    </div>
                    <span className="bg-muted text-navy rounded-full p-2">
                      <MapPin className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.address}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{b.hours}</p>
                  <a
                    href={b.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-gold pb-0.5 hover:text-gold transition-colors"
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