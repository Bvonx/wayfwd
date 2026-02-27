/**
 * API Service Layer
 * Simulates backend API calls with realistic delays and responses.
 * Ready for real backend integration - just replace the simulation logic.
 */

const API_DELAY = 800; // Simulated network delay in ms
const STORAGE_PREFIX = 'wayfwrd_';

// Rate limiting state
const rateLimits = {
    login: { attempts: 0, resetAt: null, maxAttempts: 5, windowMs: 15 * 60 * 1000 },
    signup: { attempts: 0, resetAt: null, maxAttempts: 3, windowMs: 60 * 60 * 1000 },
    passwordReset: { attempts: 0, resetAt: null, maxAttempts: 3, windowMs: 60 * 60 * 1000 },
    verification: { attempts: 0, resetAt: null, maxAttempts: 5, windowMs: 60 * 60 * 1000 },
};

// Simulated user database
const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}users`) || '[]');
    } catch {
        return [];
    }
};

const saveUsers = (users) => {
    localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
};

// Token management
const generateToken = () => {
    return 'tk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateVerificationToken = () => {
    return 'vf_' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateResetToken = () => {
    return 'rst_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generate2FACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
};

const generateCertificateId = () => {
    return 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
};

// Delay helper
const delay = (ms = API_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting check
const checkRateLimit = (endpoint) => {
    const limit = rateLimits[endpoint];
    if (!limit) return { allowed: true };

    const now = Date.now();

    // Reset if window expired
    if (limit.resetAt && now > limit.resetAt) {
        limit.attempts = 0;
        limit.resetAt = null;
    }

    if (limit.attempts >= limit.maxAttempts) {
        const remainingMs = limit.resetAt - now;
        return {
            allowed: false,
            remainingAttempts: 0,
            resetAt: limit.resetAt,
            remainingMs,
            message: `Too many attempts. Please try again in ${Math.ceil(remainingMs / 60000)} minutes.`
        };
    }

    return {
        allowed: true,
        remainingAttempts: limit.maxAttempts - limit.attempts
    };
};

const incrementRateLimit = (endpoint) => {
    const limit = rateLimits[endpoint];
    if (!limit) return;

    limit.attempts++;
    if (!limit.resetAt) {
        limit.resetAt = Date.now() + limit.windowMs;
    }
};

const resetRateLimit = (endpoint) => {
    const limit = rateLimits[endpoint];
    if (limit) {
        limit.attempts = 0;
        limit.resetAt = null;
    }
};

// API Methods
export const api = {
    // ==================== AUTH ====================

    async login(email, password) {
        const rateCheck = checkRateLimit('login');
        if (!rateCheck.allowed) {
            throw new Error(rateCheck.message);
        }

        await delay();
        incrementRateLimit('login');

        const users = getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            // Generate and store temporary 2FA code (in real app, this would be TOTP)
            const code = generate2FACode();
            user.pending2FACode = code;
            user.pending2FAExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
            saveUsers(users);

            return {
                requires2FA: true,
                userId: user.id,
                email: user.email
            };
        }

        resetRateLimit('login');

        const token = generateToken();
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                tier: user.tier,
                createdAt: user.createdAt
            },
            token
        };
    },

    async verify2FA(userId, code, rememberDevice = false) {
        await delay(500);

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check code
        const isBackupCode = user.backupCodes?.includes(code);
        const isValidCode = user.pending2FACode === code && Date.now() < user.pending2FAExpiry;

        if (!isValidCode && !isBackupCode) {
            throw new Error('Invalid verification code');
        }

        // Remove used backup code
        if (isBackupCode) {
            user.backupCodes = user.backupCodes.filter(c => c !== code);
        }

        // Clear pending code
        delete user.pending2FACode;
        delete user.pending2FAExpiry;

        // Remember device if requested
        if (rememberDevice) {
            const deviceId = 'dev_' + Math.random().toString(36).substring(2);
            user.trustedDevices = user.trustedDevices || [];
            user.trustedDevices.push({
                id: deviceId,
                addedAt: Date.now(),
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
            });
            localStorage.setItem(`${STORAGE_PREFIX}device_${user.id}`, deviceId);
        }

        saveUsers(users);
        resetRateLimit('login');

        const token = generateToken();
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactorEnabled,
                tier: user.tier,
                createdAt: user.createdAt
            },
            token
        };
    },

    async signup(firstName, lastName, email, password) {
        const rateCheck = checkRateLimit('signup');
        if (!rateCheck.allowed) {
            throw new Error(rateCheck.message);
        }

        await delay(1000);
        incrementRateLimit('signup');

        const users = getUsers();
        const exists = users.find(u => u.email === email.toLowerCase().trim());

        if (exists) {
            throw new Error('An account with this email already exists');
        }

        const verificationToken = generateVerificationToken();
        const newUser = {
            id: 'user_' + Date.now(),
            email: email.toLowerCase().trim(),
            password, // In real app, this would be hashed
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            emailVerified: false,
            verificationToken,
            verificationExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            twoFactorEnabled: false,
            tier: 'community',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Simulate sending verification email
        console.log(`[EMAIL SIMULATION] Verification code for ${email}: ${verificationToken}`);

        const token = generateToken();
        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                emailVerified: false,
                twoFactorEnabled: false,
                tier: 'community',
                createdAt: newUser.createdAt
            },
            token,
            verificationPending: true
        };
    },

    async resendVerificationEmail(userId) {
        const rateCheck = checkRateLimit('verification');
        if (!rateCheck.allowed) {
            throw new Error(rateCheck.message);
        }

        await delay(500);
        incrementRateLimit('verification');

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email is already verified');
        }

        const verificationToken = generateVerificationToken();
        user.verificationToken = verificationToken;
        user.verificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
        saveUsers(users);

        console.log(`[EMAIL SIMULATION] New verification code for ${user.email}: ${verificationToken}`);

        return { success: true, message: 'Verification email sent' };
    },

    async verifyEmail(userId, code) {
        await delay(500);

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            return { success: true, alreadyVerified: true };
        }

        if (user.verificationToken !== code.toUpperCase()) {
            throw new Error('Invalid verification code');
        }

        if (Date.now() > user.verificationExpiry) {
            throw new Error('Verification code has expired. Please request a new one.');
        }

        user.emailVerified = true;
        delete user.verificationToken;
        delete user.verificationExpiry;
        saveUsers(users);

        return { success: true };
    },

    async requestPasswordReset(email) {
        const rateCheck = checkRateLimit('passwordReset');
        if (!rateCheck.allowed) {
            throw new Error(rateCheck.message);
        }

        await delay(800);
        incrementRateLimit('passwordReset');

        const users = getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        // Always return success to prevent email enumeration
        if (!user) {
            return { success: true, message: 'If an account exists, a reset link has been sent.' };
        }

        const resetToken = generateResetToken();
        user.resetToken = resetToken;
        user.resetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
        saveUsers(users);

        console.log(`[EMAIL SIMULATION] Password reset token for ${email}: ${resetToken}`);

        return { success: true, message: 'If an account exists, a reset link has been sent.' };
    },

    async resetPassword(token, newPassword) {
        await delay(800);

        const users = getUsers();
        const user = users.find(u => u.resetToken === token);

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        if (Date.now() > user.resetExpiry) {
            throw new Error('Reset token has expired. Please request a new one.');
        }

        user.password = newPassword;
        delete user.resetToken;
        delete user.resetExpiry;
        saveUsers(users);

        return { success: true };
    },

    // ==================== 2FA ====================

    async setup2FA(userId) {
        await delay(500);

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Generate setup data (in real app, this would be TOTP secret)
        const secret = 'JBSWY3DPEHPK3PXP'; // Demo secret
        const backupCodes = generateBackupCodes();

        // Store pending setup
        user.pending2FASecret = secret;
        user.pendingBackupCodes = backupCodes;
        saveUsers(users);

        // Generate a "current" code for verification
        const currentCode = generate2FACode();
        user.setup2FACode = currentCode;
        user.setup2FAExpiry = Date.now() + 10 * 60 * 1000; // 10 min
        saveUsers(users);

        console.log(`[2FA SIMULATION] Setup code for ${user.email}: ${currentCode}`);

        return {
            secret,
            qrCodeUrl: `otpauth://totp/WayFwrd:${user.email}?secret=${secret}&issuer=WayFwrd`,
            backupCodes,
            setupCode: currentCode // In dev mode, return the code for testing
        };
    },

    async confirm2FASetup(userId, code) {
        await delay(500);

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.setup2FACode !== code || Date.now() > user.setup2FAExpiry) {
            throw new Error('Invalid verification code');
        }

        user.twoFactorEnabled = true;
        user.twoFactorSecret = user.pending2FASecret;
        user.backupCodes = user.pendingBackupCodes;

        delete user.pending2FASecret;
        delete user.pendingBackupCodes;
        delete user.setup2FACode;
        delete user.setup2FAExpiry;

        saveUsers(users);

        return { success: true, backupCodes: user.backupCodes };
    },

    async disable2FA(userId, password) {
        await delay(500);

        const users = getUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== password) {
            throw new Error('Invalid password');
        }

        user.twoFactorEnabled = false;
        delete user.twoFactorSecret;
        delete user.backupCodes;
        delete user.trustedDevices;

        saveUsers(users);

        return { success: true };
    },

    // ==================== CERTIFICATES ====================

    async generateCertificate(userId, courseId, courseName) {
        await delay(500);

        const certificateId = generateCertificateId();
        const certificates = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}certificates`) || '[]');

        const cert = {
            id: certificateId,
            userId,
            courseId,
            courseName,
            issuedAt: new Date().toISOString(),
            verificationUrl: `https://wayfwrd.com/verify/${certificateId}`
        };

        certificates.push(cert);
        localStorage.setItem(`${STORAGE_PREFIX}certificates`, JSON.stringify(certificates));

        return cert;
    },

    async getCertificates(userId) {
        await delay(300);
        const certificates = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}certificates`) || '[]');
        return certificates.filter(c => c.userId === userId);
    },

    async verifyCertificate(certificateId) {
        await delay(300);
        const certificates = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}certificates`) || '[]');
        const cert = certificates.find(c => c.id === certificateId);

        if (!cert) {
            return { valid: false };
        }

        const users = getUsers();
        const user = users.find(u => u.id === cert.userId);

        return {
            valid: true,
            certificate: cert,
            recipientName: user ? `${user.firstName} ${user.lastName}` : 'Unknown'
        };
    },

    // ==================== ANALYTICS ====================

    async getAnalytics(userId) {
        await delay(400);

        const progress = JSON.parse(localStorage.getItem('wayfwrd_progress') || '{}');
        const certificates = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}certificates`) || '[]');

        // Calculate statistics
        const completedModules = Object.values(progress.completedModules || {})
            .reduce((acc, modules) => acc + (Array.isArray(modules) ? modules.length : 0), 0);

        const quizScores = Object.values(progress.quizScores || {});
        const averageScore = quizScores.length > 0
            ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
            : 0;

        // Simulated learning time (would track real time in production)
        const learningTimeMinutes = completedModules * 15 + Math.floor(Math.random() * 30);

        // Simulated skill levels based on completed courses
        const skills = {
            linux: progress.completedModules?.['linux-basics']?.length > 2 ? 80 : 40,
            networking: progress.completedModules?.['network-defense']?.length > 1 ? 70 : 30,
            webSecurity: progress.completedModules?.['web-security']?.length > 1 ? 60 : 20,
            scripting: 25,
            forensics: 15
        };

        // Simulated activity data (last 30 days)
        const activityData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            activityData.push({
                date: date.toISOString().split('T')[0],
                minutes: Math.floor(Math.random() * 60),
                modulesCompleted: Math.floor(Math.random() * 2)
            });
        }

        // Calculate streak
        let streak = 0;
        for (let i = activityData.length - 1; i >= 0; i--) {
            if (activityData[i].minutes > 0) {
                streak++;
            } else {
                break;
            }
        }

        return {
            totalLearningMinutes: learningTimeMinutes,
            completedModules,
            completedCourses: certificates.filter(c => c.userId === userId).length,
            averageQuizScore: averageScore,
            currentStreak: streak,
            longestStreak: Math.max(streak, 7), // Simulated
            skills,
            activityData,
            certificatesEarned: certificates.filter(c => c.userId === userId).length
        };
    },

    // ==================== RATE LIMIT INFO ====================

    getRateLimitStatus(endpoint) {
        return checkRateLimit(endpoint);
    }
};

export default api;
