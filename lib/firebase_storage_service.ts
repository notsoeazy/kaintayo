import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase_service';

// Uploads a local image URI to Firebase Cloud Storage.
export async function uploadImageToFirebase(uri: string, uid: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `places/${uid}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
}

// Uploads a gallery photo for a sub-collection.
export async function uploadPlacePhoto(uri: string, placeId: string, uid: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = `places/${placeId}/photos/${uid}_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, blob);

  return getDownloadURL(storageRef);
}

