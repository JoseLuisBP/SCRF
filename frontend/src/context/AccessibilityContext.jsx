import { createContext, useContext, useState, useEffect } from 'react';
{/*Creacion del contexto */}
const AccessibilityContext = createContext();
{/*Es clave para su localstorage */}
{/*Guarda las preferencias del usuario */}
const STORAGE_KEY = 'accessibility_preferences';

{/*Preferencias por defecto */}
const defaultPreferences = {
  fontSize: 'medium',     
  highContrast: false,      //modo alto contraste
  seniorMode: false         //modo adulto mayor
};


export function AccessibilityProvider({ children }) {
 
  {/*Carga Localstorage si existe */}
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPreferences;
  });

    {/*Efectos: guarda y aplica cambio visuales */}
  useEffect(() => {
    {/*Guardar en Localstorage */}
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    
    {/* Aplicar preferencias al documento */}
    document.documentElement.style.fontSize = getFontSizeValue(preferences.fontSize);
    {/*Activar o desactivar clase CSS */}
    document.body.classList.toggle('high-contrast', preferences.highContrast);
    document.body.classList.toggle('senior-mode', preferences.seniorMode);
  }, [preferences]);

  {/*Cambiar tamaño de fuente */}
  const getFontSizeValue = (size) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    return sizes[size] || sizes.medium;
  };

  {/*Aumentar el tamaño de fuente */}
  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(preferences.fontSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    
    setPreferences(prev => ({
      ...prev,
      fontSize: nextSize
    }));
  };

  {/*Activa/desactiva contraste */}
  const toggleContrast = () => {
    setPreferences(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };
{/* Modo adulto mayor */}
  const toggleSeniorMode = () => {
    setPreferences(prev => ({
      ...prev,
      seniorMode: !prev.seniorMode,
      fontSize: !prev.seniorMode ? 'large' : 'medium',
      highContrast: !prev.seniorMode ? true : false
    }));
  };

  {/*Comparte el contexto */}
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
