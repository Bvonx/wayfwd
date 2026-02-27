/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
    // Appearance
    theme: 'light',

    // Notifications
    emailNotifications: true,
    browserNotifications: false,
    courseUpdates: true,
    weeklyDigest: true,

    // Privacy
    profileVisibility: 'public', // 'public', 'private', 'friends'
    showActivityStatus: true,
    showProgress: true,

    // Accessibility
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium', // 'small', 'medium', 'large'

    // Language
    language: 'en',
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('wayfwrd_settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!isLoaded) return;

        const root = document.documentElement;

        if (settings.theme === 'dark') {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.remove('dark-theme');
            root.classList.add('light-theme');
        }

        // Apply reduced motion
        if (settings.reducedMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // Apply high contrast
        if (settings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Apply font size
        root.setAttribute('data-font-size', settings.fontSize);
    }, [settings.theme, settings.reducedMotion, settings.highContrast, settings.fontSize, isLoaded]);

    // Persist settings to localStorage
    const persistSettings = useCallback((newSettings) => {
        localStorage.setItem('wayfwrd_settings', JSON.stringify(newSettings));
    }, []);

    // Update a single setting
    const updateSetting = useCallback((key, value) => {
        setSettings(prev => {
            const updated = { ...prev, [key]: value };
            persistSettings(updated);
            return updated;
        });
    }, [persistSettings]);

    // Update multiple settings at once
    const updateSettings = useCallback((updates) => {
        setSettings(prev => {
            const updated = { ...prev, ...updates };
            persistSettings(updated);
            return updated;
        });
    }, [persistSettings]);

    // Reset settings to defaults
    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
        persistSettings(DEFAULT_SETTINGS);
    }, [persistSettings]);

    // Request browser notification permission
    const requestNotificationPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            return { granted: false, error: 'Browser does not support notifications' };
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                updateSetting('browserNotifications', true);
                return { granted: true };
            } else {
                updateSetting('browserNotifications', false);
                return { granted: false, error: 'Permission denied' };
            }
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }, [updateSetting]);

    const value = {
        settings,
        isLoaded,
        updateSetting,
        updateSettings,
        resetSettings,
        requestNotificationPermission,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export default SettingsContext;
