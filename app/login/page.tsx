const handleSubmit = async (e: React.FormEvent) => {
    const email = ''; // Initialize email variable
    const password = ''; // Initialize password variable
    e.preventDefault();
    setError(null); // مسح أي أخطاء سابقة
    setIsLoading(true); // تعطيل الزر أثناء الإرسال
  
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      // التحقق من نوع الاستجابة
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || t('login.error'));
        return;
      }
  
      // إعادة توجيه المستخدم إلى الصفحة الرئيسية بعد تسجيل الدخول
      window.location.href = '/';
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false); // تمكين الزر مرة أخرى
    }
  };

function setError(arg0: any) {
    throw new Error("Function not implemented.");
}
function setIsLoading(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function t(arg0: string): any {
    throw new Error("Function not implemented.");
}

