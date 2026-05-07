import { db } from '@/lib/firebase_service';
import { MOCK_PLACES } from '@/constants/mock_places';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

// One-time utility to seed Firestore with mock places.
// NOTE: Wala pa seeded data. Testing palang if working, then if oks na then seed na natin
export async function seedDatabase(): Promise<void> {
  const writes = MOCK_PLACES.map((place) => {
    const { id, createdAt, ...rest } = place;
    return setDoc(doc(db, 'places', id), {
      ...rest,
      createdAt: Timestamp.now(),
    });
  });

  await Promise.all(writes);
  console.log(`Seeded ${MOCK_PLACES.length} places to Firestore.`);
}
