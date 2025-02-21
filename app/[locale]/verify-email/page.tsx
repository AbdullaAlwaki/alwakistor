"use client"; // ✅ تحديد أن هذا المكون هو Client Component
import React, { useEffect, useState } from "react"; // ✅ استيراد React بشكل صريح
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { useTranslation } from "../useTranslation";

export default function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<string>("en");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // ✅ حالة التحميل
  const [countdown, setCountdown] = useState<number>(3); // ✅ مؤقت العد التنازلي
  const { t } = useTranslation(locale);
  const router = useRouter();

  useEffect(() => {
    if (params) {
      params.then((unwrappedParams) => {
        setLocale(unwrappedParams.locale);
      });
    }

    // استخراج token و email من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token")?.trim(); // ✅ إزالة المسافات الزائدة
    const email = urlParams.get("email")?.trim(); // ✅ إزالة المسافات الزائدة

    console.log("Extracted Token:", token); // ✅ تسجيل الـ token للتحقق منه
    console.log("Extracted Email:", email); // ✅ تسجيل البريد الإلكتروني للتحقق منه

    if (!token || !email) {
      setError(t("verify.invalidLink")); // ✅ عرض رسالة الخطأ إذا كان الرابط غير صالح
      setIsLoading(false); // ✅ إيقاف التحميل في حالة وجود خطأ
      return;
    }

    // التحقق من صلاحية الرابط باستخدام نقطة النهاية
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); // ✅ تسجيل استجابة API للتحقق منها
        if (data.error) {
          setError(data.error); // ✅ عرض رسالة الخطأ إذا كانت هناك مشكلة
        } else {
          setMessage(data.message); // ✅ عرض رسالة النجاح
          playSuccessSound(); // ✅ تشغيل صوت التأكيد
          startCountdown(); // ✅ بدء العد التنازلي
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err); // ✅ تسجيل خطأ الطلب
        setError(t("verify.error")); // ✅ عرض رسالة الخطأ العامة
      })
      .finally(() => {
        setIsLoading(false); // ✅ إيقاف التحميل بعد انتهاء العملية
      });
  }, [params]);

  // بدء العد التنازلي
  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  };

  // إعادة التوجيه عند انتهاء العد التنازلي
  useEffect(() => {
    if (countdown === 0 && message) {
      router.push(`/${locale}/login`);
    }
  }, [countdown, message]);

  // تشغيل صوت التأكيد
  const playSuccessSound = () => {
    const audio = new Audio("/sounds/success.mp3");
    audio.play();
  };

  // تهيئة الجسيمات المتحركة
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesLoaded = async (container: any) => {
    console.log(container);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 relative">
      {/* خلفية متحركة */}
      <div className="fixed inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded} // ✅ إصلاح نوع الدالة
          options={{
            background: {
              color: "#f3f4f6", // خلفية بيضاء
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#3b82f6", // لون الجسيمات
              },
              links: {
                color: "#3b82f6",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-6 text-center"
      >
        {/* العنوان */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("verify.title")}
        </h1>

        {/* مؤشر التحميل */}
        {isLoading && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-b-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t("verify.verifying")}</p>
          </div>
        )}

        {/* رسالة النجاح */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-500 text-sm">{message}</p>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              {t("verify.redirecting")}... {countdown}s
            </p>
          </motion.div>
        )}

        {/* رسالة الخطأ */}
        {!message && error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()} // إعادة المحاولة
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs mt-4"
            >
              {t("verify.retry")}
            </button>
            <button
              onClick={() => router.push(`/${locale}/login`)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs mt-4"
            >
              {t("verify.backToLogin")}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}