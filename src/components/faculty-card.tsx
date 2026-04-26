import type { Faculty } from "@/data/faculty";

export function FacultyCard({ member, featured = false }: { member: Faculty; featured?: boolean }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px bg-gold-gradient rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      <div className="relative bg-navy rounded-2xl p-5 sm:p-6 text-center border border-gold/20 hover:border-gold/60 transition-all duration-500 hover:-translate-y-2 shadow-card overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-colors" />

        <div className="relative mx-auto mb-4 sm:mb-5">
          <div className={`mx-auto rounded-full bg-gold-gradient p-[3px] ${featured ? "h-28 w-28 sm:h-32 sm:w-32" : "h-24 w-24 sm:h-28 sm:w-28"}`}>
            {member.image ? (
              <img
                src={member.image}
                alt={`${member.name} profile photo`}
                className="h-full w-full rounded-full object-cover object-top bg-navy-deep"
                loading="lazy"
                width={featured ? 128 : 112}
                height={featured ? 128 : 112}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-navy-deep">
                <span className="font-display text-2xl sm:text-3xl text-gold font-bold">{member.initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold-soft/70 mb-1">Faculty</p>
          <h3 className="font-display text-base sm:text-lg text-primary-foreground font-semibold leading-tight">{member.name}</h3>
          <div className="my-2.5 sm:my-3 mx-auto w-12 h-px bg-gold/40" />
          <p className="text-gold text-xs sm:text-sm font-medium uppercase tracking-wider">{member.subject}</p>
          <p className="text-[11px] sm:text-xs text-primary-foreground/60 mt-1">{member.position}</p>
        </div>
      </div>
    </div>
  );
}
