import { createContext, useContext, useState } from "react";

interface ThemeType {
  dark: boolean;
  changeTheme: () => void;
}

const ThemeContext = createContext<ThemeType | null>(null);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(false);
  const changeTheme = () => {
    setTheme(!theme);
  };
  return (
    <ThemeContext.Provider value={{ dark: theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
