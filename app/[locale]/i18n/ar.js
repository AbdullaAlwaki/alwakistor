import { verify } from "crypto";
import { Languages } from "lucide-react";

export default {
  home: {
    welcome: "مرحبًا بك في Alwaki Store",
    description: "تسوق أفضل المنتجات بأفضل الأسعار.",
    price: "السعر",
    noProducts: "لا توجد منتجات متاحة.",
    featuredProducts: "المنتجات المميزة",
    hero: {
      title: "تسوق الآن",
      description: "احصل على أفضل العروض اليوم!",
      subtitle : "تسوق الآن",
      buttonText: "تسوق الآن",
    },
    meta: {
      title: "Alwaki Store - تسوق أفضل المنتجات",
      description: "تسوق أفضل المنتجات بأفضل الأسعار.",
      subtitle: "تسوق أفضل المنتجات بأفضل الأسعار.",
      buttonText: "تسوق الآن",
    },
  },
  cart: {
    title: "عربة التسوق",
    description: "إدارة مشترياتك بسهولة",
    emptyCart: "لا توجد عناصر في السلة.",
    startShopping: "ابدأ التسوق الآن",
    totalPrice: "إجمالي السعر:",
    checkout: "إتمام الشراء",
    quantity: "الكمية",
    remove: "إزالة",
  },
  checkout: {
    title: "إكمال الطلب",
    successMessage: "تم تأكيد الطلب بنجاح!",
    errorMessage: "حدث خطأ أثناء إكمال الطلب.",
    shippingDetails: "بيانات الشحن",
    fullName: "الاسم الكامل",
    address: "العنوان",
    email: "البريد الإلكتروني",
    confirming: "جارٍ التأكيد...",
    confirmOrder: "تأكيد الطلب",
  },
  failure: {
    title: "حدث خطأ!",
    description:
      "عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.",
    goBack: "العودة إلى الصفحة الرئيسية",
  },
  payment: {
    title: "تمت عملية الدفع بنجاح!",
    description: "شكرًا لك على الشراء. سيتم تسليم طلبك قريبًا.",
    goBack: "العودة إلى الصفحة الرئيسية",
  },
  navbar: {
    home: "الرئيسية",
    cart: "السلة",
    profile: "الصفحة الشخصية", // إضافة هذه الترجمة
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع المظلم",
    signIn: "تسجيل الدخول",
    searchPlaceholder: "ابحث عن منتج...",
    products: "المنتجات",
    noResults : "لا توجد نتائج متطابقة",
    settings: "الإعدادات",
  },
  profile: {
    title: "البروفايل",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    themeSettings: "إعدادات الثيم",
    currentMode: "الوضع الحالي",
    lightMode: "فاتح",
    darkMode: "داكن",
  },
  success: {
    title: "تمت العملية بنجاح!",
    description: "شكرًا لك على الشراء. سيتم تسليم طلبك قريبًا.",
    goBack: "العودة إلى الصفحة الرئيسية",
  },
  login: {
    title: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    submit: "تسجيل الدخول",
    forgotPassword: "نسيت كلمة المرور؟",
    loading: "جارٍ التحميل...",
    error: "حدث خطأ أثناء تسجيل الدخول",
    signUp : "إنشاء حساب جديد",
    success: "تم تسجيل الدخول بنجاح!",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  },
  signup: {
    title: "إنشاء حساب",
    name: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    submit: "إنشاء الحساب",
    loading: "جارٍ التحميل...",
    success: "تم إنشاء الحساب بنجاح!",
    error: "حدث خطأ أثناء إنشاء الحساب.",
    loginLink: "هل لديك حساب؟ تسجيل الدخول",
    invalidEmail: "البريد الإلكتروني غير صالح.",
    shortPassword: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.",
  },
  dashboard: {
    title: "لوحة تحكم المسؤول",
    manageProducts: "إدارة المنتجات",
    manageOrders: "إدارة الطلبات",
    goBack: "العودة إلى الصفحة الرئيسية",
  },
  forgotPassword: {
    title: "استعادة كلمة المرور",
    email: "البريد الإلكتروني",
    submit: "إرسال رابط الاستعادة",
    success: "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني",
    error: "حدث خطأ أثناء إرسال الرابط",
    loginLink: "هل تتذكر كلمة المرور؟ تسجيل الدخول",
  },
  dashboard: {
    title: "لوحة تحكم المسؤول",
    manageProducts: "إدارة المنتجات",
    manageOrders: "إدارة الطلبات",
    goBack: "العودة إلى الصفحة الرئيسية",
  },
  products: {
    title: 'المنتجات',
    noDescription: 'لا يوجد وصف لهذا المنتج.',
    error: 'حدث خطأ أثناء جلب المنتجات.',
    noProductsAvailable: 'لا توجد منتجات متاحة.',
    addToCart: 'إضافة إلى السلة',
    price: 'السعر',
    goBack: 'العودة إلى البحث',
  },
  orders: {
    title: "إدارة الطلبات",
    description: "هنا يمكنك مراجعة الطلبات وإدارتها.",
  },
  settings: {
    title: "الإعدادات المتقدمة",
    language: "إعدادات اللغة",
    english: "الإنجليزية",
    arabic: "العربية",
    darkMode: "إعدادات السمة",
    dark: "الوضع المظلم",
    light: "الوضع الفاتح",
    account: "إدارة الحساب",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    logoutConfirmation: "هل أنت متأكد من رغبتك في تسجيل الخروج؟",
    notifications: "إعدادات الإشعارات",
    emailNotifications: "إشعارات البريد الإلكتروني",
    pushNotifications: "إشعارات التطبيق",
    accountStatus: "حالة الحساب:",
    verified: "موثق",
    verify: "توثيق الحساب",
    loggingOut: "جاري تسجيل الخروج...",
    changing: "جاري تطبيق التغييرات...",
    adminSettings: "إعدادات المشرف",
    adminPanel: "فتح لوحة التحكم"
  },
  admin: {
    products: {
      title: 'إدارة المنتجات',
      description: 'يمكنك إضافة أو تعديل أو حذف المنتجات من هنا.',
      addProduct: 'إضافة منتج جديد',
      list: 'قائمة المنتجات',
      editProduct: 'تعديل المنتج',
      confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
      futureProducts: 'المنتجات القادمة',
      currentProducts: 'المنتجات الحالية',
      noProducts: 'لا توجد منتجات.',
      delete : 'حذف',
      edit : 'تعديل',
      form: {
        name: 'اسم المنتج',
        description: 'وصف المنتج',
        price: 'سعر المنتج',
        imageUrl: 'رابط الصورة',
        submit: 'إضافة المنتج',
        update: 'تحديث المنتج',
        cancel: 'إلغاء',
      },
      table: {
        name: 'الاسم',
        description: 'الوصف',
        price: 'السعر',
        image: 'الصورة',
        actions: 'الإجراءات',
      },
      actions: {
        edit: 'تعديل',
        delete: 'حذف',
      },
    },

  futureProducts: {
    title: "إدارة المنتجات المستقبلية",
    description: "يمكنك هنا إدارة جميع المنتجات المستقبلية.",
    addProduct: "إضافة منتج مستقبلي جديد",
    noProducts: "لا توجد منتجات مستقبلية متاحة.",
    table: {
      name: "الاسم",
      description: "الوصف",
      price: "السعر",
      releaseDate: "تاريخ الإصدار",
      actions: "الإجراءات"
    },
    edit: "تعديل",
    delete: "حذف"
  },
},
  verify: {
    title: "تحقق من البريد الإلكتروني",
    success: "تم التحقق من البريد الإلكتروني بنجاح!",
    error: "حدث خطأ أثناء التحقق من البريد الإلكتروني.",
    invalidLink: "رابط التحقق غير صالح.",
  },
};
