import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { StoreSettings } from '../types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'store_profile',
  storeName: 'Furni Studio',
  street: '88 Woodcraft Boulevard, Craftsmanship Quarter',
  city: 'Kolkata, West Bengal',
  postalCode: '700001',
  primaryEmail: 'skmahammadnurhosen1@gmail.com',
  secondaryEmail: 'support@furnistudio.com',
  primaryPhone: '+91 91342 80545',
  hotline: '+91 91342 80545',
  whatsappNumber: '919134280545',
  workingHours: 'Monday - Saturday: 9:00 AM - 8:00 PM',
  updatedAt: new Date().toISOString(),
};

const SETTINGS_DOC_ID = 'store_profile';

export function subscribeToStoreSettings(
  onUpdate: (settings: StoreSettings) => void,
  onError?: (err: any) => void
) {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);

  const unsubscribe = onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, DEFAULT_STORE_SETTINGS);
          onUpdate(DEFAULT_STORE_SETTINGS);
        } catch (err) {
          console.warn('Initial store settings creation fallback:', err);
          onUpdate(DEFAULT_STORE_SETTINGS);
        }
      } else {
        const data = snapshot.data() as StoreSettings;
        onUpdate({ ...DEFAULT_STORE_SETTINGS, ...data });
      }
    },
    (error) => {
      console.error('Store settings listener error:', error);
      if (onError) onError(error);
      onUpdate(DEFAULT_STORE_SETTINGS);
    }
  );

  return unsubscribe;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<void> {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  const updatedPayload: StoreSettings = {
    ...DEFAULT_STORE_SETTINGS,
    ...settings,
    id: SETTINGS_DOC_ID,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, updatedPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `settings/${SETTINGS_DOC_ID}`);
  }
}
