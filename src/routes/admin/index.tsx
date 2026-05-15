import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageEditor from '@/components/admin/PageEditor';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

interface Page {
  id: string;
  slug: string;
  title: string;
  published: boolean;
}

function AdminDashboard() {
  const { session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !isAdmin) {
      navigate({ to: '/admin/login' });
      return;
    }

    loadPages();
  }, [session, isAdmin, navigate]);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/' });
    toast.success('Signed out');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Content Manager</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {pages.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No pages found. Initialize pages first.</p>
            <Button onClick={loadPages}>Refresh</Button>
          </Card>
        ) : (
          <Tabs defaultValue={pages[0]?.slug} className="w-full">
            <TabsList>
              {pages.map((page) => (
                <TabsTrigger key={page.id} value={page.slug}>
                  {page.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {pages.map((page) => (
              <TabsContent key={page.id} value={page.slug}>
                <PageEditor page={page} onUpdate={loadPages} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
