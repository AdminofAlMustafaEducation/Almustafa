import type { ReactNode } from "react";

type HeroStat = {
  value: string;
  label: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  backgroundImage?: string;
  stats?: HeroStat[];
  aside?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  backgroundImage,
  stats = [],
  aside,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-deep pt-16 pb-20 text-primary-foreground sm:pt-20 sm:pb-24">
      {backgroundImage ? (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/88 to-navy-deep" />

      <div className="container-fluid relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
          {eyebrow ? (
            <p className="text-sm font-semibold text-gold-soft">{eyebrow}</p>
          ) : null}
          <h1 className="headline-balance mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            {description}
          </p>

          {stats.length ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-white/65">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {aside ? <div className="lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  );
}
