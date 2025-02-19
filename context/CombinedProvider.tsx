import React from "react";
import { DarkModeProvider } from "./DarkModeContext";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthContext";

// مزود مشترك يجمع جميع السياقات
export const CombinedProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <DarkModeProvider>
      <CartProvider>
        <AuthProvider>{children}</AuthProvider>
      </CartProvider>
    </DarkModeProvider>
  );
};