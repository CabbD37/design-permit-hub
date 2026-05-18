import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule pt-20 pb-10 px-6 mt-32">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-5 bg-foreground rounded-[2px]" aria-hidden />
            <span className="font-medium tracking-tight text-sm">Proven Design &amp; Consulting</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-[28ch] leading-relaxed">
            Architectural design, permit-ready blueprints, and city submittals serving Long Beach and greater Los Angeles County.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Service Area</span>
          <p className="text-sm">
            Los Angeles County, Orange County,<br />
            focusing in Long Beach and City of LA.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Contact</span>
          <p className="text-sm">
            Long Beach, CA<br />
            <a href="mailto:Danny@provendcservices.com" className="hover:underline">Danny@provendcservices.com</a><br />
            <a href="tel:+15625550128" className="hover:underline">(562) 555-0128</a>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proven Design &amp; Consulting, LLC.
        </span>
        <div className="flex gap-5 text-xs text-muted-foreground">
          <Link to="/services" className="hover:text-foreground">Services</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
