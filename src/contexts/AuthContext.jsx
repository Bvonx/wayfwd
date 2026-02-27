import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(firstName, lastName, email, password) {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        const profileData = {
            firstName,
            lastName,
            email,
            createdAt: new Date().toISOString(),
            role: 'student'
        };
        await setDoc(doc(db, "users", result.user.uid), profileData);
        setUserProfile(profileData);

        return result;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        setUserProfile(null);
        return signOut(auth);
    }

    function googleSignIn() {
        return signInWithPopup(auth, googleProvider);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                // Fetch user profile
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();

                        const providerData = user.providerData?.[0] || {};
                        const detectedProvider = providerData.providerId === 'google.com' ? 'google' : 'email';
                        const currentEmail = user.email || providerData.email;
                        const currentPhoto = user.photoURL || providerData.photoURL;
                        const currentDisplayName = user.displayName || providerData.displayName;

                        const isClyde = currentEmail?.toLowerCase().includes('clyde') ||
                            currentDisplayName?.toLowerCase().includes('clyde') ||
                            currentDisplayName?.toLowerCase().includes('bravin');

                        // Self-healing: Update profile if missing data or generic "User" name
                        const needsUpdate =
                            !userData.createdAt ||
                            !userData.firstName ||
                            userData.firstName === 'User' ||
                            !userData.email ||
                            !userData.authProvider ||
                            (currentPhoto && !userData.photoURL) ||
                            (isClyde && userData.role !== 'admin');

                        if (needsUpdate) {
                            console.log("Updating user profile with latest auth data...");

                            const updates = {};

                            // Only update fields if they are missing or generic
                            if (!userData.createdAt) updates.createdAt = new Date().toISOString();

                            // Auto-promote Clyde to admin
                            if (isClyde && userData.role !== 'admin') {
                                updates.role = 'admin';
                            } else if (!userData.role) {
                                updates.role = 'student';
                            }

                            if (!userData.authProvider) updates.authProvider = detectedProvider;

                            // Sync email if missing
                            if (!userData.email && currentEmail) updates.email = currentEmail;

                            // Sync photo if missing
                            if (!userData.photoURL && currentPhoto) updates.photoURL = currentPhoto;

                            // Update name if it looks like a default or is missing, and we have a display name
                            if ((!userData.firstName || userData.firstName === 'User' || !userData.lastName) && currentDisplayName) {
                                const names = currentDisplayName.split(' ');
                                updates.firstName = names[0] || 'User';
                                if (names.length > 1) updates.lastName = names.slice(1).join(' ');
                            }

                            if (Object.keys(updates).length > 0) {
                                await setDoc(docRef, updates, { merge: true });
                                console.log("Profile updated:", updates);
                                setUserProfile({ ...userData, ...updates });
                            } else {
                                setUserProfile(userData);
                            }
                        } else {
                            setUserProfile(userData);
                        }
                    } else {
                        // Create new profile from Google data
                        const providerData = user.providerData?.[0] || {};
                        const email = user.email || providerData.email;
                        const photoURL = user.photoURL || providerData.photoURL;
                        const displayName = user.displayName || providerData.displayName || '';

                        let firstName = 'User';
                        let lastName = '';

                        if (displayName) {
                            const names = displayName.split(' ');
                            firstName = names[0] || 'User';
                            lastName = names.slice(1).join(' ');
                        }

                        const isClyde = email?.toLowerCase().includes('clyde') ||
                            displayName?.toLowerCase().includes('clyde') ||
                            displayName?.toLowerCase().includes('bravin');

                        const newProfile = {
                            firstName,
                            lastName,
                            email,
                            photoURL,
                            createdAt: new Date().toISOString(),
                            role: isClyde ? 'admin' : 'student',
                            authProvider: 'google'
                        };

                        // Save to Firestore
                        await setDoc(docRef, newProfile);
                        setUserProfile(newProfile);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function updateUser(data) {
        if (!currentUser) return;

        try {
            const userRef = doc(db, "users", currentUser.uid);
            await setDoc(userRef, data, { merge: true });

            // Update local state immediately
            setUserProfile(prev => ({ ...prev, ...data }));

            return true;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }

    const value = {
        currentUser,
        user: userProfile ? { ...userProfile, uid: currentUser?.uid } : null,
        isAuthenticated: !!currentUser,
        isLoading: loading,
        signup,
        login,
        logout,
        googleSignIn,
        resetPassword,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
