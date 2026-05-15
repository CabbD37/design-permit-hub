import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.105.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize pages
    const pages = [
      { slug: "home", title: "Home" },
      { slug: "services", title: "Services" },
      { slug: "contact", title: "Contact" },
    ];

    for (const page of pages) {
      const { data: existing } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", page.slug)
        .maybeSingle();

      if (!existing) {
        await supabase.from("pages").insert({
          slug: page.slug,
          title: page.title,
          published: true,
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Content initialized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
