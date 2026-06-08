'use client';

import { useContent } from '@/components/providers/content-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsSchema, type NewsFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { saveNews, deleteNews } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';
import { ImageUploadField } from '@/components/forms/image-upload-field';

export default function AdminNewsPage() {
  const { news, refresh } = useContent();
  const { toast } = useToast();
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      slug: '',
      date: new Date().toISOString().slice(0, 10),
      category: 'press',
      excerpt: '',
      content: '',
      heroImage: '/images/placeholder.svg',
      tags: [],
    },
  });

  const onSubmit = async (values: NewsFormValues) => {
    await saveNews({
      ...values,
      tags: split(values.tags ?? []),
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'News saved', description: values.title });
    await refresh();
    form.reset();
  };

  const handleDelete = async (slug: string) => {
    await deleteNews(slug);
    toast({ title: 'News removed' });
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">News</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Editorial updates</h1>
      </div>
      <form className="grid gap-4 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label>Title</Label>
          <Input {...form.register('title')} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...form.register('slug')} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" {...form.register('date')} />
        </div>
        <div>
          <Label>Category</Label>
          <Input {...form.register('category')} />
        </div>
        <div className="md:col-span-2">
          <Label>Excerpt</Label>
          <Textarea rows={2} {...form.register('excerpt')} />
        </div>
        <div className="md:col-span-2">
          <Label>Content (Markdown)</Label>
          <Textarea rows={4} {...form.register('content')} />
        </div>
        <div>
          <Label>Hero Image</Label>
          <Input {...form.register('heroImage')} />
          <ImageUploadField
            label="Upload hero"
            folder="news"
            onUploaded={(url) => form.setValue('heroImage', url)}
          />
        </div>
        <div>
          <Label>Tags</Label>
          <Input onBlur={(e) => form.setValue('tags', split(e.target.value))} />
        </div>
        <Button type="submit" className="md:col-span-2">
          Save Article
        </Button>
      </form>
      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((article) => (
              <TableRow key={article.slug}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.date}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDelete(article.slug)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function split(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
