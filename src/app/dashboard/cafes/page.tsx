"use client";

export default function CafesPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">My Cafes</h2>
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-4">You haven't added any cafes yet.</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Add New Cafe
        </button>
      </div>
    </div>
  );
}
