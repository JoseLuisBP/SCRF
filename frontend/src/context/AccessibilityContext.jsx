import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

const STORAGE_KEY = 'accessibility_preferences';

const defaultPreferences = {
  fontSize: 'medium',
  highContrast: false,
  seniorMode: false
};

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    
    // Aplicar preferencias al documento
    document.documentElement.style.fontSize = getFontSizeValue(preferences.fontSize);
    document.body.classList.toggle('high-contrast', preferences.highContrast);
    document.body.classList.toggle('senior-mode', preferences.seniorMode);
  }, [preferences]);

  const getFontSizeValue = (size) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    return sizes[size] || sizes.medium;
  };

  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(preferences.fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    
    setPreferences(prev => ({
      ...prev,
      fontSize: nextSize
    }));
  };

  const toggleContrast = () => {
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  const toggleSeniorMode = () => {
    setPreferences(prev => ({
      ...prev,
      seniorMode: !prev.seniorMode,
      fontSize: !prev.seniorMode ? 'large' : 'medium',
      highContrast: !prev.seniorMode ? true : false
    }));
  };

  const value = {
    ...preferences,
    increaseFontSize,
    toggleContrast,
    toggleSeniorMode
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de un AccessibilityProvider');
  }
  return context;
};
