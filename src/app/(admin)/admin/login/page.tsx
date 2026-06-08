'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { loginWithEmail } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/components/providers/locale-provider';
import { useToast } from '@/components/ui/use-toast';

type LoginValues = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const { register, handleSubmit } = useForm<LoginValues>();
  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Login failed',
        description: 'Firebase did not respond. Check Firebase Authentication settings and authorized domains.',
      });
    }, 8000);

    try {
      if (isFirebaseConfigured()) {
        await loginWithEmail(values.email, values.password);
      } else {
        window.localStorage.setItem('demo-admin', 'true');
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      toast({ title: 'Welcome back', description: 'You are now signed in.' });
      router.replace('/admin');
    } catch (error) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      const description =
        error instanceof Error && error.message === 'Firebase login timed out'
          ? 'Firebase did not respond. Check Firebase Authentication settings and authorized domains.'
          : 'Please check your credentials.';
      toast({ title: 'Login failed', description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md border border-[var(--gold-border)] bg-[rgba(8,8,8,0.92)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--gold)]">
          {t('admin.loginTitle')}
        </p>
        <h1 className="mt-4 font-serif text-4xl text-white">Admin Access</h1>
        <div className="mt-6 space-y-4">
          <div>
            <Label>{t('admin.email')}</Label>
            <Input type="email" {...register('email', { required: true })} />
          </div>
          <div>
            <Label>{t('admin.password')}</Label>
            <Input type="password" {...register('password', { required: true })} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('status.loading') : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}
