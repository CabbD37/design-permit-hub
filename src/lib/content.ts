import { supabase } from '@/integrations/supabase/client';

export async function getPageContent(pageSlug: string) {
  try {
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id, title, slug, published')
      .eq('slug', pageSlug)
      .eq('published', true)
      .maybeSingle();

    if (pageError || !page) {
      return null;
    }

    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('id, slug, title, description, sort_order')
      .eq('page_id', page.id)
      .order('sort_order');

    if (sectionsError) {
      return null;
    }

    const sectionIds = sections?.map((s) => s.id) || [];
    const { data: items, error: itemsError } = await supabase
      .from('page_section_items')
      .select('id, section_id, content, sort_order')
      .in('section_id', sectionIds)
      .order('sort_order');

    if (itemsError) {
      return null;
    }

    const itemsBySection = (items || []).reduce(
      (acc, item) => {
        if (!acc[item.section_id]) {
          acc[item.section_id] = [];
        }
        acc[item.section_id].push(item);
        return acc;
      },
      {} as Record<string, typeof items>
    );

    return {
      page,
      sections: sections?.map((s) => ({
        ...s,
        items: itemsBySection[s.id] || [],
      })),
    };
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}
