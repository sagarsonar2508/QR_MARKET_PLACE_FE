"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-indigo-600 text-white shadow-lg">
          <div className="p-6">
            <h2 className="text-2xl font-bold">QR Market</h2>
          </div>
          <nav className="space-y-2 px-4">
            <Link
              href="/dashboard/cafes"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              My Cafes
            </Link>
            <Link
              href="/dashboard/qrcodes"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              QR Codes
            </Link>
            <Link
              href="/dashboard/orders"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Orders
            </Link>
            <Link
              href="/dashboard/analytics"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/profile"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Link
                href="/"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Home
              </Link>
            </div>
          </header>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
