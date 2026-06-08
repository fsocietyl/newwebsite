'use client';

import { useContent } from '@/components/providers/content-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storeSchema, type StoreFormValues } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@/components/ui/table';
import { saveStore, deleteStore } from '@/lib/firestore';
import { useToast } from '@/components/ui/use-toast';

export default function AdminStoresPage() {
  const { stores, refresh } = useContent();
  const { toast } = useToast();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      country: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      hours: '',
      mapUrl: '',
    },
  });

  const onSubmit = async (values: StoreFormValues) => {
    await saveStore({
      ...values,
      createdAt: new Date().toISOString(),
    });
    toast({ title: 'Store saved', description: values.name });
    await refresh();
    form.reset();
  };

  const handleDelete = async (id: string) => {
    await deleteStore(id);
    toast({ title: 'Store removed' });
    refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">Stores</p>
        <h1 className="mt-2 font-serif text-4xl text-white">Global network</h1>
      </div>
      <form className="grid gap-4 border border-[var(--gold-border)] bg-[rgba(8,8,8,0.9)] p-6 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...form.register('name')} />
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
          <Label>Address</Label>
          <Input {...form.register('address')} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...form.register('phone')} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...form.register('email')} />
        </div>
        <div>
          <Label>Hours</Label>
          <Input {...form.register('hours')} />
        </div>
        <div>
          <Label>Map URL</Label>
          <Input {...form.register('mapUrl')} />
        </div>
        <Button type="submit" className="md:col-span-2">
          Save Store
        </Button>
      </form>
      <div className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.92)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Country</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={`${store.city}-${store.name}`}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.city}</TableCell>
                <TableCell>{store.country}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDelete(store.id ?? store.name)}>
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
