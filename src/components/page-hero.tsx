import type { ReactNode } from "react";

type HeroStat = {
  value: string;
  label: string;
};

type PageHeroProps = {
  eyebrow: string;
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
    <section className="section-shell relative overflow-hidden bg-navy-deep py-fluid-hero text-primary-foreground">
      {backgroundImage ? (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      ) : null}
      <div className="soft-grid absolute inset-0 opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/65 via-navy-deep/82 to-navy-deep" />

      <div className="container-fluid relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className={`${aside ? "lg:col-span-7" : "lg:col-span-12"} text-center lg:text-left`}>
          <p className="section-kicker text-[10px] font-bold uppercase tracking-[0.28em] text-sky sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-sky" />
            {eyebrow}
          </p>
          <h1 className="headline-balance mt-5 font-display text-fluid-h1 font-black sm:mt-6">{title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-fluid-base text-primary-foreground/80 sm:mt-8 lg:mx-0">
            {description}
          </p>

          {stats.length ? (
            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-[1.4rem] px-4 py-4 text-left sm:px-5">
                  <div className="font-display text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
                    {stat.label}
                  </div>
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
