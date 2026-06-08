'use client';

import { useContent } from '@/components/providers/content-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { saveProject, deleteProject } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';
import { ImageUploadField } from '@/components/forms/image-upload-field';

export default function AdminProjectsPage() {
  const { projects, refresh } = useContent();
  const { toast } = useToast();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      slug: '',
      city: '',
      country: '',
      year: new Date().getFullYear(),
      type: 'residential',
      description: '',
      images: ['/images/placeholder.svg'],
      relatedProductSlugs: [],
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    await saveProject({
      ...values,
      relatedProductSlugs: values.relatedProductSlugs ?? [],
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'Project saved', description: values.name });
    await refresh();
    form.reset();
  };

  const handleDelete = async (slug: string) => {
    await deleteProject(slug);
    toast({ title: 'Project deleted' });
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Projects</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Manage projects</h1>
      </div>
      <form className="grid gap-4 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6 md:grid-cols-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="md:col-span-2">
          <Label>Name</Label>
          <Input {...form.register('name')} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...form.register('slug')} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...form.register('city')} />
        </div>
        <div>
          <Label>Country</Label>
          <Input {...form.register('country')} />
        </div>
        <div>
          <Label>Year</Label>
          <Input type="number" {...form.register('year', { valueAsNumber: true })} />
        </div>
        <div>
          <Label>Type</Label>
          <Input {...form.register('type')} />
        </div>
        <div className="md:col-span-3">
          <Label>Description</Label>
          <Input {...form.register('description')} />
        </div>
        <div>
          <Label>Images</Label>
          <Input onBlur={(e) => form.setValue('images', split(e.target.value))} />
          <ImageUploadField
            label="Upload image"
            folder="projects"
            onUploaded={(url) => form.setValue('images', [...(form.getValues('images') ?? []), url])}
          />
        </div>
        <div>
          <Label>Related Products</Label>
          <Input onBlur={(e) => form.setValue('relatedProductSlugs', split(e.target.value))} />
        </div>
        <Button type="submit" className="md:col-span-3">
          Save Project
        </Button>
      </form>
      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Location</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.slug}>
                <TableCell>{project.name}</TableCell>
                <TableCell>
                  {project.city}, {project.country}
                </TableCell>
                <TableCell>{project.type}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDelete(project.slug)}>
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
