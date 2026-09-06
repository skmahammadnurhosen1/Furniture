import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfilePhotoFromBase64: (base64String: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch or initialize user profile document in Firestore
  const fetchUserProfile = async (currentUser: User) => {
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap && docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        return;
      }
    } catch (err) {
      console.warn('Could not read user profile from Firestore, creating baseline:', err);
    }

    // Create initial minimal profile without asking for address or extra info upfront
    const initialProfile: UserProfile = {
      userId: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || '',
      photoBase64: currentUser.photoURL || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(userDocRef, initialProfile);
      setProfile(initialProfile);
    } catch (createErr) {
      console.warn('Could not write user profile to Firestore:', createErr);
      setProfile(initialProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchUserProfile(currentUser);
        } catch (e) {
          console.error('Error initializing user profile:', e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchUserProfile(result.user);
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await fetchUserProfile(result.user);
      }
    } catch (error: any) {
      console.error('Email Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user && name) {
        await updateAuthProfile(result.user, { displayName: name });
      }
      if (result.user) {
        const userDocRef = doc(db, 'users', result.user.uid);
        const newProfile: UserProfile = {
          userId: result.user.uid,
          email: result.user.email || email,
          displayName: name || '',
          photoBase64: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, newProfile);
        } catch (e) {
          console.warn('Error setting user profile on signup:', e);
        }
        setProfile(newProfile);
      }
    } catch (error: any) {
      console.error('Email Sign Up Error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (emailAddress: string) => {
    try {
      await sendPasswordResetEmail(auth, emailAddress);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    const userDocRef = doc(db, 'users', user.uid);
    const updatedPayload = {
      ...data,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(userDocRef, updatedPayload);
      setProfile((prev) => (prev ? { ...prev, ...updatedPayload } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const uploadProfilePhotoFromBase64 = async (base64String: string) => {
    await updateProfileData({ photoBase64: base64String });
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        updateProfileData,
        uploadProfilePhotoFromBase64,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
