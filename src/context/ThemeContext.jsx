
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskflowDarkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem(
      "taskflowDarkMode",
      darkMode
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

