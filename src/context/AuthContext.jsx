import React, { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile // Import updateProfile
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get the ID token and attach specific fields we need
        const token = await currentUser.getIdToken();
        const userWithToken = {
          ...currentUser,
          token,
          // Ensure displayName is updated immediately if it was just set
          name: currentUser.displayName || "User"
        }
        setUser(userWithToken);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with name immediately after signup
    if (name) {
      await updateProfile(userCredential.user, { displayName: name });
      // Force update local user state to reflect name change
      setUser(prev => ({ ...prev, displayName: name, name: name }));
    }
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);