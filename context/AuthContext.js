import React, { useContext, useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/Login");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/visits");
    }
  }, [user, segments]);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userIsSecurity, setUserIsSecurity] = useState(null);
  const [userResidentUnit, setUserResidentUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserIsSecurity(userData.isSecurity);
          setUserResidentUnit(userData.residentUnit);
        }
        setLoading(false);
      } else {
        setUserIsSecurity(false);
        setUserResidentUnit(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  function logout() {
    signOut(auth);
    return router.replace("/Login");
  }

  const value = {
    currentUser,
    userIsSecurity,
    userResidentUnit,
    login,
    logout,
  };

  useProtectedRoute(currentUser);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
