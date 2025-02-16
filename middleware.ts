import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // استخراج اللغة من المسار
  const pathnameHasLocale = /^\/(ar|en)(\/.*)?$/.test(pathname);

  if (!pathnameHasLocale) {
    // إعادة توجيه إلى اللغة الافتراضية (العربية)
    return NextResponse.redirect(new URL(`/ar${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // تطبيق الوسيط على جميع الصفحات ما عدا ملفات الثوابت (static files)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};