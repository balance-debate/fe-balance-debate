"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/domains/common/components/AuthModal";

interface AuthModalContextType {
  openModal: (tab?: "login" | "signup") => void;
  closeModal: () => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "signup">("login");

  const openModal = (tab: "login" | "signup" = "login") => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openLoginModal = () => openModal("login");
  const openSignupModal = () => openModal("signup");

  return (
    <AuthModalContext.Provider
      value={{
        openModal,
        closeModal,
        openLoginModal,
        openSignupModal,
      }}
    >
      {children}

      {/* 전역 로그인 모달 */}
      <AuthModal open={isOpen} onClose={closeModal} defaultTab={defaultTab} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
