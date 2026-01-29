import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type TTheme = "light" | "dark";

interface IThemeContext {
  theme: TTheme;
  toggleTheme: (value: TTheme) => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be within ThemeProvider");
  }

  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<TTheme>("light");

  const colorScheme = useColorScheme();

  useEffect(() => {
    setTheme(colorScheme === "light" ? "light" : "dark");
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
