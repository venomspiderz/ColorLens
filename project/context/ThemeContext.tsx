import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isColorCorrectionEnabled: boolean;
  setIsColorCorrectionEnabled: (value: boolean) => void;
  colors: {
    background: string;
    text: string;
    border: string;
    card: string;
    primary: string;
    secondary: string;
    error: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isColorCorrectionEnabled, setIsColorCorrectionEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [darkMode, colorCorrection] = await Promise.all([
        AsyncStorage.getItem('settings:darkMode'),
        AsyncStorage.getItem('settings:colorCorrection')
      ]);
      
      if (darkMode !== null) setIsDarkMode(JSON.parse(darkMode));
      if (colorCorrection !== null) setIsColorCorrectionEnabled(JSON.parse(colorCorrection));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#8E8E93',
    error: '#FF3B30'
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode, 
        setIsDarkMode, 
        isColorCorrectionEnabled, 
        setIsColorCorrectionEnabled,
        colors 
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}