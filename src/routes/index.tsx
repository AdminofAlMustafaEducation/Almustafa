import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpen, GraduationCap, Phone, Sparkles, Users, Star, MapPin, Calendar } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";
import classroom from "@/assets/classroom.jpg";
import { academy, faculty, programs } from "@/data/faculty";
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
      {/* HERO */}
      <section className="relative overflow-hidden text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-90" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/85 to-navy-deep" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.25em] text-gold mb-8">
                <Sparkles className="h-3 w-3" /> Registration Open · Session 2026
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
                Where bright minds<br/>
                <span className="text-shimmer italic font-serif-elegant">find their light.</span>
              </h1>

              <p className="mt-8 text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
                For more than two decades, Al-Mustafa Academy has been Islamabad's trusted home for evening coaching — guiding students from Class 1 through F.Sc with discipline, care and excellence.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-7 py-3.5 rounded-full shadow-gold hover:scale-105 transition-transform">
                  Enroll Today <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/programs" className="inline-flex items-center gap-2 border border-gold/50 text-gold-soft px-7 py-3.5 rounded-full hover:bg-gold/10 transition-colors">
                  Explore Programs
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                {[
                  { n: "27+", l: "Years of Trust" },
                  { n: "11", l: "Expert Faculty" },
                  { n: "1000s", l: "Alumni" },
                ].map((s) => (
                  <div key={s.l} className="border-l-2 border-gold/50 pl-3">
                    <div className="font-display text-3xl text-gold font-bold">{s.n}</div>
                    <div className="text-xs text-primary-foreground/60 uppercase tracking-wider">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl animate-float" />
                <img src={logo} alt="Al-Mustafa Academy emblem" className="relative h-full w-full object-contain animate-float drop-shadow-2xl" width={512} height={512} />
              </div>
              <div className="absolute -top-4 -right-2 bg-navy-deep/90 backdrop-blur border border-gold/40 rounded-2xl px-5 py-3 shadow-gold">
                <div className="text-[10px] uppercase tracking-widest text-gold-soft">Established</div>
                <div className="font-display text-2xl text-gold font-bold">1998</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </section>

      {/* WELCOME / ABOUT */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold inline-block">Welcome</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-bold leading-tight">
              An institution built on <em className="font-serif-elegant text-gold">discipline, dedication & the joy of learning.</em>
            </h2>
            <div className="gold-divider my-8 w-24" />
            <p className="text-muted-foreground leading-relaxed text-lg">
              Al-Mustafa Academy was founded in 1998 in the heart of G-11/2, Islamabad. What began as a small evening coaching center has grown into one of the most respected academies in the capital — known for its rigorous teaching, caring environment and strong board results.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our faculty includes serving senior lecturers from leading colleges such as IMCB G-10/4, IMCB H-9, IMCB G-11/1, ICB G-6/3, Bahria College, APS Rawalpindi and Al-Kausar — bringing decades of board-level expertise into every classroom.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-navy font-semibold hover:text-gold transition-colors">
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gold/10 rounded-3xl -rotate-2" />
            <img src={classroom} alt="Al-Mustafa Academy classroom" className="relative rounded-2xl shadow-elegant w-full" loading="lazy" width={1280} height={896} />
            <div className="absolute -bottom-6 -left-6 bg-navy-deep text-primary-foreground rounded-2xl p-5 shadow-gold max-w-[200px]">
              <Award className="h-7 w-7 text-gold mb-2" />
              <div className="font-display text-2xl font-bold text-gold">Since 1998</div>
              <div className="text-xs text-primary-foreground/70">Trusted by generations of Islamabad families</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-navy-deep text-primary-foreground py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our Programs</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">
              From <em className="text-shimmer font-serif-elegant">first steps</em> to college success
            </h2>
            <p className="mt-4 text-primary-foreground/70">
              Carefully structured coaching for every stage — taught by lecturers who set and mark board papers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <div key={p.title} className="group relative bg-navy rounded-2xl p-8 border border-gold/15 hover:border-gold/50 transition-all hover:-translate-y-2 duration-500">
                <div className="absolute top-6 right-6 font-display text-6xl text-gold/10 font-bold group-hover:text-gold/20 transition-colors">0{i+1}</div>
                <div className="text-5xl mb-4">{p.icon}</div>
                <h3 className="font-display text-2xl text-gold font-bold mb-3">{p.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed mb-5">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.subjects.map((s) => (
                    <span key={s} className="text-[11px] uppercase tracking-wider bg-gold/10 text-gold-soft px-2.5 py-1 rounded-full border border-gold/20">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/programs" className="inline-flex items-center gap-2 border border-gold text-gold px-7 py-3 rounded-full hover:bg-gold hover:text-navy-deep transition-colors">
              View All Programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED FACULTY */}
      <section className="bg-navy-deep text-primary-foreground py-20 md:py-28 border-t border-gold/15">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our Faculty</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">
              Meet the <em className="text-shimmer font-serif-elegant">masters</em>
            </h2>
            <p className="mt-4 text-primary-foreground/70">
              Senior lecturers from Islamabad's leading institutions, united by a passion for teaching.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {featured.map((m) => <FacultyCard key={m.name} member={m} featured />)}
          </div>

          <div className="mt-12 text-center">
            <Link to="/faculty" className="inline-flex items-center gap-2 bg-gold-gradient text-navy-deep font-semibold px-7 py-3 rounded-full shadow-gold hover:scale-105 transition-transform">
              Meet All 11 Faculty Members <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="ornament text-xs uppercase tracking-[0.3em] text-gold font-semibold">Why Al-Mustafa</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-bold">
              A legacy of excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, t: "27+ Years Strong", d: "Serving Islamabad's students with consistency since 1998." },
              { icon: Users, t: "Senior Lecturers", d: "Faculty drawn from IMCB, ICB, Bahria College, APS & more." },
              { icon: BookOpen, t: "Concept-First", d: "We build understanding — not memorisation. Every topic, every time." },
              { icon: GraduationCap, t: "Board Excellence", d: "FBISE-aligned syllabus, weekly tests and intensive past-paper drill." },
            ].map((f) => (
              <div key={t_only(f.t)} className="bg-card border border-border rounded-2xl p-6 hover:border-gold hover:shadow-card transition-all">
                <div className="h-12 w-12 rounded-xl bg-gold-gradient flex items-center justify-center mb-4 shadow-gold">
                  <f.icon className="h-6 w-6 text-navy-deep" />
                </div>
                <h3 className="font-display text-xl text-navy font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-navy text-primary-foreground py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-6 text-gold">
            {[0,1,2,3,4].map(i => <Star key={i} className="h-5 w-5 fill-gold" />)}
          </div>
          <blockquote className="font-serif-elegant text-2xl md:text-3xl italic leading-relaxed text-primary-foreground/90">
            "Al-Mustafa Academy didn't just teach my son Physics and Maths — they taught him how to think. The teachers genuinely care, and the results speak for themselves."
          </blockquote>
          <div className="gold-divider my-8 mx-auto w-24" />
          <p className="font-display text-gold text-lg">A Parent · G-11, Islamabad</p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gold-gradient py-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.3em] text-navy-deep/80 font-bold">Admissions Open</p>
            <h3 className="mt-2 font-display text-3xl md:text-4xl text-navy-deep font-bold">Secure your child's seat for the new session.</h3>
            <p className="mt-3 text-navy-deep/80 text-sm flex flex-wrap gap-x-6 gap-y-1">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {academy.addressPrimary}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" /> {academy.phone}</span>
            </p>
          </div>
          <div className="flex md:justify-end">
            <a href={`tel:${academy.phoneIntl}`} className="inline-flex items-center gap-2 bg-navy-deep text-gold font-semibold px-7 py-4 rounded-full hover:bg-navy transition-colors shadow-elegant">
              <Phone className="h-5 w-5" /> Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function t_only(s: string) { return s; }