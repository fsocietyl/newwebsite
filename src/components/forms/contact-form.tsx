'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/components/providers/locale-provider';
import { useToast } from '@/components/ui/use-toast';
import { submitForm } from '@/lib/firestore';

export function ContactForm({ intent }: { intent: string }) {
  const t = useTranslations();
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '', intent },
  });

  const onSubmit = async (values: ContactFormValues) => {
    await submitForm(intent === 'Appointment' ? 'appointments' : 'messages', values);
    toast({ title: t('sections.contact'), description: t('forms.success') });
    form.reset();
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <Label>{t('forms.name')}</Label>
        <Input {...form.register('name')} />
      </div>
      <div>
        <Label>{t('forms.email')}</Label>
        <Input type="email" {...form.register('email')} />
      </div>
      <div>
        <Label>{t('forms.phone')}</Label>
        <Input {...form.register('phone')} />
      </div>
      <div>
        <Label>{t('forms.intent')}</Label>
        <select
          {...form.register('intent')}
          className="mt-2 w-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white focus:border-[#c19b4a] focus:outline-none"
        >
          <option value="General Inquiry">{t('forms.intentGeneral')}</option>
          <option value="Appointment Request">{t('forms.intentAppointment')}</option>
          <option value="Partnership">{t('forms.intentPartnership')}</option>
        </select>
      </div>
      <div>
        <Label>{t('forms.message')}</Label>
        <Textarea rows={6} {...form.register('message')} />
      </div>
      <Button type="submit">{t('forms.submit')}</Button>
    </form>
  );
}
