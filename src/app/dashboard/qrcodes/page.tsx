"use client";

export default function QRCodesPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">QR Codes</h2>
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-4">You haven't created any QR codes yet.</p>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Create QR Code
        </button>
      </div>
    </div>
  );
}
