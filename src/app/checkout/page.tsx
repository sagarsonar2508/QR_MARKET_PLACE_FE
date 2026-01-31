"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface ShirtCustomization {
  productId: string;
  shirtColor: string;
  shirtColorName: string;
  shirtSize: string;
  shirtMockupUrl: string;
  qrCodeText: string;
  qrCodeType: "url" | "text";
  qrCodeImage: string;
  price: number;
}

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [customization, setCustomization] = useState<ShirtCustomization | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: user?.email?.split("@")[0] || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    // Check if user is logged in
    if (!token) {
      router.push("/login?returnUrl=/checkout");
      return;
    }

    // Get customization from session
    const stored = sessionStorage.getItem("shirtCustomization");
    if (!stored) {
      setError("No customization found. Please start over.");
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(stored) as ShirtCustomization;
      setCustomization(data);
    } catch (err) {
      setError("Failed to load customization");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customization) {
      setError("No customization data found");
      return;
    }

    // Validate form
    if (
      !shippingData.fullName ||
      !shippingData.email ||
      !shippingData.phone ||
      !shippingData.street ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.postalCode ||
      !shippingData.country
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // First create QR code
      const qrResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/qrcodes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: customization.qrCodeType === "url" ? "url" : "text",
            destinationUrl: customization.qrCodeText,
          }),
        }
      );

      if (!qrResponse.ok) {
        throw new Error("Failed to create QR code");
      }

      const qrData = await qrResponse.json();
      const qrCodeId = qrData.data._id;

      // Create order
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: customization.productId,
            qrCodeId,
            shirtColor: customization.shirtColor,
            shirtSize: customization.shirtSize,
            shirtMockupUrl: customization.shirtMockupUrl,
            shippingAddress: shippingData,
            quantity: 1,
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.data._id;

      // Redirect to payment
      sessionStorage.removeItem("shirtCustomization");
      router.push(`/payment?orderId=${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (!customization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Product Preview */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="relative w-full h-40">
                  <Image
                    src={customization.shirtMockupUrl}
                    alt="Shirt"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold">{customization.shirtColorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-semibold">{customization.shirtSize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">QR Code:</span>
                  <span className="font-semibold">Custom</span>
                </div>
              </div>

              {/* QR Code Preview */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  QR Code Preview:
                </p>
                <div className="bg-white p-2 rounded border border-gray-200 flex justify-center">
                  <Image
                    src={customization.qrCodeImage}
                    alt="QR Code"
                    width={80}
                    height={80}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${customization.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>TBD</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-indigo-600 pt-2 border-t">
                  <span>Total</span>
                  <span>${customization.price.toFixed(2)}*</span>
                </div>
                <p className="text-xs text-gray-500">
                  *Plus shipping and applicable taxes
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Street */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={shippingData.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
