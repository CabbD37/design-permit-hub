import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteContentList } from '@/lib/site-content';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader as Loader2, Save } from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

const PAGES = [
  { slug: 'home', label: 'Home' },
  { slug: 'services', label: 'Services' },
  { slug: 'contact', label: 'Contact' },
];

function AdminDashboard() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: '/admin/login' });
    else if (!isAdmin) toast.error('You do not have admin access');
  }, [session, isAdmin, loading, navigate]);

  if (loading) return <div className="p-8 flex items-center gap-2 text-sm"><Loader2 className="size-4 animate-spin" /> Loading…</div>;
  if (!session) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Not authorized</h1>
          <p className="text-sm text-muted-foreground mt-2">Signed in as {session.user.email}, but this account doesn't have admin access.</p>
          <Button onClick={async () => { await signOut(); navigate({ to: '/admin/login' }); }} className="mt-4">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Content Manager</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Edit website text — changes go live immediately.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">View site</Link>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate({ to: '/admin/login' }); }}>Sign out</Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue={PAGES[0].slug}>
          <TabsList>
            {PAGES.map((p) => <TabsTrigger key={p.slug} value={p.slug}>{p.label}</TabsTrigger>)}
          </TabsList>
          {PAGES.map((p) => (
            <TabsContent key={p.slug} value={p.slug} className="mt-6">
              <PageEditor pagePrefix={`${p.slug}.`} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function PageEditor({ pagePrefix }: { pagePrefix: string }) {
  const { data: entries, isLoading } = useSiteContentList(pagePrefix);
  const qc = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Reset drafts when entries refresh
  const baseline = useMemo(() => {
    const m: Record<string, string> = {};
    (entries ?? []).forEach(([k, v]) => { m[k] = v; });
    return m;
  }, [entries]);

  const get = (k: string) => drafts[k] ?? baseline[k] ?? '';
  const dirty = (k: string) => drafts[k] !== undefined && drafts[k] !== baseline[k];

  const save = async (key: string) => {
    setSavingKey(key);
    const { error } = await supabase
      .from('site_content')
      .update({ value: drafts[key] ?? '' })
      .eq('key', key);
    setSavingKey(null);
    if (error) { toast.error(error.message); return; }
    toast.success('Saved');
    setDrafts((d) => { const n = { ...d }; delete n[key]; return n; });
    qc.invalidateQueries({ queryKey: ['site_content'] });
  };

  if (isLoading) return <div className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Loading…</div>;
  if (!entries?.length) return <div className="text-sm text-muted-foreground">No editable content found for this page.</div>;

  return (
    <div className="space-y-5">
      {entries.map(([key, _value]) => {
        const v = get(key);
        const long = v.length > 80 || v.includes('\n') || key.endsWith('.body') || key.endsWith('.intro') || key.endsWith('.bullets') || key.endsWith('.desc');
        const isBullets = key.endsWith('.bullets');
        return (
          <div key={key} className="border border-border rounded-md p-4 bg-card">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Label className="text-xs font-mono text-muted-foreground">{key.replace(pagePrefix, '')}</Label>
              {dirty(key) && (
                <Button size="sm" onClick={() => save(key)} disabled={savingKey === key}>
                  {savingKey === key ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                  <span className="ml-1.5">Save</span>
                </Button>
              )}
            </div>
            {isBullets && (
              <p className="text-[11px] text-muted-foreground mb-1.5">Separate bullets with <code className="font-mono">|</code></p>
            )}
            {long ? (
              <Textarea
                value={v}
                onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                rows={isBullets ? 4 : 3}
                className="resize-y"
              />
            ) : (
              <Input value={v} onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))} />
            )}
          </div>
        );
      })}
    </div>
  );
}
