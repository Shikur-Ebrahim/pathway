"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, isFirebaseConfigured, db } from "@/lib/firebase";

const ADMIN_EMAIL = "shikurebrahim3828@gmail.com";

export interface DemoUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | DemoUser | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ isAdmin: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
  isAdmin: false,
  loginWithEmail: async () => {},
  signUpWithEmail: async () => {},
  loginWithGoogle: async () => ({ isAdmin: false }),
  logout: async () => {},
});

async function upsertUserInFirestore(user: User) {
  if (!isFirebaseConfigured || !db?.app) return;
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: isAdmin ? "admin" : "user",
        createdAt: serverTimestamp(),
      });
    } else if (isAdmin && snap.data()?.role !== "admin") {
      // Ensure admin role is always set
      await setDoc(ref, { role: "admin" }, { merge: true });
    }
  } catch (e) {
    console.warn("Could not upsert user:", e);
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (isFirebaseConfigured && auth?.app) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          await upsertUserInFirestore(currentUser);
        }
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Demo state fallback from localStorage
      const savedUser = localStorage.getItem("pathway_demo_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth?.app) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      const mockUser: DemoUser = {
        uid: "demo_uid_" + Date.now(),
        email: email,
        displayName: email.split("@")[0] || "Explorer",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
      setUser(mockUser);
      localStorage.setItem("pathway_demo_user", JSON.stringify(mockUser));
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    if (isFirebaseConfigured && auth?.app) {
      await createUserWithEmailAndPassword(auth, email, pass);
    } else {
      const mockUser: DemoUser = {
        uid: "demo_uid_" + Date.now(),
        email: email,
        displayName: name || email.split("@")[0] || "New Explorer",
        photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      };
      setUser(mockUser);
      localStorage.setItem("pathway_demo_user", JSON.stringify(mockUser));
    }
  };

  const loginWithGoogle = async (): Promise<{ isAdmin: boolean }> => {
    if (isFirebaseConfigured && auth?.app) {
      const result = await signInWithPopup(auth, googleProvider);
      const signedInEmail = result.user.email;
      // Set user immediately so isAdmin context is updated before any redirect
      setUser(result.user);
      await upsertUserInFirestore(result.user);
      return { isAdmin: signedInEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase() };
    } else {
      const mockUser: DemoUser = {
        uid: "google_demo_" + Date.now(),
        email: "google.user@pathway.dev",
        displayName: "Pathway Explorer (Google)",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      };
      setUser(mockUser);
      localStorage.setItem("pathway_demo_user", JSON.stringify(mockUser));
      return { isAdmin: false };
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth?.app) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem("pathway_demo_user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: isFirebaseConfigured,
        isAdmin,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
