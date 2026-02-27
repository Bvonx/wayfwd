import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    query,
    where
} from "firebase/firestore";
import { db } from "../firebase";

export const dbService = {
    // ==================== COURSES ====================

    async getAllCourses() {
        try {
            const querySnapshot = await getDocs(collection(db, "courses"));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw error;
        }
    },

    async getCourse(courseId) {
        try {
            const docRef = doc(db, "courses", courseId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("Course not found");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            throw error;
        }
    },

    // ==================== USER PROGRESS ====================

    async getUserProgress(userId) {
        try {
            const docRef = doc(db, "userProgress", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user progress:", error);
            throw error;
        }
    },

    async updateUserProgress(userId, courseId, moduleId, score = null) {
        try {
            const progressRef = doc(db, "userProgress", userId);
            const progressSnap = await getDoc(progressRef);

            if (!progressSnap.exists()) {
                // Initialize progress doc if it doesn't exist
                await setDoc(progressRef, {
                    completedModules: {
                        [courseId]: [moduleId]
                    },
                    quizScores: score !== null ? { [`${courseId}_${moduleId} `]: score } : {},
                    lastActive: new Date().toISOString()
                });
            } else {
                const data = progressSnap.data();
                const courseProgress = data.completedModules?.[courseId] || [];

                // Update using arrayUnion to avoid duplicates
                if (!courseProgress.includes(moduleId)) {
                    await setDoc(progressRef, {
                        completedModules: {
                            ...data.completedModules,
                            [courseId]: [...courseProgress, moduleId]
                        },
                        quizScores: score !== null ? {
                            ...data.quizScores,
                            [`${courseId}_${moduleId} `]: score
                        } : (data.quizScores || {}),
                        lastActive: new Date().toISOString()
                    }, { merge: true });
                }
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            throw error;
        }
    },

    // ==================== CERTIFICATES ====================

    async generateCertificate(userId, courseId, courseName, userName) {
        try {
            const certId = `CERT - ${Date.now().toString(36).toUpperCase()} -${Math.random().toString(36).substring(2, 6).toUpperCase()} `;
            const certData = {
                userId,
                userName,
                courseId,
                courseName,
                issuedAt: new Date().toISOString(),
                verificationUrl: `${window.location.origin} /verify/${certId} `
            };

            await setDoc(doc(db, "certificates", certId), certData);
            return { id: certId, ...certData };
        } catch (error) {
            console.error("Error generating certificate:", error);
            throw error;
        }
    },

    async getUserCertificates(userId) {
        try {
            const q = query(collection(db, "certificates"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching certificates:", error);
            throw error;
        }
    }
};
