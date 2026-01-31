"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import QRCode from "qrcode";

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

export default function CustomizeShirtPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  const productId = searchParams.get("productId");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Customization state
  const [selectedColor, setSelectedColor] = useState<ShirtDesign | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qrCodeText, setQrCodeText] = useState<string>("");
  const [qrCodeType, setQrCodeType] = useState<"url" | "text">("text");
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");

  // Fetch product details
  useEffect(() => {
    if (!productId) {
      setError("No product selected");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/products/${productId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
          // Set default selection
          if (data.data.shirtDesigns?.length > 0) {
            setSelectedColor(data.data.shirtDesigns[0]);
            setSelectedSize("M");
          }
        } else {
          setError("Failed to load product");
        }
      } catch (err) {
        setError("Error loading product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Generate QR code
  const generateQRCode = useCallback(async () => {
    if (!qrCodeText.trim()) {
      setError("Please enter text or URL for QR code");
      return;
    }

    try {
      const qrImage = await QRCode.toDataURL(qrCodeText, {
        errorCorrectionLevel: "H",
        type: "image/png",
        quality: 0.95,
        margin: 1,
        width: 300,
      });
      setQrCodeImage(qrImage);
      setError("");

      // Update preview
      if (selectedColor?.mockupImageUrl) {
        // In a real app, you'd overlay the QR code on the shirt image
        setPreviewImage(selectedColor.mockupImageUrl);
      }
    } catch (err) {
      setError("Failed to generate QR code");
      console.error(err);
    }
  }, [qrCodeText, selectedColor?.mockupImageUrl]);

  const handleProceedToCheckout = () => {
    if (!selectedColor || !selectedSize || !qrCodeText || !qrCodeImage) {
      setError("Please complete all customizations before checkout");
      return;
    }

    // Save customization to session/state and redirect to checkout
    sessionStorage.setItem(
      "shirtCustomization",
      JSON.stringify({
        productId,
        shirtColor: selectedColor.colorCode,
        shirtColorName: selectedColor.colorName,
        shirtSize: selectedSize,
        shirtMockupUrl: selectedColor.mockupImageUrl,
        qrCodeText,
        qrCodeType,
        qrCodeImage,
        price: product?.basePrice,
      })
    );

    // If not logged in, redirect to login with return URL
    if (!token) {
      router.push(`/login?returnUrl=/checkout`);
    } else {
      router.push("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
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
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Shop
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Customize Your {product?.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>

              {/* Shirt Preview */}
              <div className="bg-gray-100 rounded-lg p-6 mb-6 min-h-96 flex flex-col items-center justify-center relative">
                {selectedColor?.mockupImageUrl ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={selectedColor.mockupImageUrl}
                      alt={selectedColor.colorName}
                      fill
                      className="object-contain"
                    />
                    {/* Overlay QR Code on shirt */}
                    {qrCodeImage && (
                      <div className="absolute bottom-12 right-4">
                        <Image
                          src={qrCodeImage}
                          alt="QR Code"
                          width={100}
                          height={100}
                          className="border-2 border-white shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No preview available</p>
                )}
              </div>

              {/* Shirt Details */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {product?.name}
                </p>
                <p className="text-gray-600 mb-2">
                  Color: <span className="font-semibold">{selectedColor?.colorName}</span>
                </p>
                <p className="text-gray-600 mb-3">
                  Size: <span className="font-semibold">{selectedSize}</span>
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${product?.basePrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Customization Options */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Color Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Color
              </h3>
              <div className="space-y-3">
                {product?.shirtDesigns?.map((design) => (
                  <button
                    key={`${design.colorCode}-${design.size}`}
                    onClick={() => setSelectedColor(design)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                      selectedColor?.colorCode === design.colorCode &&
                      selectedColor?.size === design.size
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-400"
                      style={{ backgroundColor: design.colorCode }}
                    />
                    <span className="text-gray-700">{design.colorName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Size
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded-lg border-2 font-semibold transition ${
                      selectedSize === size
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code Type */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                QR Code Type
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="qrType"
                    value="text"
                    checked={qrCodeType === "text"}
                    onChange={() => setQrCodeType("text")}
                  />
                  <span className="text-gray-700">Text</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="qrType"
                    value="url"
                    checked={qrCodeType === "url"}
                    onChange={() => setQrCodeType("url")}
                  />
                  <span className="text-gray-700">URL/Link</span>
                </label>
              </div>
            </div>

            {/* QR Code Input */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {qrCodeType === "url" ? "Enter URL" : "Enter Text"}
              </h3>
              <textarea
                value={qrCodeText}
                onChange={(e) => setQrCodeText(e.target.value)}
                placeholder={
                  qrCodeType === "url"
                    ? "https://example.com"
                    : "Enter your text here"
                }
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
                rows={4}
              />
              <button
                onClick={generateQRCode}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                Generate QR Code
              </button>
            </div>

            {/* Generated QR Code Preview */}
            {qrCodeImage && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Generated QR Code
                </h3>
                <div className="flex justify-center">
                  <Image
                    src={qrCodeImage}
                    alt="Generated QR Code"
                    width={150}
                    height={150}
                    className="border-2 border-gray-200 rounded"
                  />
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
