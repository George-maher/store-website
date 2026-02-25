// Translation object for all languages
export const translations = {
  en: {
    // Navigation
    storeName: 'Degoy store',
    cart: 'Cart',
    
    // Home Page
    latestDrops: 'Latest Drops',
    homeDescription: 'Fresh styles dropped weekly — shop now and message us on WhatsApp to order.',
    filterByName: 'Filter by name...',
    sortBy: 'Sort by',
    latest: 'Latest',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    all: 'All',
    socks: 'Socks',
    caps: 'Caps',
    wallets: 'Wallets',
    accessories: 'Accessories',
    bags: 'Bags',
    uncategorized: 'Uncategorized',
    
    // Product Card
    addToCart: 'Add to Cart',
    
    // Cart Page
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty.',
    product: 'Product',
    price: 'Price',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    total: 'Total',
    clear: 'Clear',
    orderNow: 'Order Now',
    
    // Login Page
    adminLogin: 'Admin Login',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    
    // Dashboard
    adminDashboard: 'Admin Dashboard',
    manageProducts: 'Manage your products and inventory',
    totalProducts: 'Total Products',
    addNewProduct: 'Add New Product',
    uploadInventory: 'Upload and manage your product inventory',
    productInventory: 'Product Inventory',
    viewCatalog: 'View and manage your product catalog',
    allProducts: 'All Products',
    recentProducts: 'Recent Products',
    image: 'Image',
    productName: 'Product Name',
    category: 'Category',
    created: 'Created',
    actions: 'Actions',
    delete: 'Delete',
    
    // Add Product Form
    productNameRequired: 'Product Name*',
    priceRequired: 'Price*',
    description: 'Description',
    productImageRequired: 'Product Image*',
    selectCategory: 'Select category',
    uploading: 'Uploading...',
    addProduct: 'Add Product',
    
    // Additional Categories
    shoes: 'Shoes',
    apparel: 'Apparel',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  ar: {
    // Navigation
    storeName: 'منتجات ديجوي',
    cart: 'السلة',
    
    // Home Page
    latestDrops: 'أحدث المنتجات',
    homeDescription: 'تشكيلة جديدة أسبوعياً — تسوق الآن وأرسل لنا رسالة على واتساب للطلب.',
    filterByName: 'البحث بالاسم...',
    sortBy: 'ترتيب حسب',
    latest: 'الأحدث',
    priceLow: 'السعر: من الأقل للأعلى',
    priceHigh: 'السعر: من الأعلى للأقل',
    all: 'الكل',
    socks: 'الجوارب',
    caps: 'القبعات',
    wallets: 'المحافظ',
    accessories: 'إكسسوارات',
    bags: 'الحقائب',
    uncategorized: 'غير مصنف',
    
    // Product Card
    addToCart: 'أضف للسلة',
    
    // Cart Page
    yourCart: 'سلتك',
    cartEmpty: 'سلتك فارغة.',
    product: 'المنتج',
    price: 'السعر',
    quantity: 'الكمية',
    subtotal: 'المجموع الفرعي',
    total: 'الإجمالي',
    clear: 'مسح',
    orderNow: 'اطلب الآن',
    
    // Login Page
    adminLogin: 'تسجيل دخول المشرف',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'دخول',
    
    // Dashboard
    adminDashboard: 'لوحة تحكم المشرف',
    manageProducts: 'إدارة منتجاتك والمخزون',
    totalProducts: 'إجمالي المنتجات',
    addNewProduct: 'إضافة منتج جديد',
    uploadInventory: 'رفع وإدارة مخزون منتجاتك',
    productInventory: 'مخزون المنتجات',
    viewCatalog: 'عرض وإدارة كتالوج المنتجات',
    allProducts: 'كل المنتجات',
    recentProducts: 'المنتجات الحديثة',
    image: 'الصورة',
    productName: 'اسم المنتج',
    category: 'الفئة',
    created: 'تاريخ الإنشاء',
    actions: 'الإجراءات',
    delete: 'حذف',
    
    // Add Product Form
    productNameRequired: 'اسم المنتج*',
    priceRequired: 'السعر*',
    description: 'الوصف',
    productImageRequired: 'صورة المنتج*',
    selectCategory: 'اختر الفئة',
    uploading: 'جاري الرفع...',
    addProduct: 'إضافة منتج',
    
    // Additional Categories
    shoes: 'أحذية',
    apparel: 'ملابس',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح'
  }
};

// Hook for using translations
export const useTranslation = (lang) => {
  return translations[lang] || translations.en;
};
