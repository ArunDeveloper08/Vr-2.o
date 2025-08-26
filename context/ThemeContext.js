import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the context data
const ThemeContext = createContext();

// Define our theme colors in one place
export const darkTheme = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  shadowDark: "rgba(0, 0, 0, 0.6)",
  positive: "#34D399",
  negative: "#F87171",
  neutralDark: "#303A52",
  modalOverlay: "rgba(0, 0, 0, 0.8)",
  toggleBackground: "#0A0F1E",
};

export const lightTheme = {
  background: "#F4F6F8",
  cardBackground: "#FFFFFF",
  accentBlue: "#007AFF",
  accentBlueGlow: "rgba(0, 122, 255, 0.4)",
  textPrimary: "#1C1C1E",
  textSecondary: "#6E6E73",
  iconColor: "#4A4A4A",
  shadowDark: "rgba(0, 0, 0, 0.15)",
  positive: "#34C759",
  negative: "#FF3B30",
  neutralDark: "#E5E5EA",
  modalOverlay: "rgba(0, 0, 0, 0.5)",
  toggleBackground: "#E9ECEF",
};


// The Provider component that will wrap our app
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme, defaulting to 'dark'
  const [theme, setTheme] = useState('dark');
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // Effect to load the saved theme from AsyncStorage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadTheme();
  }, []);

  // Function to toggle the theme and save the choice to AsyncStorage
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  // Determine which theme object to use based on the state
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  // If the theme is still loading, you can show a splash screen or loading indicator
  // This prevents a "flash" of the default theme before the saved one is loaded.
  if (isLoadingTheme) {
    return null; // Or return a loading component
  }

  // The value provided to consuming components
  const value = {
    theme,
    toggleTheme,
    colors: currentTheme, // Provide the full color object directly
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily consume the theme context in any component
export const useTheme = () => useContext(ThemeContext);