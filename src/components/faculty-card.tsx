import type { Faculty } from "@/data/faculty";

export function FacultyCard({ member, featured = false }: { member: Faculty; featured?: boolean }) {
  return (
    <article className="group relative h-full">
      <div className="absolute -inset-1 rounded-[2rem] bg-gold-gradient opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className={`paper-panel card-lift relative h-full overflow-hidden border border-white/65 p-5 text-center sm:p-6 ${
          featured ? "rounded-[2rem]" : "rounded-[1.75rem]"
        }`}
      >
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-sky/10 blur-2xl" />

        <div className="relative mx-auto mb-4 sm:mb-5">
          <div
            className={`mx-auto rounded-full bg-gold-gradient p-[3px] shadow-soft ${
              featured ? "h-28 w-28 sm:h-32 sm:w-32" : "h-24 w-24 sm:h-28 sm:w-28"
            }`}
          >
            {member.image ? (
              <img
                src={member.image}
                alt={`${member.name} profile photo`}
                className="h-full w-full rounded-full bg-navy-deep object-cover object-top"
                loading="lazy"
                decoding="async"
                width={featured ? 128 : 112}
                height={featured ? 128 : 112}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-navy-deep">
                <span className="font-display text-2xl font-bold text-gold sm:text-3xl">{member.initials}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <p className="mx-auto mb-2 inline-flex rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold sm:text-[11px]">
            {featured ? "Leadership" : "Faculty"}
          </p>
          <h3 className="font-display text-lg font-black leading-tight text-navy-deep sm:text-xl">
            {member.name}
          </h3>
          <div className="gold-divider mx-auto my-3 w-14" />
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky sm:text-sm">{member.subject}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.position}</p>
        </div>
      </div>
    </article>
  );
}
