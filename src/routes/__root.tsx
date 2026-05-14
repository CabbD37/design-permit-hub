import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Proven Design & Consulting, LLC",
  description:
    "Architectural design, permit-ready blueprints, and city permitting services in Long Beach, California.",
  areaServed: [
    { "@type": "City", name: "Long Beach" },
    { "@type": "AdministrativeArea", name: "Los Angeles County" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Long Beach",
    addressRegion: "CA",
    addressCountry: "US",
  },
  url: "/",
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-semibold tracking-tight">404</h1>
        <h2 className="mt-4 text-xl font-medium">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Proven Design & Consulting — Architectural Design & Permitting in Long Beach, CA" },
      {
        name: "description",
        content:
          "Architectural design, permit-ready blueprints, and city permitting services for residential and commercial projects in Long Beach, California.",
      },
      { name: "author", content: "Proven Design & Consulting, LLC" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Proven Design & Consulting" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORG_JSONLD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
