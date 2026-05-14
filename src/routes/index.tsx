import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileText, Stamp } from "lucide-react";
import heroStudio from "@/assets/hero-studio.jpg";
import permitDetail from "@/assets/permit-detail.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Proven Design & Consulting — Architectural Design & Permitting in Long Beach, CA" },
      {
        name: "description",
        content:
          "Permit-ready architectural blueprints and full-service city submittals in Long Beach, California. Residential, ADU, and commercial projects.",
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

const services = [
  {
    icon: Compass,
    title: "Architectural Design",
    desc: "Concepts, floor plans, and spatial layouts tailored to California coastal density and residential zoning.",
  },
  {
    icon: FileText,
    title: "Permit-Ready Blueprints",
    desc: "Construction documents with structural details and Title 24 compliance, ready for plan check.",
  },
  {
    icon: Stamp,
    title: "City Submittals",
    desc: "We handle the Long Beach plan-check process, corrections, and approvals on your behalf.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pt-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Long Beach, California
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-balance max-w-[22ch]">
            Architectural blueprints designed for city approval.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground text-pretty max-w-[58ch] leading-relaxed">
            Proven Design &amp; Consulting bridges architectural vision and municipal requirements —
            delivering permit-ready design sets and full-service city submittals for the Long Beach community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-foreground text-background text-sm py-3 px-4 rounded-sm hover:opacity-90 transition-opacity"
            >
              View Services <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm py-3 px-4 rounded-sm ring-1 ring-border hover:bg-muted transition-colors"
            >
              Start a Project
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
              <div key={s.title} className="bg-card p-8 flex flex-col gap-4">
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
              Local knowledge is the difference between a project and a permit.
            </h2>
            <div className="space-y-7">
              {[
                {
                  n: "01",
                  t: "Long Beach Specialists",
                  d: "Deep familiarity with Long Beach Development Services, Specific Plans, and Coastal Zone requirements.",
                },
                {
                  n: "02",
                  t: "Permit-First Drafting",
                  d: "Sets are built to be read by plan-checkers, contractors, and inspectors alike — minimizing corrections and field changes.",
                },
                {
                  n: "03",
                  t: "Full-Service Expediting",
                  d: "From feasibility review to final approval, we handle the bureaucracy so your construction stays on schedule.",
                },
              ].map((row) => (
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
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Start your submittal.</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Schedule a consultation or send preliminary sketches for a project feasibility review.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background text-sm py-3 px-5 rounded-sm hover:opacity-90"
            >
              Request Consultation <ArrowRight className="size-4" />
            </Link>
            <a
              href="tel:+15625550128"
              className="inline-flex items-center justify-center text-sm py-3 px-5 rounded-sm ring-1 ring-border hover:bg-muted"
            >
              (562) 555-0128
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
