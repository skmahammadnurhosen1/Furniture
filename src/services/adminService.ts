import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AdminRequest } from '../types';

export const MASTER_ADMIN_EMAIL = 'skmahammadnurhosen1@gmail.com';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface AdminStatusResult {
  isApproved: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'none';
  request?: AdminRequest;
}

/**
 * Helper to check if input password matches stored data
 * Supports plain text fields (password, pass) and hash fields (passwordHash)
 */
function checkPasswordMatch(inputPassword: string, inputHash: string, data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  const clean = inputPassword.trim();

  // 1. Check all plain text field variations in Firebase document
  const plainFields = [data.password, data.Password, data.pass, data.Pass, data.pin];
  for (const field of plainFields) {
    if (typeof field === 'string' && field.trim()) {
      const val = field.trim();
      if (val === clean || val === inputHash) return true;
    }
  }

  // 2. Check hash field variations
  const hashFields = [data.passwordHash, data.PasswordHash];
  for (const field of hashFields) {
    if (typeof field === 'string' && field.trim()) {
      const val = field.trim();
      if (val === inputHash || val === clean) return true;
    }
  }

  return false;
}

/**
 * Update or set the master admin password in Firestore
 */
export async function updateMasterAdminPassword(newPassword: string): Promise<void> {
  const clean = newPassword.trim();
  if (clean.length < 4) {
    throw new Error('Password must be at least 4 characters long.');
  }

  const newHash = await hashPassword(clean);
  const masterDocRef = doc(db, 'admin_accounts', 'master_admin');

  await setDoc(
    masterDocRef,
    {
      email: MASTER_ADMIN_EMAIL,
      password: clean, // Stored directly so it matches database entries
      passwordHash: newHash, // Stored in SHA-256
      role: 'master_admin',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function verifyAdminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanPassword) {
    return { success: false, message: 'Please enter your password.' };
  }

  const inputHash = await hashPassword(cleanPassword);

  // 1. Root Master Admin Check
  if (normalizedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
    try {
      let masterData: any = null;
      let masterDocRef = doc(db, 'admin_accounts', 'master_admin');

      // Check master_admin document
      const masterSnap = await getDoc(masterDocRef);
      if (masterSnap.exists()) {
        masterData = masterSnap.data();
      }

      // If not found in master_admin doc, check admin_accounts collection by email query
      if (!masterData) {
        const qAcc = query(collection(db, 'admin_accounts'), where('email', '==', normalizedEmail));
        const snapAcc = await getDocs(qAcc);
        if (!snapAcc.empty) {
          masterData = snapAcc.docs[0].data();
          masterDocRef = snapAcc.docs[0].ref;
        }
      }

      // Also check admin_requests for any entry
      if (!masterData) {
        const qReq = query(collection(db, 'admin_requests'), where('email', '==', normalizedEmail));
        const snapReq = await getDocs(qReq);
        if (!snapReq.empty) {
          masterData = snapReq.docs[0].data();
        }
      }

      if (masterData) {
        const hasConfiguredPassword =
          masterData.password ||
          masterData.Password ||
          masterData.pass ||
          masterData.Pass ||
          masterData.passwordHash ||
          masterData.PasswordHash;

        if (hasConfiguredPassword) {
          if (checkPasswordMatch(cleanPassword, inputHash, masterData)) {
            return { success: true };
          } else {
            return {
              success: false,
              message: 'Invalid password. Please enter the correct password.',
            };
          }
        } else {
          // Document exists but no password field found in database
          return {
            success: false,
            message: 'No password found in database. Please set a password field in Firestore.',
          };
        }
      } else {
        // Document does not exist in database
        return {
          success: false,
          message: 'Master admin account document not found in database.',
        };
      }
    } catch (e: any) {
      console.error('Master admin verification error:', e);
      return {
        success: false,
        message: 'Invalid credentials or connection error. Please try again.',
      };
    }
  }

  // 2. Other Administrator Accounts Check
  try {
    const adminCol = collection(db, 'admin_requests');
    const q = query(adminCol, where('email', '==', normalizedEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        success: false,
        message:
          'This email is not registered as an administrator. Please apply under the "Request Access" tab.',
      };
    }

    // Get latest request
    let latestReq: AdminRequest | null = null;
    snapshot.forEach((docSnap) => {
      const reqData = { ...docSnap.data(), id: docSnap.id } as AdminRequest;
      if (!latestReq || (reqData.createdAt && reqData.createdAt > (latestReq.createdAt || ''))) {
        latestReq = reqData;
      }
    });

    if (!latestReq) {
      return { success: false, message: 'Admin account record not found.' };
    }

    if (latestReq.status === 'pending') {
      return {
        success: false,
        message:
          'Your administrator application is currently pending review. You can log in once approved.',
      };
    }

    if (latestReq.status === 'rejected') {
      return {
        success: false,
        message:
          latestReq.rejectionReason ||
          'Your administrator application was not approved. You may submit a new request.',
      };
    }

    if (latestReq.status === 'approved') {
      if (checkPasswordMatch(cleanPassword, inputHash, latestReq)) {
        return { success: true };
      }
      return {
        success: false,
        message: 'Invalid password. Please enter your correct administrator password.',
      };
    }

    return { success: false, message: 'Unauthorized administrator status.' };
  } catch (err: any) {
    console.error('Error verifying admin login:', err);
    return { success: false, message: err?.message || 'Login verification failed.' };
  }
}

export async function checkAdminStatus(email: string, userId?: string): Promise<AdminStatusResult> {
  const normalizedEmail = email.trim().toLowerCase();

  // Root Master Admin is always pre-approved
  if (normalizedEmail === MASTER_ADMIN_EMAIL.toLowerCase()) {
    return { isApproved: true, status: 'approved' };
  }

  try {
    const adminCol = collection(db, 'admin_requests');
    const q = query(adminCol, where('email', '==', normalizedEmail));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Find the most recent request
      let latestReq: AdminRequest | null = null;
      snapshot.forEach((docSnap) => {
        const reqData = { ...docSnap.data(), id: docSnap.id } as AdminRequest;
        if (!latestReq || (reqData.createdAt && reqData.createdAt > (latestReq.createdAt || ''))) {
          latestReq = reqData;
        }
      });

      if (latestReq) {
        return {
          isApproved: (latestReq as AdminRequest).status === 'approved',
          status: (latestReq as AdminRequest).status,
          request: latestReq,
        };
      }
    }

    // Also check by userId if provided
    if (userId) {
      const userDocRef = doc(db, 'admin_requests', userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const reqData = { ...userSnap.data(), id: userSnap.id } as AdminRequest;
        return {
          isApproved: reqData.status === 'approved',
          status: reqData.status,
          request: reqData,
        };
      }
    }

    return { isApproved: false, status: 'none' };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isApproved: false, status: 'none' };
  }
}

export async function submitAdminRequest(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  reason?: string;
}): Promise<string> {
  try {
    const normalizedEmail = data.email.trim().toLowerCase();
    const reqRef = doc(collection(db, 'admin_requests'));
    const passwordHash = await hashPassword(data.password.trim());

    const newRequest: Partial<AdminRequest> = {
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      password: data.password.trim(), // Stored for admin review / direct verification
      passwordHash: passwordHash,
      phone: data.phone?.trim() || '',
      reason: data.reason?.trim() || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(reqRef, newRequest);
    return reqRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'admin_requests');
    throw error;
  }
}

export function subscribeToAdminRequests(
  callback: (requests: AdminRequest[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const reqCol = collection(db, 'admin_requests');
    const unsubscribe = onSnapshot(
      reqCol,
      (snapshot) => {
        const requests: AdminRequest[] = [];
        snapshot.forEach((docSnap) => {
          requests.push({ ...docSnap.data(), id: docSnap.id } as AdminRequest);
        });
        requests.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        callback(requests);
      },
      (error) => {
        console.warn('Admin requests subscription notice:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('Failed to subscribe to admin requests:', error);
    return () => {};
  }
}

export async function approveAdminRequest(
  requestId: string,
  reviewerEmail: string
): Promise<void> {
  try {
    const reqRef = doc(db, 'admin_requests', requestId);
    const snap = await getDoc(reqRef);
    if (!snap.exists()) {
      throw new Error('Admin request not found.');
    }
    const data = snap.data();

    await updateDoc(reqRef, {
      status: 'approved',
      approvedBy: reviewerEmail,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (data.email) {
      const adminAccRef = doc(db, 'admin_accounts', data.email.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      await setDoc(
        adminAccRef,
        {
          email: data.email.toLowerCase(),
          fullName: data.fullName || '',
          password: data.password || '',
          passwordHash: data.passwordHash || '',
          role: 'admin',
          approvedBy: reviewerEmail,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `admin_requests/${requestId}`);
    throw error;
  }
}

export async function rejectAdminRequest(
  requestId: string,
  reviewerEmail: string,
  reason?: string
): Promise<void> {
  try {
    const reqRef = doc(db, 'admin_requests', requestId);
    await updateDoc(reqRef, {
      status: 'rejected',
      rejectedBy: reviewerEmail,
      rejectionReason: reason || 'Your application has been declined by the administrator.',
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `admin_requests/${requestId}`);
    throw error;
  }
}
