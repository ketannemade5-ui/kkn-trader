import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  onIdTokenChanged,
} from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kkn_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('kkn_token') || null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { success, error } = useToast();

  // Helper to sync Firebase authenticated user with backend MongoDB & portfolio
  const syncFirebaseUser = async (fbUser, extraData = {}) => {
    // Preserve existing saved user name if available and not empty
    let existingName = '';
    try {
      const saved = JSON.parse(localStorage.getItem('kkn_user') || 'null');
      if (saved && saved.name && saved.email === fbUser.email) {
        existingName = saved.name;
      }
    } catch (e) {}

    const resolvedName =
      extraData.name ||
      fbUser.displayName ||
      existingName ||
      (fbUser.email ? fbUser.email.split('@')[0] : 'Trader');

    let freshToken = null;
    try {
      freshToken = await fbUser.getIdToken();
    } catch (tokenErr) {
      freshToken = localStorage.getItem('kkn_token') || `fb_token_${fbUser.uid}`;
    }

    try {
      const res = await authAPI.firebaseSync({
        uid: fbUser.uid,
        email: fbUser.email,
        name: resolvedName,
        photoURL: fbUser.photoURL || extraData.photoURL || '',
        experienceLevel: extraData.experienceLevel || (user?.experienceLevel) || 'BEGINNER',
        tradingGoals: extraData.tradingGoals || (user?.tradingGoals) || ['Learn Price Action', 'Practice $100,000 Paper Account'],
      });

      if (res && res.success && res.user) {
        const activeToken = res.token || freshToken;
        const activeUser = {
          ...res.user,
          name: res.user.name || resolvedName,
        };
        setToken(activeToken);
        setUser(activeUser);
        localStorage.setItem('kkn_token', activeToken);
        localStorage.setItem('kkn_user', JSON.stringify(activeUser));
        return { success: true, user: activeUser };
      }
    } catch (apiErr) {
      console.warn('[Backend Sync Note]:', apiErr.message);
    }

    // Resilient fallback if backend API is offline/unreachable
    const fallbackUser = {
      id: fbUser.uid,
      _id: fbUser.uid,
      name: resolvedName,
      email: fbUser.email,
      role: (user?.role) || 'USER',
      avatar: fbUser.photoURL || extraData.photoURL || '',
      experienceLevel: extraData.experienceLevel || (user?.experienceLevel) || 'BEGINNER',
      tradingGoals: extraData.tradingGoals || (user?.tradingGoals) || ['Learn Market Structure'],
    };

    const activeToken = freshToken || `fb_token_${fbUser.uid}`;
    setToken(activeToken);
    setUser(fallbackUser);
    localStorage.setItem('kkn_token', activeToken);
    localStorage.setItem('kkn_user', JSON.stringify(fallbackUser));
    return { success: true, user: fallbackUser };
  };

  // Restore and maintain Firebase Auth state across page reloads
  useEffect(() => {
    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentFbUser) => {
      if (!isMounted) return;

      if (currentFbUser) {
        setFirebaseUser(currentFbUser);
        try {
          const freshIdToken = await currentFbUser.getIdToken();
          if (isMounted) {
            setToken(freshIdToken);
            localStorage.setItem('kkn_token', freshIdToken);
          }
        } catch (e) {
          console.warn('[Token Fetch Error]:', e.message);
        }

        await syncFirebaseUser(currentFbUser);
      } else {
        setFirebaseUser(null);
        // If not authenticated via Firebase, verify if a custom demo/backend session exists
        const storedToken = localStorage.getItem('kkn_token');
        const storedUser = localStorage.getItem('kkn_user');

        if (storedToken && !storedToken.startsWith('fb_token_') && storedUser) {
          try {
            const res = await authAPI.getMe();
            if (res.success && res.user && isMounted) {
              setUser(res.user);
              localStorage.setItem('kkn_user', JSON.stringify(res.user));
            }
          } catch (err) {
            if (isMounted) {
              setToken(null);
              setUser(null);
              localStorage.removeItem('kkn_token');
              localStorage.removeItem('kkn_user');
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('kkn_token');
            localStorage.removeItem('kkn_user');
          }
        }
      }

      if (isMounted) {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    // Auto-refresh Firebase ID token whenever it rotates
    const unsubscribeToken = onIdTokenChanged(auth, async (currentFbUser) => {
      if (currentFbUser && isMounted) {
        try {
          const freshIdToken = await currentFbUser.getIdToken();
          setToken(freshIdToken);
          localStorage.setItem('kkn_token', freshIdToken);
        } catch (e) {}
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  // Login with Email and Password
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Attempt Firebase sign-in
      let fbRes = null;
      try {
        fbRes = await signInWithEmailAndPassword(auth, email, password);
      } catch (fbErr) {
        // If not found in Firebase, attempt backend login (supports demo/seeded accounts)
        const res = await authAPI.login({ email, password });
        if (res.success && res.user) {
          setToken(res.token);
          setUser(res.user);
          localStorage.setItem('kkn_token', res.token);
          localStorage.setItem('kkn_user', JSON.stringify(res.user));
          success(`Welcome back, ${res.user.name}!`);
          setLoading(false);
          return { success: true, user: res.user };
        }
        throw fbErr;
      }

      if (fbRes?.user) {
        const idToken = await fbRes.user.getIdToken();
        setToken(idToken);
        localStorage.setItem('kkn_token', idToken);
        const syncRes = await syncFirebaseUser(fbRes.user);
        success(`Welcome back, ${syncRes.user.name || 'Trader'}!`);
        setLoading(false);
        return { success: true, user: syncRes.user };
      }
    } catch (err) {
      setLoading(false);
      let msg = err.message || 'Login failed. Please check credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Access is temporarily disabled. Reset your password or try again later.';
      }
      error(msg);
      return { success: false, message: msg };
    }
  };

  // Register with Email and Password
  const register = async (name, email, password, experienceLevel, tradingGoals) => {
    setLoading(true);
    try {
      const trimmedName = name ? name.trim() : email.split('@')[0];

      // 1. Create account with Firebase
      const fbRes = await createUserWithEmailAndPassword(auth, email, password);
      if (fbRes.user) {
        // Update display name in Firebase Auth immediately
        try {
          await fbUpdateProfile(fbRes.user, { displayName: trimmedName });
        } catch (e) {
          console.warn('[Profile Name Update Warning]:', e.message);
        }

        const idToken = await fbRes.user.getIdToken();
        setToken(idToken);
        localStorage.setItem('kkn_token', idToken);

        // 2. Synchronize with MongoDB & provision $100,000 virtual balance
        const syncRes = await syncFirebaseUser(fbRes.user, {
          name: trimmedName,
          experienceLevel,
          tradingGoals,
        });

        success('Account created! $100,000 Virtual Practice Funds added.');
        setLoading(false);
        return { success: true, user: syncRes.user };
      }
    } catch (err) {
      setLoading(false);
      let msg = err.message || 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please provide a valid email address.';
      }
      error(msg);
      return { success: false, message: msg };
    }
  };

  // Google One-Click Sign-In
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const fbRes = await signInWithPopup(auth, googleProvider);
      if (fbRes.user) {
        const idToken = await fbRes.user.getIdToken();
        setToken(idToken);
        localStorage.setItem('kkn_token', idToken);

        const syncRes = await syncFirebaseUser(fbRes.user, {
          name: fbRes.user.displayName,
          photoURL: fbRes.user.photoURL,
        });

        success(`Signed in as ${syncRes.user.name || fbRes.user.displayName}!`);
        setLoading(false);
        return { success: true, user: syncRes.user };
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return { success: false, message: 'Google sign-in was cancelled.' };
      }
      let msg = err.message || 'Google sign-in failed.';
      if (err.code === 'auth/account-exists-with-different-credential') {
        msg = 'An account already exists with this email using a different login method.';
      }
      error(msg);
      return { success: false, message: msg };
    }
  };

  // Password Reset Email
  const resetPassword = async (emailToReset) => {
    if (!emailToReset) {
      error('Please provide an email address for password reset.');
      return { success: false };
    }
    try {
      await sendPasswordResetEmail(auth, emailToReset);
      success('Password reset link sent to your email inbox.');
      return { success: true };
    } catch (err) {
      let msg = err.message || 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please provide a valid email address.';
      }
      error(msg);
      return { success: false, message: msg };
    }
  };

  // Immediate Logout (Instant UI response)
  const logout = () => {
    // 1. Instantly reset local state & remove storage tokens with zero latency
    setUser(null);
    setToken(null);
    setFirebaseUser(null);
    try {
      localStorage.removeItem('kkn_token');
      localStorage.removeItem('kkn_user');
    } catch (e) {}

    // 2. Terminate Firebase session asynchronously in the background
    try {
      signOut(auth).catch((e) => {
        console.warn('[Firebase SignOut Background]:', e.message);
      });
    } catch (e) {}

    success('Logged out successfully.');
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        if (auth.currentUser && data.name) {
          try {
            await fbUpdateProfile(auth.currentUser, { displayName: data.name });
          } catch (e) {}
        }
        success('Profile updated successfully.');
        return { success: true, user: res.user };
      }
    } catch (err) {
      // Client-side fallback update if offline
      if (data.name || data.experienceLevel) {
        const updated = {
          ...user,
          ...(data.name && { name: data.name }),
          ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
        };
        setUser(updated);
        localStorage.setItem('kkn_user', JSON.stringify(updated));
        if (auth.currentUser && data.name) {
          try {
            await fbUpdateProfile(auth.currentUser, { displayName: data.name });
          } catch (e) {}
        }
        success('Profile updated.');
        return { success: true, user: updated };
      }
      error(err.message || 'Failed to update profile.');
      return { success: false, message: err.message };
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        firebaseUser,
        loading,
        authInitialized,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
