import type { Faculty } from "@/data/faculty";

export function FacultyCard({ member, featured = false }: { member: Faculty; featured?: boolean }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px bg-gold-gradient rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      <div className="relative bg-navy rounded-2xl p-6 text-center border border-gold/20 hover:border-gold/60 transition-all duration-500 hover:-translate-y-2 shadow-card overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors" />

        <div className="relative mx-auto mb-5">
          <div className={`mx-auto rounded-full bg-gold-gradient p-[3px] ${featured ? "h-32 w-32" : "h-28 w-28"}`}>
            <div className="h-full w-full rounded-full bg-navy-deep flex items-center justify-center">
              <span className="font-display text-3xl text-gold font-bold">{member.initials}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-soft/70 mb-1">Faculty</p>
          <h3 className="font-display text-lg text-primary-foreground font-semibold leading-tight">{member.name}</h3>
          <div className="my-3 mx-auto w-12 h-px bg-gold/40" />
          <p className="text-gold text-sm font-medium uppercase tracking-wider">{member.subject}</p>
          <p className="text-xs text-primary-foreground/60 mt-1">{member.position}</p>
        </div>
      </div>
    </div>
  );
}