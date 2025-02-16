import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  // التحقق من وجود المفتاح
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (token !== 'your-secret-token') {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 403 });
  }

  // جلب البيانات من مصدر خارجي
  const products = await fetch('https://api.example.com/products').then((res) => res.json());
  return NextResponse.json(products);
}