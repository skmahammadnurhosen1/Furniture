import { collection, doc, deleteDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/furnitureData';
import { Product } from '../types';

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const productsCol = collection(db, 'products');

  const unsubscribe = onSnapshot(
    productsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        // If Firestore products collection is empty, seed with initial catalog
        try {
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', item.id), item);
          }
          onUpdate(INITIAL_PRODUCTS);
        } catch (seedErr) {
          console.warn('Initial seeding fallback to local catalog:', seedErr);
          onUpdate(INITIAL_PRODUCTS);
        }
      } else {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as Product);
        });
        onUpdate(loaded);
      }
    },
    (error) => {
      console.error('Products subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'products');
    }
  );

  return unsubscribe;
}

export async function addProduct(product: Product): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  try {
    await setDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `products/${product.id}`);
  }
}

export async function updateProduct(product: Product): Promise<void> {
  const docRef = doc(db, 'products', product.id);
  try {
    await setDoc(docRef, product, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const docRef = doc(db, 'products', productId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
  }
}
