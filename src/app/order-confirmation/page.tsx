"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface Order {
  _id: string;
  productId: string;
  qrCodeId: string;
  shirtColor: string;
  shirtSize: string;
  amount: number;
  quantity: number;
  paymentStatus: string;
  orderStatus: string;
  printProviderOrderId?: string;
  trackingUrl?: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !orderId) {
      setError("Missing authentication or order information");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [token, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load order");
      }

      const data = await response.json();
      setOrder(data.data);
    } catch (err) {
      setError("Failed to load order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-8">
          <div className="flex items-center gap-3">
            <div className="text-4xl text-green-600">✓</div>
            <div>
              <h2 className="text-2xl font-bold text-green-900">
                Payment Successful!
              </h2>
              <p className="text-green-800">
                Your order has been confirmed and sent to Printify for production.
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Order Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {order?._id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Status</p>
                <p className="text-lg font-semibold text-indigo-600 capitalize">
                  {order?.orderStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="text-lg font-semibold text-green-600 capitalize">
                  {order?.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {order?.quantity} unit(s)
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${order?.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {order?.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
              >
                Track Your Order →
              </a>
            )}
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Shipping Address
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order?.shippingAddress.fullName}</p>
              <p>{order?.shippingAddress.street}</p>
              <p>
                {order?.shippingAddress.city}, {order?.shippingAddress.state}{" "}
                {order?.shippingAddress.postalCode}
              </p>
              <p>{order?.shippingAddress.country}</p>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order?.shippingAddress.email}</p>
              </div>
              <div className="pt-1">
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order?.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-3">What Happens Next?</h3>
          <ol className="space-y-2 text-blue-900 list-decimal list-inside">
            <li>
              <strong>Confirmed:</strong> Your order is being prepared by Printify
            </li>
            <li>
              <strong>Production:</strong> Your shirt will be printed with your custom QR code
            </li>
            <li>
              <strong>Shipping:</strong> Once ready, you'll receive a tracking link
            </li>
            <li>
              <strong>Delivery:</strong> Your custom shirt arrives at your address
            </li>
          </ol>
          <p className="text-sm text-blue-800 mt-4">
            We've sent a confirmation email to <strong>{order?.shippingAddress.email}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center font-medium transition"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-center font-medium transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
