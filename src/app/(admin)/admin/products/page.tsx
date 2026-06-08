'use client';

import { useContent } from '@/components/providers/content-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { saveProduct, deleteProduct } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';
import { ImageUploadField } from '@/components/forms/image-upload-field';

export default function AdminProductsPage() {
  const { products, brands, refresh } = useContent();
  const { toast } = useToast();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      brandSlug: '',
      category: '',
      priceTier: 'premium',
      description: '',
      materials: [],
      dimensions: '',
      finishes: [],
      images: ['/images/placeholder.svg'],
      tags: [],
      featured: false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    await saveProduct({
      ...values,
      materials: normalize(values.materials),
      finishes: normalize(values.finishes),
      images: normalize(values.images),
      tags: normalize(values.tags ?? []),
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'Product saved', description: values.name });
    await refresh();
    form.reset();
  };

  const handleDelete = async (slug: string) => {
    await deleteProduct(slug);
    toast({ title: 'Product deleted' });
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Products</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Manage collections</h1>
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
          <Label>Brand Slug</Label>
          <Input list="brand-slugs" {...form.register('brandSlug')} />
          <datalist id="brand-slugs">
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Category</Label>
          <Input {...form.register('category')} />
        </div>
        <div>
          <Label>Price Tier</Label>
          <Input {...form.register('priceTier')} />
        </div>
        <div className="md:col-span-3">
          <Label>Description</Label>
          <Input {...form.register('description')} />
        </div>
        <div>
          <Label>Materials (comma separated)</Label>
          <Input onBlur={(e) => form.setValue('materials', split(e.target.value))} />
        </div>
        <div>
          <Label>Finishes</Label>
          <Input onBlur={(e) => form.setValue('finishes', split(e.target.value))} />
        </div>
        <div>
          <Label>Dimensions</Label>
          <Input {...form.register('dimensions')} />
        </div>
        <div>
          <Label>Images</Label>
          <Input onBlur={(e) => form.setValue('images', split(e.target.value))} />
          <ImageUploadField
            label="Upload image"
            folder="products"
            onUploaded={(url) => form.setValue('images', [...(form.getValues('images') ?? []), url])}
          />
        </div>
        <div>
          <Label>Tags</Label>
          <Input onBlur={(e) => form.setValue('tags', split(e.target.value))} />
        </div>
        <Button type="submit" className="md:col-span-3">
          Save Product
        </Button>
      </form>
      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Brand</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.slug}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brandSlug}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDelete(product.slug)}>
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

function split(value: string) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function normalize(values: string[] | string) {
  return Array.isArray(values) ? values : split(String(values ?? ''));
}
