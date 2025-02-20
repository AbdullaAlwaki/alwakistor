"use client";
import { motion } from "framer-motion";

export default function HeroSection({
  title,
  subtitle,
  buttonText,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
}) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 text-white py-24 w-full flex items-center justify-center">
      <div className="container mx-auto text-center px-6 flex flex-col items-center">
        {/* عنوان الهيرو */}
        <motion.h1
          className="text-5xl font-extrabold mb-6 max-w-2xl leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>

        {/* الوصف */}
        <motion.p
          className="text-lg max-w-xl mb-8 opacity-80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {subtitle}
        </motion.p>

        {/* زر الدعوة لاتخاذ إجراء */}
        <motion.button
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {buttonText}
        </motion.button>
      </div>
    </section>
  );
}
