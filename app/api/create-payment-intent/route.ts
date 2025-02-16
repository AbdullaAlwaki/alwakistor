import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// تهيئة Stripe باستخدام المفتاح السري
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: Request) {
  try {
    const { cartItems } = await request.json();

    // حساب السعر الإجمالي من عناصر السلة
    const totalAmount = cartItems.reduce((total: number, item: any) => total + item.price * 100, 0); // تحويل السعر إلى سنتات

    // إنشاء طلب الدفع
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // إرجاع clientSecret إلى العميل
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء طلب الدفع.' }, { status: 500 });
  }
}