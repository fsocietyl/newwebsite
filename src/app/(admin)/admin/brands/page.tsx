'use client';

import { useContent } from '@/components/providers/content-provider';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema, type BrandFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { saveBrand, deleteBrand } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';
import { ImageUploadField } from '@/components/forms/image-upload-field';

export default function AdminBrandsPage() {
  const { brands, refresh } = useContent();
  const { toast } = useToast();
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      countryTag: '',
      heroImage: '/images/placeholder.svg',
      logoImage: '/images/placeholder.svg',
      featured: false,
    },
  });

  const onSubmit = async (values: BrandFormValues) => {
    await saveBrand({
      ...values,
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'Brand saved', description: values.name });
    await refresh();
    form.reset();
  };

  const handleDelete = async (slug: string) => {
    await deleteBrand(slug);
    toast({ title: 'Brand removed' });
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Brands</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Manage brands</h1>
      </div>
      <form className="grid gap-4 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...form.register('name')} />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...form.register('slug')} />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Input {...form.register('description')} />
        </div>
        <div>
          <Label>Country</Label>
          <Input {...form.register('countryTag')} />
        </div>
        <div>
          <Label>Hero Image URL</Label>
          <Input {...form.register('heroImage')} />
          <ImageUploadField
            label="Upload hero"
            folder="brands"
            onUploaded={(url) => form.setValue('heroImage', url)}
          />
        </div>
        <div>
          <Label>Logo Image URL</Label>
          <Input {...form.register('logoImage')} />
          <ImageUploadField
            label="Upload logo"
            folder="brands"
            onUploaded={(url) => form.setValue('logoImage', url)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="featured"
            control={form.control}
            render={({ field }) => (
              <Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(Boolean(value))} />
            )}
          />
          <Label>Featured</Label>
        </div>
        <Button type="submit" className="md:col-span-2">
          Save Brand
        </Button>
      </form>
      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Country</TableHeaderCell>
              <TableHeaderCell>Featured</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.slug}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.countryTag}</TableCell>
                <TableCell>{brand.featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDelete(brand.slug)}>
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
