import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileText, Stamp, Check } from "lucide-react";

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

const detailedServices = [
  {
    icon: Compass,
    n: "01",
    title: "Architectural Design",
    intro:
      "Concept-through-design-development for residential additions, ADUs, remodels, and small commercial projects.",
    bullets: [
      "Site analysis and feasibility review",
      "Schematic floor plans",
      "Design development drawings",
      "Material and finish guidance",
    ],
  },
  {
    icon: FileText,
    n: "02",
    title: "Permit Set of Blueprints",
    intro:
      "Complete construction documents engineered to pass plan check on the first or second round.",
    bullets: [
      "Architectural floor, elevation, and section drawings",
      "Site, roof, and demolition plans",
      "Title 24 energy compliance documentation",
      "Coordination with structural, MEP, and Title 24 consultants",
    ],
  },
  {
    icon: Stamp,
    n: "03",
    title: "Permitting & City Submittals",
    intro:
      "End-to-end expediting with the City of Long Beach, Signal Hill, Seal Beach, and surrounding LA County jurisdictions.",
    bullets: [
      "Pre-application meetings and zoning research",
      "Plan-check submittal and routing",
      "Corrections and resubmittals",
      "Final permit issuance and inspection support",
    ],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Capabilities
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-[24ch]">
            Three services. One approval-first process.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-[58ch] leading-relaxed">
            We design, draft, and shepherd projects through the City of Long Beach so construction
            starts on schedule.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto flex flex-col">
          {detailedServices.map((s, i) => (
            <article
              key={s.n}
              className={`grid lg:grid-cols-12 gap-10 py-14 ${
                i !== 0 ? "border-t border-rule" : ""
              }`}
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
            A clear path from sketch to permit.
          </h2>
          <div className="mt-12 grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Consultation", d: "We review your site, scope, and goals." },
              { n: "02", t: "Design", d: "Schematic plans and design development." },
              { n: "03", t: "Permit Set", d: "Construction documents and Title 24." },
              { n: "04", t: "Submittal", d: "Plan-check, corrections, approval." },
            ].map((p) => (
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
              Have a project in mind?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tell us about your site and timeline. We'll respond within one business day.
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
