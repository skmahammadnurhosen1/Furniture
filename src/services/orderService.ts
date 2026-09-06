import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem, Order, ShippingAddress } from '../types';

export async function createOrder(
  userId: string,
  userEmail: string,
  items: CartItem[],
  totalAmount: number,
  shippingAddress: ShippingAddress
): Promise<string> {
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const orderDocRef = doc(db, 'orders', orderId);

  const orderData: Order = {
    id: orderId,
    userId,
    userEmail,
    items,
    totalAmount,
    shippingAddress,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(orderDocRef, orderData);
    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    throw error;
  }
}

export function subscribeToUserOrders(
  userId: string,
  onUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
) {
  const ordersCol = collection(db, 'orders');
  const userOrdersQuery = query(ordersCol, where('userId', '==', userId));

  const unsubscribe = onSnapshot(
    userOrdersQuery,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as Order);
      });
      // Sort newest first
      orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onUpdate(orders);
    },
    (error) => {
      console.error('Orders subscription error:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'orders');
    }
  );

  return unsubscribe;
}
