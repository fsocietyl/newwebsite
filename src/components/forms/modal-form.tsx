'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormValues } from '@/lib/validation';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/components/providers/locale-provider';
import { submitForm } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';

type Props = {
  label: string;
  intent: string;
  collection: 'appointments' | 'messages';
};

export function ModalForm({ label, intent, collection }: Props) {
  const t = useTranslations();
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      intent,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await submitForm(collection, values);
      toast({ title: label, description: t('forms.success') });
      form.reset();
    } catch {
      toast({ title: label, description: t('forms.error') });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-sm">{label}</DialogTitle>
        <DialogDescription className="mb-6 text-sm text-stone-400">
          {t('forms.intent')}
        </DialogDescription>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label>{t('forms.name')}</Label>
            <Input {...form.register('name')} />
          </div>
          <div>
            <Label>{t('forms.email')}</Label>
            <Input {...form.register('email')} type="email" />
          </div>
          <div>
            <Label>{t('forms.phone')}</Label>
            <Input {...form.register('phone')} />
          </div>
          <div>
            <Label>{t('forms.message')}</Label>
            <Textarea rows={4} {...form.register('message')} />
          </div>
          <Button type="submit" className="w-full">
            {t('forms.submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
