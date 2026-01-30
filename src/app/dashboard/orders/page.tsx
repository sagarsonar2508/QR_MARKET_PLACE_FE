"use client";

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Orders</h2>
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-4">You don't have any orders yet.</p>
        <p className="text-sm text-gray-500">Orders will appear here once customers scan your QR codes.</p>
      </div>
    </div>
  );
}
