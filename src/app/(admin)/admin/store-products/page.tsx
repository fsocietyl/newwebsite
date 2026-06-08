'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUploadField } from '@/components/forms/image-upload-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  getStoreTranslation,
  normalizeStoreTranslations,
  STORE_TEXT_LOCALES,
  type StoreProductRecord,
  type StoreProductTranslations,
} from '@/lib/store-products';

type StoreProductFormState = {
  id: string | null;
  slug: string;
  nameTranslations: StoreProductTranslations;
  descriptionTranslations: StoreProductTranslations;
  price: string;
  category: string;
  images: string[];
};

type AdminLocale = (typeof STORE_TEXT_LOCALES)[number];

const initialForm: StoreProductFormState = {
  id: null,
  slug: '',
  nameTranslations: { en: '', tr: '', ar: '' },
  descriptionTranslations: { en: '', tr: '', ar: '' },
  price: '',
  category: '',
  images: [],
};

export default function AdminStoreProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<StoreProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreProductFormState>(initialForm);
  const [activeLocale, setActiveLocale] = useState<AdminLocale>('en');
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [applyingDeletes, setApplyingDeletes] = useState(false);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort((left, right) =>
        left.localeCompare(right, 'tr'),
      ),
    [products],
  );

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetch('/api/store-products', { cache: 'no-store' });
      const data = (await response.json()) as StoreProductRecord[];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('[admin-store-products] load failed', error);
      toast({ title: 'Load failed', description: 'Store products could not be loaded.' });
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof StoreProductFormState>(key: K, value: StoreProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleEdit(product: StoreProductRecord) {
    if (pendingDeleteIds.includes(product.id)) {
      return;
    }
    setForm({
      id: product.id,
      slug: product.slug,
      nameTranslations: normalizeStoreTranslations(product.nameTranslations),
      descriptionTranslations: normalizeStoreTranslations(product.descriptionTranslations),
      price: String(product.price),
      category: product.category,
      images: product.images,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        slug: form.slug.trim(),
        nameTranslations: {
          en: form.nameTranslations.en.trim(),
          tr: form.nameTranslations.tr.trim(),
          ar: form.nameTranslations.ar.trim(),
        },
        descriptionTranslations: {
          en: form.descriptionTranslations.en.trim(),
          tr: form.descriptionTranslations.tr.trim(),
          ar: form.descriptionTranslations.ar.trim(),
        },
        price: Number(form.price || 0),
        category: form.category.trim(),
        images: form.images.filter(Boolean),
      };

      const response = await fetch(form.id ? `/api/store-products/${form.id}` : '/api/store-products', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      toast({
        title: form.id ? 'Store product updated' : 'Store product created',
        description: payload.nameTranslations.en || payload.nameTranslations.tr || payload.nameTranslations.ar,
      });
      setForm(initialForm);
      await loadProducts();
    } catch (error) {
      console.error('[admin-store-products] save failed', error);
      toast({ title: 'Save failed', description: 'The store product could not be saved.' });
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(product: StoreProductRecord) {
    setPendingDeleteIds((current) =>
      current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id],
    );
  }

  async function applyPendingDeletes() {
    if (pendingDeleteIds.length === 0) {
      return;
    }

    setApplyingDeletes(true);
    try {
      for (const id of pendingDeleteIds) {
        const response = await fetch(`/api/store-products/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error(`Delete failed: ${response.status}`);
        }
      }

      if (form.id && pendingDeleteIds.includes(form.id)) {
        setForm(initialForm);
      }

      toast({
        title: 'Deletes applied',
        description: `${pendingDeleteIds.length} product${pendingDeleteIds.length === 1 ? '' : 's'} removed.`,
      });
      setPendingDeleteIds([]);
      await loadProducts();
    } catch (error) {
      console.error('[admin-store-products] bulk delete failed', error);
      toast({ title: 'Delete failed', description: 'Some staged deletes could not be applied.' });
    } finally {
      setApplyingDeletes(false);
    }
  }

  function updateTranslationField(field: 'nameTranslations' | 'descriptionTranslations', locale: AdminLocale, value: string) {
    setForm((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [locale]: value,
      },
    }));
  }

  function updateImageAt(index: number, value: string) {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => (imageIndex === index ? value : image)),
    }));
  }

  function removeImageAt(index: number) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  function moveImage(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= form.images.length || to >= form.images.length) {
      return;
    }

    setForm((current) => {
      const nextImages = [...current.images];
      const [moved] = nextImages.splice(from, 1);
      nextImages.splice(to, 0, moved);
      return { ...current, images: nextImages };
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Store Products</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Manage live store items</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          Create, update, and remove the products shown in the public store. Drag images to change which photo is first, and stage deletes until you are ready to apply them.
        </p>
      </div>

      {pendingDeleteIds.length > 0 && (
        <div className="flex flex-col gap-3 border border-[var(--gold-border)] bg-[rgba(201,168,76,0.08)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-primary)]">
            {pendingDeleteIds.length} product{pendingDeleteIds.length === 1 ? '' : 's'} marked for deletion.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setPendingDeleteIds([])}>
              Clear Selection
            </Button>
            <Button type="button" onClick={applyPendingDeletes} disabled={applyingDeletes}>
              {applyingDeletes ? 'Applying…' : `Apply Deletes (${pendingDeleteIds.length})`}
            </Button>
          </div>
        </div>
      )}

      <form className="grid gap-4 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6 md:grid-cols-3" onSubmit={handleSubmit}>
        <div className="md:col-span-3">
          <div className="flex flex-wrap gap-2">
            {STORE_TEXT_LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveLocale(locale)}
                className={`min-w-14 border px-3 py-2 text-[10px] uppercase tracking-[0.28em] transition ${
                  activeLocale === locale
                    ? 'border-[var(--gold)] bg-[var(--gold)] text-black'
                    : 'border-[var(--gold-border)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--gold)] hover:text-white'
                }`}
              >
                {locale}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <Label>Name ({activeLocale.toUpperCase()})</Label>
          <Input
            value={form.nameTranslations[activeLocale]}
            onChange={(event) => updateTranslationField('nameTranslations', activeLocale, event.target.value)}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={form.slug} onChange={(event) => updateField('slug', event.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Input list="store-category-options" value={form.category} onChange={(event) => updateField('category', event.target.value)} />
          <datalist id="store-category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Price</Label>
          <Input type="number" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Label>Description ({activeLocale.toUpperCase()})</Label>
          <Textarea
            rows={4}
            value={form.descriptionTranslations[activeLocale]}
            onChange={(event) => updateTranslationField('descriptionTranslations', activeLocale, event.target.value)}
          />
        </div>
        <div className="md:col-span-3">
          <Label>Images</Label>
          <div className="mt-3">
            <ImageUploadField
              label="Upload image"
              folder="store-products"
              onUploaded={(url) => updateField('images', [...form.images, url])}
            />
          </div>
          {form.images.length > 0 && (
            <div className="mt-4 space-y-3">
              {form.images.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  draggable
                  onDragStart={() => setDraggedImageIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedImageIndex !== null) {
                      moveImage(draggedImageIndex, index);
                    }
                    setDraggedImageIndex(null);
                  }}
                  onDragEnd={() => setDraggedImageIndex(null)}
                  className={`grid gap-3 border p-3 md:grid-cols-[112px_minmax(0,1fr)_auto] ${
                    draggedImageIndex === index
                      ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.06)]'
                      : 'border-white/10 bg-black/30'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden border border-white/10 bg-black/40">
                    <Image
                      src={imageUrl}
                      alt={form.nameTranslations[activeLocale] || form.nameTranslations.en || 'Store product'}
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 bg-[var(--gold)] px-2 py-1 text-[9px] uppercase tracking-[0.24em] text-black">
                        Main
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL {index + 1}</Label>
                    <Input value={imageUrl} onChange={(event) => updateImageAt(index, event.target.value)} />
                    <p className="text-xs text-[var(--text-secondary)]">Drag with mouse to change order. The first image is used as the main photo.</p>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 md:flex-col">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => moveImage(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => moveImage(index, Math.min(form.images.length - 1, index + 1))}
                      disabled={index === form.images.length - 1}
                    >
                      Down
                    </Button>
                    <Button type="button" variant="outline" onClick={() => removeImageAt(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-3 flex flex-wrap gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : form.id ? 'Update Product' : 'Create Product'}
          </Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={() => setForm(initialForm)}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Photo</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Images</TableHeaderCell>
            <TableHeaderCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell />
              <TableCell>Loading…</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className={pendingDeleteIds.includes(product.id) ? 'opacity-45' : undefined}>
                <TableCell>
                  <div className="relative h-16 w-16 overflow-hidden border border-white/10 bg-black/40">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  </div>
                </TableCell>
                <TableCell>{getStoreTranslation(product.nameTranslations, activeLocale)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.images.length} image{product.images.length === 1 ? '' : 's'}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleEdit(product)}
                    disabled={pendingDeleteIds.includes(product.id)}
                  >
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => handleDelete(product)}>
                    {pendingDeleteIds.includes(product.id) ? 'Undo' : 'Delete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
