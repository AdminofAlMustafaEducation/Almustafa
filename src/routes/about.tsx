import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BookOpen, Heart, Target, Eye, Compass } from "lucide-react";
import classroom from "@/assets/classroom.jpg";
import study from "@/assets/study.jpg";
import { academy } from "@/data/faculty";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Al-Mustafa Academy, G-11/2 Islamabad" },
      { name: "description", content: "Learn about Al-Mustafa Academy — a 27-year legacy of evening coaching in Islamabad. Our mission, vision and the values that shape our teaching." },
      { property: "og:title", content: "About Al-Mustafa Academy" },
      { property: "og:description", content: "27 years of trusted evening coaching in G-11/2 Islamabad." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative bg-navy-deep text-primary-foreground py-fluid-hero overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${study})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-deep/85 to-navy-deep" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h1 className="mt-5 sm:mt-6 font-display text-fluid-h1 font-bold">
            Twenty-seven years of <em className="text-shimmer font-serif-elegant">quiet excellence.</em>
          </h1>
          <div className="gold-divider my-6 sm:my-8 mx-auto w-32" />
          <p className="text-fluid-base text-primary-foreground/80 max-w-3xl mx-auto">
            From a single evening classroom in 1998 to one of the most respected coaching academies in Islamabad — our story is written in the success of thousands of students.
          </p>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="container-fluid grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1 max-w-md mx-auto lg:max-w-none lg:mx-0 w-full">
            <div className="absolute -inset-6 bg-gold/10 rounded-3xl rotate-2" />
            <img src={classroom} alt="Classroom" className="relative rounded-2xl shadow-elegant w-full" loading="lazy" width={1280} height={896} />
          </div>
          <div className="order-1 lg:order-2">
            <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold inline-block">The Beginning</p>
            <h2 className="mt-4 font-display text-fluid-h2 text-navy font-bold">A vision born in Islamabad, in 1998.</h2>
            <div className="gold-divider my-5 sm:my-6 w-24" />
            <p className="text-muted-foreground text-fluid-base">
              Founded by Syed Ali Azeem Kazmi and Syed Ali Abbas Kazmi, Al-Mustafa Academy began with a simple conviction: that every child in Islamabad deserves access to the same quality of teaching as the country's best institutions.
            </p>
            <p className="mt-4 text-muted-foreground text-fluid-base">
              Over more than two decades, that conviction has shaped every classroom, every test, and every student conversation. Today, we coach hundreds of students each year — from Class 1 through F.Sc — across two campuses in G-11/2.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed font-serif-elegant italic text-base sm:text-lg text-navy">
              "Education is not the filling of a pail, but the lighting of a fire."
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy-deep text-primary-foreground py-fluid-section">
        <div className="container-fluid">
          <div className="text-center mb-10 sm:mb-16">
            <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold">What Drives Us</p>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold">Mission, Vision & Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Target, t: "Our Mission", d: "To provide structured, concept-driven evening coaching that empowers students to excel in board examinations and entry tests — without compromising on character." },
              { icon: Eye, t: "Our Vision", d: "To remain Islamabad's most trusted academy, where every student receives the personal attention, expert teaching and moral guidance they deserve." },
              { icon: Compass, t: "Our Values", d: "Discipline. Sincerity. Care. Honesty in teaching, transparency with parents, and a steady commitment to every student's success." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className={`bg-navy rounded-2xl p-6 sm:p-8 border border-gold/15 hover:border-gold/40 transition-colors ${t === "Our Values" ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gold-gradient flex items-center justify-center mb-4 sm:mb-5 shadow-gold">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-navy-deep" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-gold font-bold mb-3">{t}</h3>
                <p className="text-primary-foreground/75 text-sm sm:text-base leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-fluid-section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="ornament text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold font-semibold">Our Journey</p>
            <h2 className="mt-4 font-display text-fluid-h2 text-navy font-bold">A timeline of trust</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gold/30" />
            {[
              { year: "1998", t: "The Founding", d: "Al-Mustafa Academy opens its doors in G-11/2, Islamabad with a small evening batch." },
              { year: "2005", t: "Faculty Expansion", d: "Senior lecturers from IMCB and Bahria College join the academy, raising the standard of teaching." },
              { year: "2012", t: "Second Campus", d: "A second campus opens on Street 58, G-11/2 to accommodate growing demand." },
              { year: "2020", t: "Two Decades Strong", d: "Thousands of alumni, consistent board toppers and a community that trusts us with its children." },
              { year: "Today", t: "A Living Legacy", d: "11 expert faculty members, three full programs, and one mission — every student, every day." },
            ].map((m, i) => (
              <div key={m.year} className={`relative flex md:items-center mb-8 sm:mb-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-3 w-3 rounded-full bg-gold ring-4 ring-background z-10" />
                <div className="ml-10 sm:ml-12 md:ml-0 md:w-1/2 md:px-6 lg:px-8">
                  <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:border-gold transition-colors shadow-card">
                    <div className="font-display text-2xl sm:text-3xl text-gold font-bold">{m.year}</div>
                    <h3 className="font-display text-lg sm:text-xl text-navy font-bold mt-1">{m.t}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">{m.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Heart className="h-9 w-9 sm:h-10 sm:w-10 text-navy-deep mx-auto mb-4" />
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-navy-deep font-bold">
            Become part of our story.
          </h3>
          <p className="mt-3 text-sm sm:text-base text-navy-deep/80">Visit us at {academy.addressPrimary}</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 bg-navy-deep text-gold font-semibold px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-navy transition-colors text-sm">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}