"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ShirtDesign {
  colorCode: string;
  colorName: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  mockupImageUrl: string;
  quantity?: number;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  thumbnailUrl?: string;
  shirtDesigns: ShirtDesign[];
  productType: "shirt" | "other";
}

export default function Home() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/products`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSelectShirt = (productId: string) => {
    // Redirect to shirt customization page with product ID
    router.push(`/shop/customize?productId=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-indigo-600">QR Market</h1>
              <span className="text-sm text-gray-500">Shirt + QR Code Store</span>
            </div>
            <div className="flex items-center gap-4">
              {token ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Shirts with QR Codes
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Design your perfect shirt with personalized QR codes
          </p>
          <p className="text-gray-500">
            Choose a shirt design, create your QR code, and place your order!
          </p>
        </div>

        {/* Shirt Gallery */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading designs...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No shirt designs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gray-200">
                  {product.thumbnailUrl ? (
                    <Image
                      src={product.thumbnailUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No image available</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description}
                    </p>
                  )}

                  {/* Colors Available */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Available Colors:
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.shirtDesigns?.slice(0, 3).map((design, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1"
                          title={design.colorName}
                        >
                          <div
                            className="w-6 h-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: design.colorCode }}
                          />
                          <span className="text-xs text-gray-600">
                            {design.colorName}
                          </span>
                        </div>
                      ))}
                      {product.shirtDesigns?.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{product.shirtDesigns.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-indigo-600">
                      ${product.basePrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">+ QR code customization</p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectShirt(product._id)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Customize & Design QR →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {!token && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600">1.</span>
                  <span>Select a shirt design and color</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600">2.</span>
                  <span>Create your custom QR code</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600">3.</span>
                  <span>Preview your design</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600">4.</span>
                  <span>Sign up to checkout</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600">5.</span>
                  <span>Complete payment & delivery</span>
                </li>
              </ol>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Sign up now to create your first custom QR code shirt! Design
                freely without an account, but you'll need to sign in to complete
                your purchase.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/signup"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-center"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="flex-1 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium text-center"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
