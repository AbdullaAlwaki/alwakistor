'use client'; // تحديد أن هذا المكون هو Client Component

import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`, // إعادة التوجيه إلى صفحة النجاح
      },
    });

    if (error) {
      console.error(error);
      window.location.href = '/failure'; // إعادة التوجيه إلى صفحة الفشل
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">تأكيد الدفع</h2>

      {/* حقل الملاحظة */}
      <div className="mb-4">
        <label htmlFor="note" className="block text-gray-700 font-medium mb-2">
          ملاحظة (اختياري)
        </label>
        <textarea
          id="note"
          name="note"
          placeholder="اكتب أي ملاحظة خاصة بالطلب هنا..."
          className="w-full p-2 border rounded resize-none"
          rows={3}
        ></textarea>
      </div>

      {/* واجهة الدفع الخاصة بـ Stripe */}
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className="mt-4 bg-green-500 text-white px-6 py-3 rounded w-full hover:bg-green-600"
      >
        تأكيد الدفع باستخدام Stripe
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // استدعاء API لإنشاء طلب الدفع
    const createPaymentIntent = async () => {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: [] }), // يمكنك تمرير عناصر السلة هنا
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    };

    createPaymentIntent();
  }, []);

  if (!clientSecret) {
    return <div className="text-center mt-10">جارٍ تحميل واجهة الدفع...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">اختر طريقة الدفع</h1>

        {/* خيار الدفع باستخدام Stripe */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#0570de',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: '"Inter", sans-serif',
                spacingUnit: '4px',
              },
              rules: {
                '.Input': {
                  borderColor: '#cccccc',
                  borderWidth: '1px',
                  borderRadius: '4px',
                },
                '.Input:focus': {
                  borderColor: '#0570de',
                  boxShadow: '0 0 0 1px #0570de',
                },
              },
            },
          }}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
}