"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

interface MuiProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  components: {
    // Material UI 컴포넌트들이 Tailwind와 잘 어울리도록 스타일 조정
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        },
      },
    },
  },
});

export function MuiProvider({ children }: MuiProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
