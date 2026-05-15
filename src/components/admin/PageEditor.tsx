import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader as Loader2 } from 'lucide-react';

interface PageEditorProps {
  page: {
    id: string;
    slug: string;
    title: string;
    published: boolean;
  };
  onUpdate: () => void;
}

interface PageSection {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
}

interface SectionItem {
  id: string;
  content: Record<string, any>;
  sort_order: number;
}

export default function PageEditor({ page, onUpdate }: PageEditorProps) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [items, setItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(page.published);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSections();
  }, [page.id]);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('sort_order');

      if (error) throw error;

      setSections(data || []);
      if (data && data.length > 0) {
        setSelectedSection(data[0]);
        loadItems(data[0].id);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load sections');
      setLoading(false);
    }
  };

  const loadItems = async (sectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('page_section_items')
        .select('*')
        .eq('section_id', sectionId)
        .order('sort_order');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      toast.error('Failed to load items');
    }
  };

  const handlePublishToggle = async () => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('pages')
        .update({ published: !published })
        .eq('id', page.id);

      if (error) throw error;
      setPublished(!published);
      toast.success(published ? 'Page unpublished' : 'Page published');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update page');
    } finally {
      setUpdating(false);
    }
  };

  const handleItemUpdate = async (itemId: string, content: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('page_section_items')
        .update({ content })
        .eq('id', itemId);

      if (error) throw error;
      toast.success('Item updated');
      loadItems(selectedSection!.id);
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{page.title}</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor="publish">Published</Label>
          <Switch
            id="publish"
            checked={published}
            onCheckedChange={handlePublishToggle}
            disabled={updating}
          />
        </div>
      </div>

      {sections.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No sections found for this page.
        </Card>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSection(section);
                    loadItems(section.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                    selectedSection?.id === section.id
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            {selectedSection && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{selectedSection.title}</h3>
                  {selectedSection.description && (
                    <p className="text-sm text-muted-foreground">{selectedSection.description}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items in this section.</p>
                  ) : (
                    items.map((item, idx) => (
                      <Card key={item.id} className="p-4 space-y-3">
                        <h4 className="font-medium text-sm">Item {idx + 1}</h4>
                        <SectionItemEditor
                          item={item}
                          onUpdate={(content) => handleItemUpdate(item.id, content)}
                        />
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionItemEditor({
  item,
  onUpdate,
}: {
  item: SectionItem;
  onUpdate: (content: Record<string, any>) => void;
}) {
  const [content, setContent] = useState(item.content);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: any) => {
    const updated = { ...content, [key]: value };
    setContent(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(content);
    setHasChanges(false);
  };

  return (
    <div className="space-y-3">
      {Object.entries(content).map(([key, value]) => (
        <div key={key}>
          <Label className="text-xs">{key}</Label>
          {typeof value === 'string' && value.length > 100 ? (
            <Textarea
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          ) : (
            <Input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="mt-1"
            />
          )}
        </div>
      ))}

      {hasChanges && (
        <Button onClick={handleSave} size="sm" className="w-full">
          Save Changes
        </Button>
      )}
    </div>
  );
}
