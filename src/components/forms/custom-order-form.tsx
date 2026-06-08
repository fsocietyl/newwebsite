'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customOrderSchema, type CustomOrderFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';
import { useToast } from '@/components/ui/use-toast';
import { submitForm } from '@/lib/firestore';
import { useRef, useState } from 'react';

export function CustomOrderForm() {
  const t = useTranslations();
  const { locale } = useLocale();
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<File | null>(null);
  const { toast } = useToast();
  const form = useForm<CustomOrderFormValues>({
    resolver: zodResolver(customOrderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      desiredProduct: '',
      usageContext: '',
      dimensions: '',
      materialNotes: '',
      finishNotes: '',
      quantity: '',
      budget: '',
      references: '',
      photoUrl: '',
      photoFileName: '',
      message: '',
    },
  });

  const placeholders =
    locale === 'ar'
      ? {
          desiredProduct: 'صف القطعة المطلوبة',
          usageContext: 'المساحة / الاستخدام',
          budget: 'مثال: ١٠٬٠٠٠ - ١٥٬٠٠٠ €',
          dimensions: 'الطول، العرض، الارتفاع، تفاصيل الوحدات…',
          materialNotes: 'خشب، قماش، معدن، طلاء…',
          finishNotes: 'تشطيبات ولمسات نهائية (اختياري)',
          references: 'روابط مرجعية أو كاتالوج',
          photoUrl: 'رابط صورة للمنتج المطلوب (اختياري)',
          photoUpload: 'ارفع صورة للمنتج المطلوب (اختياري)',
          message: 'أضف ملاحظات إضافية',
          quantity: '١',
        }
      : locale === 'tr'
        ? {
            desiredProduct: 'Talep edilen ürün/ürün grubu',
            usageContext: 'Mekân / kullanım amacı',
            budget: 'Örn: €10k - €15k',
            dimensions: 'Uzunluk, genişlik, yükseklik, modül detayları…',
            materialNotes: 'Ahşap, kumaş, metal, boya…',
            finishNotes: 'Kaplama / döşeme notu (opsiyonel)',
            references: 'Referans bağlantıları',
            photoUrl: 'İstenilen ürünün fotoğraf linki (opsiyonel)',
            photoUpload: 'İstenilen ürünün fotoğrafını yükle (opsiyonel)',
            message: 'Ek notlar',
            quantity: '1',
          }
        : {
            desiredProduct: 'Requested piece or set',
            usageContext: 'Space / usage',
            budget: 'e.g., €10k - €15k',
            dimensions: 'Length, width, height, module details…',
            materialNotes: 'Wood, fabric, metal, paint…',
            finishNotes: 'Finish / upholstery notes (optional)',
            references: 'Reference links',
            photoUrl: 'Photo URL for desired item (optional)',
            photoUpload: 'Upload a photo of the desired item (optional)',
            message: 'Any additional notes',
            quantity: '1',
          };

  const onSubmit = async (values: CustomOrderFormValues) => {
    try {
      const payload = `
New custom order request

Name: ${values.name}
Email: ${values.email}
Phone: ${values.phone ?? '-'}
Product: ${values.desiredProduct}
Usage: ${values.usageContext}
Dimensions: ${values.dimensions}
Materials: ${values.materialNotes}
Finish: ${values.finishNotes ?? '-'}
Quantity: ${values.quantity ?? '-'}
Budget: ${values.budget ?? '-'}
References: ${values.references ?? '-'}
Photo URL: ${values.photoUrl ?? '-'}
Photo file: ${values.photoFileName ?? '-'}

Message:
${values.message}
`;

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('message', payload);
      if (fileRef.current) {
        formData.append('attachment', fileRef.current, fileRef.current.name);
      }

      const response = await fetch('https://formsubmit.co/ajax/info@sign-d.net', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Email failed');
      }
      await submitForm('orders', values);
      toast({ title: t('sections.customOrderTitle'), description: t('forms.success') });
      form.reset();
      setFileName('');
      fileRef.current = null;
    } catch (error) {
      console.error(error);
      toast({ title: t('sections.customOrderTitle'), description: t('forms.error') });
    }
  };

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.name')}</Label>
          <Input {...form.register('name')} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.email')}</Label>
          <Input type="email" {...form.register('email')} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.phone')}</Label>
          <Input {...form.register('phone')} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.quantity')}</Label>
          <Input {...form.register('quantity')} placeholder={placeholders.quantity} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.desiredProduct')}</Label>
        <Input {...form.register('desiredProduct')} placeholder={placeholders.desiredProduct} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.usageContext')}</Label>
          <Input {...form.register('usageContext')} placeholder={placeholders.usageContext} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
        <div>
          <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.budget')}</Label>
          <Input {...form.register('budget')} placeholder={placeholders.budget} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.dimensionsDetail')}</Label>
        <Textarea rows={3} {...form.register('dimensions')} placeholder={placeholders.dimensions} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.materialNotes')}</Label>
        <Textarea rows={3} {...form.register('materialNotes')} placeholder={placeholders.materialNotes} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.finishNotes')}</Label>
        <Textarea rows={3} {...form.register('finishNotes')} placeholder={placeholders.finishNotes} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.references')}</Label>
        <Input {...form.register('references')} placeholder={placeholders.references} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.photoUrl')}</Label>
        <Input {...form.register('photoUrl')} placeholder={placeholders.photoUrl} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.photoUpload')}</Label>
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full border-0 border-b border-white/10 bg-transparent px-0 py-3 text-sm text-white file:mr-3 file:cursor-pointer file:border-0 file:bg-[var(--gold)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-white focus:outline-none"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            fileRef.current = file;
            const name = file ? file.name : '';
            setFileName(name);
            form.setValue('photoFileName', name);
          }}
        />
        {fileName && <p className="mt-1 text-xs text-stone-400">{fileName}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-[10px] tracking-[0.28em] text-[var(--gold)]">{t('forms.message')}</Label>
        <Textarea rows={5} {...form.register('message')} placeholder={placeholders.message} className="mt-1 border-0 border-b border-white/10 bg-transparent px-0 py-3 text-white placeholder:text-stone-500 focus:border-[var(--gold)]" />
      </div>

      <Button type="submit" className="w-full bg-[var(--gold)] px-12 py-4 text-sm uppercase tracking-[0.28em] text-black hover:bg-white md:w-auto" disabled={form.formState.isSubmitting}>
        {t('forms.submit')}
      </Button>
    </form>
  );
}
