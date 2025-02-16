export default function SuccessPage() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-500 mb-4">تهانينا!</h1>
          <p className="text-gray-700 text-lg">تمت عملية الدفع بنجاح.</p>
          <p className="text-gray-600 mt-2">شكرًا لتسوقك معنا.</p>
          <a href="/" className="inline-block mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
            العودة إلى الصفحة الرئيسية
          </a>
        </div>
      </div>
    );
  }