'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/storage';
import { Label } from '@/components/ui/label';

type Props = {
  label: string;
  folder: string;
  onUploaded: (url: string) => void;
};

export function ImageUploadField({ label, folder, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onUploaded(url);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-3">
        <input type="file" accept="image/*" onChange={handleChange} className="text-xs text-[var(--text-secondary)] file:mr-3 file:border file:border-[var(--gold-border)] file:bg-[rgba(201,168,76,0.08)] file:px-3 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-[var(--gold)]" />
        {uploading && <span className="text-xs text-[var(--text-secondary)]">Uploading…</span>}
      </div>
    </div>
  );
}
