import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage } from './firebase';

export async function uploadImage(file: File | Blob, path: string) {
  const storage = getFirebaseStorage();
  if (!storage) {
    return '/images/placeholder.svg';
  }

  const fileRef = ref(storage, `${path}/${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const result = await uploadBytes(fileRef, file);
  return getDownloadURL(result.ref);
}
