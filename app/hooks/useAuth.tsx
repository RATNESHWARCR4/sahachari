'use client';

import { useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { User, Language } from '@/app/types';
import { useStore } from '@/app/store';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            phone: firebaseUser.phoneNumber || undefined,
            language: 'en',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    additionalData?: Partial<User>
  ) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(firebaseUser, { displayName: name });

      const newUser: User = {
        id: firebaseUser.uid,
        email,
        name,
        language: additionalData?.language || 'en',
        school: additionalData?.school,
        district: additionalData?.district,
        state: additionalData?.state,
        grades: additionalData?.grades,
        subjects: additionalData?.subjects,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        // Create new user
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      }
      
      toast.success('Welcome!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const setupPhoneAuth = (elementId: string) => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
    });
  };

  const signInWithPhone = async (phoneNumber: string) => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        // Create new user
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Teacher',
          phone: firebaseUser.phoneNumber || undefined,
          language: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      }
      
      toast.success('Phone verification successful!');
      return { success: true };
    } catch (error: any) {
      toast.error('Invalid OTP');
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      await updateDoc(doc(db, 'users', user.id), {
        ...updates,
        updatedAt: new Date(),
      });
      
      setUser({ ...user, ...updates, updatedAt: new Date() });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error: any) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    setupPhoneAuth,
    verifyOTP,
    signOut,
    resetPassword,
    updateUserProfile,
  };
} 