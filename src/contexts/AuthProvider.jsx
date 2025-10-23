import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();
const API_URL = "https://abhoy-server.vercel.app/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save token to localStorage
  const saveToken = (token) => {
    localStorage.setItem("safedesk_token", token);
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("safedesk_token");
  };

  // Remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem("safedesk_token");
  };

  // Create user with email and password
  const createUser = async (email, password, displayName) => {
    setLoading(true);
    try {
      // Create user in Firebase (this is the source of truth for authentication)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Register in backend database
      const response = await fetch(`${API_URL}/auth/firebase-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: userCredential.user.photoURL || "",
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        saveToken(data.data.token);
        setUser({ ...userCredential.user, role: data.data.user.role });
      }

      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign in with email and password
  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      // Sign in with Firebase (this handles authentication)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user role from backend using Firebase UID
      const response = await fetch(`${API_URL}/auth/verify-firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          uid: userCredential.user.uid,
          email: userCredential.user.email 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        saveToken(data.data.token);
        setUser({ ...userCredential.user, role: data.data.user.role });
      } else {
        // User authenticated in Firebase but not in our system, create them
        const createResponse = await fetch(`${API_URL}/auth/firebase-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName || email.split('@')[0],
            photoURL: userCredential.user.photoURL || "",
          }),
        });

        const createData = await createResponse.json();
        if (createData.success) {
          saveToken(createData.data.token);
          setUser({ ...userCredential.user, role: createData.data.user.role });
        }
      }

      return userCredential;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Send to backend
      const response = await fetch(`${API_URL}/auth/google-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        saveToken(data.data.token);
        setUser({ ...result.user, role: data.data.user.role });
      }

      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Sign out
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      removeToken();
      setUser(null);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Update user profile
  const updateUser = async (updatedData) => {
    await updateProfile(auth.currentUser, updatedData);
    
    // Update in backend
    const token = getToken();
    if (token) {
      await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    }
  };

  // Verify token and get user data from backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if we have a token
        const token = getToken();
        if (token) {
          // Verify token and get role from backend
          const userData = await verifyToken(token);
          if (userData) {
            setUser({ ...currentUser, role: userData.role });
          } else {
            // Token invalid, clear it
            removeToken();
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
        removeToken();
      }
      setLoading(false);
    });
    
    return () => {
      unSubscribe();
    };
  }, []);

  const userInfo = {
    user,
    loading,
    createUser,
    signInUser,
    googleSignIn,
    signOutUser,
    updateUser,
    getToken,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
