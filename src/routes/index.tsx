import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileText, Stamp } from "lucide-react";
import heroStudio from "@/assets/hero-studio.jpg";
import permitDetail from "@/assets/permit-detail.jpg";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Proven Design & Consulting — Architectural Design & Permitting in Long Beach & LA County" },
      {
        name: "description",
        content:
          "Permit-ready architectural blueprints and full-service city submittals across Long Beach and Los Angeles County. Residential, ADU, and commercial projects.",
      },
      { property: "og:title", content: "Proven Design & Consulting — Long Beach, CA" },
      {
        property: "og:description",
        content:
          "Architectural design, permit-ready blueprints, and city submittals for projects across Long Beach and LA County.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const serviceIcons = [Compass, FileText, Stamp];

function HomePage() {
  const t = useSiteContent();

  const services = [1, 2, 3].map((i) => ({
    key: `service-${i}`,
    icon: serviceIcons[i - 1],
    title: t(`home.service_${i}.title`),
    desc: t(`home.service_${i}.desc`),
  }));

  const whyRows = [1, 2, 3].map((i) => ({
    key: `why-${i}`,
    n: `0${i}`,
    t: t(`home.why_${i}.title`),
    d: t(`home.why_${i}.desc`),
  }));

  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("home.hero.eyebrow")}
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-balance max-w-[22ch]">
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground text-pretty max-w-[58ch] leading-relaxed">
            {t("home.hero.body")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-foreground text-background text-sm py-3 px-4 rounded-sm hover:opacity-90 transition-opacity"
            >
              {t("home.hero.cta_primary")} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm py-3 px-4 rounded-sm ring-1 ring-border hover:bg-muted transition-colors"
            >
              {t("home.hero.cta_secondary")}
            </Link>
          </div>

          <div className="mt-16 overflow-hidden rounded-md ring-1 ring-rule">
            <img
              src={heroStudio}
              alt="A modern Long Beach architectural drafting studio with rolled blueprints and warm afternoon light"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover aspect-[21/9]"
            />
          </div>
        </div>
      </section>

      {/* Services snapshot */}
      <section className="px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-px bg-rule ring-1 ring-rule rounded-md overflow-hidden">
            {services.map((s) => (
              <div key={s.key} className="bg-card p-8 flex flex-col gap-4">
                <div className="size-9 bg-muted rounded-sm flex items-center justify-center">
                  <s.icon className="size-4 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[42ch]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm text-foreground hover:underline"
            >
              See full service detail <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-6 py-24 mt-24 bg-surface">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance max-w-[24ch]">
              {t("home.why.title")}
            </h2>
            <div className="space-y-7">
              {whyRows.map((row) => (
                <div key={row.n} className="flex gap-5">
                  <div className="shrink-0 text-muted-foreground text-sm font-mono pt-0.5">
                    {row.n}
                  </div>
                  <div>
                    <h4 className="font-medium">{row.t}</h4>
                    <p className="mt-1 text-sm text-muted-foreground max-w-[52ch] leading-relaxed">
                      {row.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-md ring-1 ring-rule">
            <img
              src={permitDetail}
              alt="Stamped architectural permit submittal package with city plan-check stamp and architect's seal"
              width={1280}
              height={1600}
              loading="lazy"
              className="w-full h-auto object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 mt-24">
        <div className="max-w-7xl mx-auto ring-1 ring-rule rounded-xl p-10 md:p-12 bg-card flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-[44ch]">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{t("home.cta.title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("home.cta.body")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm py-3 px-5 rounded-sm hover:opacity-90"
            >
              {t("home.cta.button")} <ArrowRight className="size-4" />
            </Link>
            <a
              href={t("home.cta.phone_href", "tel:+15625550128")}
              className="inline-flex items-center justify-center text-sm py-3 px-5 rounded-sm ring-1 ring-border hover:bg-muted"
            >
              {t("home.cta.phone")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
