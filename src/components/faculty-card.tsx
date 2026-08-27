import type { Faculty } from "@/data/faculty";

export function FacultyCard({ member, featured = false }: { member: Faculty; featured?: boolean }) {
  return (
    <article className="paper-panel h-full overflow-hidden p-6 text-center">
      <div className="mx-auto mb-4">
        <div
          className={`mx-auto overflow-hidden rounded-full bg-navy-deep ${
            featured ? "h-28 w-28 sm:h-32 sm:w-32" : "h-24 w-24 sm:h-28 sm:w-28"
          }`}
        >
          {member.image ? (
            <img
              src={member.image}
              alt={`${member.name} profile photo`}
              className="h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
              width={featured ? 128 : 112}
              height={featured ? 128 : 112}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-2xl font-bold text-gold sm:text-3xl">
                {member.initials}
              </span>
            </div>
          )}
        </div>
      </div>

      <h3 className="font-display text-lg font-bold leading-tight text-navy-deep sm:text-xl">
        {member.name}
      </h3>
      <p className="mt-2 text-sm font-semibold text-gold">{member.subject}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{member.position}</p>
    </article>
  );
}
