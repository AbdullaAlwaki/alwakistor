import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // استخراج اللغة من المسار
  const locales = ['ar', 'en']; // اللغات المدعومة
  const defaultLocale = 'ar'; // اللغة الافتراضية

  // التحقق مما إذا كان المسار يحتوي على لغة
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // إعادة توجيه إلى اللغة الافتراضية مع الحفاظ على المسار الأصلي
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // تطبيق الوسيط على جميع الصفحات ما عدا ملفات الثوابت (static files)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};