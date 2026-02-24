import React from 'react';

export default function AccessDenied() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="mt-2 text-sm text-gray-600">You do not have permission to view this page.</p>
      </div>
    </main>
  );
}
