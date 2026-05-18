import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Proven Design & Consulting | Long Beach, CA" },
      {
        name: "description",
        content:
          "Contact Proven Design & Consulting for architectural design and permitting in Long Beach, CA. Call (562) 555-0128 or send a project inquiry.",
      },
      { property: "og:title", content: "Contact Proven Design & Consulting" },
      {
        property: "og:description",
        content:
          "Get in touch about architectural design, permit-ready blueprints, and city submittals in Long Beach, CA.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const t = useSiteContent();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Simulated submit — wire to Lovable Cloud or email service when ready.
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thanks — we'll get back to you within one business day.");
    }, 600);
  }

  return (
    <>
      <section className="px-6 pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("contact.hero.eyebrow")}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-balance max-w-[22ch]">
            {t("contact.hero.title")}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-[58ch] leading-relaxed">
            {t("contact.hero.body")}
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Info column */}
          <aside className="lg:col-span-2 flex flex-col gap-8">
            {[
              {
                icon: Phone,
                label: "Phone",
                value: t("contact.phone"),
                href: t("contact.phone_href", "tel:+15625550128"),
              },
              {
                icon: Mail,
                label: "Email",
                value: t("contact.email"),
                href: `mailto:${t("contact.email")}`,
              },
              {
                icon: MapPin,
                label: "Office",
                value: t("contact.office"),
              },
            ].map((row) => (
              <div key={row.label} className="flex gap-4">
                <div className="size-10 bg-muted rounded-sm flex items-center justify-center shrink-0">
                  <row.icon className="size-4" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {row.label}
                  </div>
                  {row.href ? (
                    <a href={row.href} className="text-sm font-medium hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    <div className="text-sm font-medium">{row.value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-rule pt-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Service Area
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-[36ch]">
                {t("contact.service_area")}
              </p>
            </div>

            <div className="border-t border-rule pt-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Hours
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("contact.hours")}
              </p>
            </div>
          </aside>

          {/* Form column */}
          <div className="lg:col-span-3 ring-1 ring-rule rounded-xl bg-card p-8 md:p-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Phone" name="phone" type="tel" />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    className="bg-background border-b border-input py-2 text-sm focus:border-foreground focus:outline-none"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    <option>Residential Addition</option>
                    <option>ADU / Guest House</option>
                    <option>Remodel</option>
                    <option>New Construction</option>
                    <option>Commercial</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <Field label="Project Address (optional)" name="address" />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                  Project Details
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your site, scope, and timeline…"
                  className="bg-background border border-input rounded-sm p-3 text-sm focus:border-foreground focus:outline-none resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-foreground text-background text-sm py-3 px-6 rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? "Sending…" : "Send Inquiry"}
              </button>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to be contacted about your project. We don't share your
                information.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="bg-background border-b border-input py-2 text-sm focus:border-foreground focus:outline-none"
      />
    </div>
  );
}
