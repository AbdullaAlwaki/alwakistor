"use client"; // تحديد أن هذا المكون هو Client Component

import ar from './i18n/ar';
import en from './i18n/en';

// تعريف الرسائل لكل لغة
const translations = {
  ar,
  en,
};

// إعداد العملات لكل لغة
const currencyFormats = {
  ar: {
    symbol: "ر.س", // ريال سعودي
    locale: "ar-SA",
    currency: "SAR",
  },
  en: {
    symbol: "$", // دولار أمريكي
    locale: "en-US",
    currency: "USD",
  },
  fr: {
    symbol: "€", // يورو
    locale: "fr-FR",
    currency: "EUR",
  },
};

export const useTranslation = (locale) => {
  // التحقق من أن اللغة صالحة
  const validLocale = locale || 'en'; // العودة إلى اللغة الإنجليزية إذا كانت اللغة غير محددة

  // الحصول على الترجمة بناءً على اللغة
  const t = (key) => {
    try {
      const keys = key.split(".");
      let message = translations[validLocale];
      for (const k of keys) {
        message = message?.[k];
        if (!message) break;
      }
      return message || key; // إذا لم يتم العثور على الترجمة، يتم إرجاع المفتاح نفسه
    } catch (error) {
      console.error(`Error fetching translation for key: ${key}`, error);
      return key; // إرجاع المفتاح في حالة حدوث خطأ
    }
  };

  // دالة لتنسيق العملة مع الأرقام الغربية
  const formatCurrency = (amount) => {
    const { locale: currencyLocale, currency } = currencyFormats[validLocale] || currencyFormats.en;

    // تنسيق العملة باستخدام Intl.NumberFormat
    const formattedAmount = new Intl.NumberFormat(currencyLocale, {
      style: "currency",
      currency,
    }).format(amount);

    // استبدال الأرقام العربية بالأرقام الغربية
    return formattedAmount.replace(/[\u0660-\u0669]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 1632 + 48)
    );
  };

  return { t, formatCurrency };
};