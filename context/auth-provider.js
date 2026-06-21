"use client";

import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@finex.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "User",
          photoURL: currentUser.photoURL,
        });
        setIsAuth(true);
        setIsAdmin(currentUser.email === adminEmail);
      } else {
        setUser(null);
        setIsAuth(false);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ setIsAuth, isAuth, user, setUser, isLoading, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
