// theme/ThemeContext.js
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@src/theme/styles';

const ThemeContext = createContext({
  theme: lightTheme, // default
  isDark: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const scheme = useColorScheme(); // 'light', 'dark', or null
  const isDark = scheme === 'dark';
  
  // Automatically swap the theme object based on the scheme
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);