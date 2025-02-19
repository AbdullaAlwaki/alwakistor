import React, { createContext, useState, useEffect } from "react";

// إنشاء سياق اللغة
interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// مزود اللغة
export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<string>("en"); // الافتراضي هو اللغة الإنجليزية

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};