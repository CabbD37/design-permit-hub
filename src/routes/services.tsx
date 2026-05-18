import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileText, Stamp, Check } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Architectural Design, Blueprints & Permitting | Proven Design & Consulting" },
      {
        name: "description",
        content:
          "Architectural design, permit-set blueprints, and full-service city permitting in Long Beach, CA. Residential additions, ADUs, remodels, and commercial projects.",
      },
      { property: "og:title", content: "Services | Proven Design & Consulting" },
      {
        property: "og:description",
        content:
          "Architectural design, permit-ready blueprints, and city submittals across Long Beach and LA County.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

const icons = [Compass, FileText, Stamp];

function ServicesPage() {
  const t = useSiteContent();

  const detailedServices = [1, 2, 3].map((i) => ({
    icon: icons[i - 1],
    n: `0${i}`,
    title: t(`services.s${i}.title`),
    intro: t(`services.s${i}.intro`),
    bullets: t(`services.s${i}.bullets`).split("|").map((s) => s.trim()).filter(Boolean),
  }));

  const process = [1, 2, 3, 4].map((i) => ({
    n: `0${i}`,
    t: t(`services.process_${i}.title`),
    d: t(`services.process_${i}.desc`),
  }));

  return (
    <>
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("services.hero.eyebrow")}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-[24ch]">
            {t("services.hero.title")}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-[58ch] leading-relaxed">
            {t("services.hero.body")}
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col">
          {detailedServices.map((s, i) => (
            <article
              key={s.n}
              className={`grid lg:grid-cols-12 gap-10 py-14 ${i !== 0 ? "border-t border-rule" : ""}`}
            >
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-muted-foreground">{s.n}</span>
                  <div className="size-9 bg-muted rounded-sm flex items-center justify-center">
                    <s.icon className="size-4" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">{s.title}</h2>
              </div>
              <div className="lg:col-span-8 flex flex-col gap-6">
                <p className="text-base text-muted-foreground max-w-[60ch] leading-relaxed">
                  {s.intro}
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm">
                      <Check className="size-4 mt-0.5 shrink-0 text-foreground" strokeWidth={2} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Process strip */}
      <section className="px-6 mt-12 py-20 bg-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight max-w-[28ch]">
            {t("services.process.title")}
          </h2>
          <div className="mt-12 grid md:grid-cols-4 gap-8">
            {process.map((p) => (
              <div key={p.n} className="flex flex-col gap-2">
                <span className="text-xs font-mono text-muted-foreground">{p.n}</span>
                <h4 className="font-medium">{p.t}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 mt-24">
        <div className="max-w-7xl mx-auto ring-1 ring-rule rounded-xl p-10 md:p-12 bg-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-[44ch]">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {t("services.cta.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("services.cta.body")}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm py-3 px-5 rounded-sm hover:opacity-90 self-start md:self-auto"
          >
            Contact us <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
