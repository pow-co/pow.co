// ColorSchemeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ColorSchemeContextProps {
  colorScheme: string;
  setColorScheme: React.Dispatch<React.SetStateAction<string>>;
}

const ColorSchemeContext = createContext<ColorSchemeContextProps | undefined>(
  undefined
);

export const useColorScheme = (): ColorSchemeContextProps => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};

interface ColorSchemeProviderProps {
  children: ReactNode;
}

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({
  children,
}) => {
  const [colorScheme, setColorScheme] = useState<string>("chrome");

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
