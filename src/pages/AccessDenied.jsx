import React from 'react';

export default function AccessDenied({ lang = 'en' }) {
  const isEn = lang === 'en';
  
  return (
    <main className={`min-h-screen flex items-center justify-center bg-gray-50 ${!isEn ? 'rtl' : ''}`}>
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-bold">{isEn ? 'Access Denied' : 'تم رفض الوصول'}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {isEn ? 'You do not have permission to view this page.' : 'ليس لديك الإذن لعرض هذه الصفحة.'}
        </p>
      </div>
    </main>
  );
}
