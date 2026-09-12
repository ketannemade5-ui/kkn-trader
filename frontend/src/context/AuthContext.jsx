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
  const [token, setToken] = useState(localStorage.getItem('kkn_token') || null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  // Helper to sync Firebase authenticated user with backend MongoDB & portfolio
  const syncFirebaseUser = async (fbUser, extraData = {}) => {
    try {
      const res = await authAPI.firebaseSync({
        uid: fbUser.uid,
        email: fbUser.email,
        name: extraData.name || fbUser.displayName || fbUser.email.split('@')[0],
        photoURL: fbUser.photoURL || '',
        experienceLevel: extraData.experienceLevel || 'BEGINNER',
        tradingGoals: extraData.tradingGoals || ['Learn Price Action', 'Practice $100,000 Paper Account'],
      });

      if (res && res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kkn_token', res.token);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('[Backend Sync Note]:', apiErr.message);
    }

    // Client-side fallback if backend API is unreachable
    const fallbackUser = {
      id: fbUser.uid,
      _id: fbUser.uid,
      name: extraData.name || fbUser.displayName || fbUser.email.split('@')[0],
      email: fbUser.email,
      role: 'USER',
      avatar: fbUser.photoURL || '',
      experienceLevel: extraData.experienceLevel || 'BEGINNER',
      tradingGoals: extraData.tradingGoals || ['Learn Market Structure'],
    };
    const fallbackToken = `fb_token_${fbUser.uid}`;
    setToken(fallbackToken);
    setUser(fallbackUser);
    localStorage.setItem('kkn_token', fallbackToken);
    localStorage.setItem('kkn_user', JSON.stringify(fallbackUser));
    return { success: true, user: fallbackUser };
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);
      if (currentFbUser && !localStorage.getItem('kkn_token')) {
        await syncFirebaseUser(currentFbUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check backend session validity
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token && !token.startsWith('fb_token_')) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('kkn_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Auto-login session expired or offline fallback:', err.message);
          if (err.message && (err.message.includes('expired') || err.message.includes('Invalid'))) {
            logout();
          }
        }
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login with Email and Password
  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Attempt Firebase sign-in
      let fbRes = null;
      try {
        fbRes = await signInWithEmailAndPassword(auth, email, password);
      } catch (fbErr) {
        // If not found in Firebase or password invalid, attempt backend login (supports seeded demo accounts)
        const res = await authAPI.login({ email, password });
        if (res.success) {
          setToken(res.token);
          setUser(res.user);
          localStorage.setItem('kkn_token', res.token);
          localStorage.setItem('kkn_user', JSON.stringify(res.user));
          success(`Welcome back, ${res.user.name}!`);
          setLoading(false);
          return { success: true };
        }
        throw fbErr;
      }

      if (fbRes?.user) {
        const syncRes = await syncFirebaseUser(fbRes.user);
        success(`Welcome back, ${syncRes.user.name}!`);
        setLoading(false);
        return { success: true };
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
      // 1. Create account with Firebase
      const fbRes = await createUserWithEmailAndPassword(auth, email, password);
      if (fbRes.user) {
        try {
          await fbUpdateProfile(fbRes.user, { displayName: name });
        } catch (e) {
          // ignore profile update error
        }

        // 2. Synchronize with MongoDB & provision $100,000 virtual balance
        await syncFirebaseUser(fbRes.user, { name, experienceLevel, tradingGoals });
        success('Account created! $100,000 Virtual Practice Funds added.');
        setLoading(false);
        return { success: true };
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
        const syncRes = await syncFirebaseUser(fbRes.user);
        success(`Signed in as ${syncRes.user.name || fbRes.user.displayName}!`);
        setLoading(false);
        return { success: true };
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

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('kkn_token');
    localStorage.removeItem('kkn_user');
    success('Logged out successfully.');
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('kkn_user', JSON.stringify(res.user));
        if (auth.currentUser && data.name) {
          try {
            await fbUpdateProfile(auth.currentUser, { displayName: data.name });
          } catch (e) {}
        }
        success('Profile updated successfully.');
        return { success: true };
      }
    } catch (err) {
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

