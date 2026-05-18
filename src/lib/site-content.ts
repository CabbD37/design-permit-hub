import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentMap = Record<string, string>;

export async function fetchSiteContent(): Promise<ContentMap> {
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw error;
  const map: ContentMap = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export function useSiteContent() {
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: fetchSiteContent,
    staleTime: 60_000,
  });
  return (key: string, fallback = "") => data?.[key] ?? fallback;
}

export function useSiteContentList(prefix?: string) {
  return useQuery({
    queryKey: ["site_content", "list", prefix ?? "all"],
    queryFn: async () => {
      const all = await fetchSiteContent();
      const entries = Object.entries(all).sort(([a], [b]) => a.localeCompare(b));
      return prefix ? entries.filter(([k]) => k.startsWith(prefix)) : entries;
    },
  });
}
