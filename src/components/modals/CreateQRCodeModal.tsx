"use client";

import React, { useState, useEffect } from "react";
import { QRCodeType, CreateQRCodeData } from "@/services/qrcode.service";

interface CreateQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQRCodeData) => Promise<void>;
  isLoading: boolean;
}

export const CreateQRCodeModal: React.FC<CreateQRCodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateQRCodeData>({
    type: QRCodeType.CUSTOM_URL,
    destinationUrl: "",
    expiresAt: undefined,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        type: QRCodeType.CUSTOM_URL,
        destinationUrl: "",
        expiresAt: undefined,
      });
      setError("");
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expiresAt" && value ? new Date(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.destinationUrl.trim()) {
      setError("Destination URL is required");
      return false;
    }

    try {
      new URL(formData.destinationUrl);
    } catch {
      setError("Please enter a valid URL");
      return false;
    }

    if (formData.expiresAt && new Date(formData.expiresAt) < new Date()) {
      setError("Expiry date must be in the future");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create QR code";
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create QR Code</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* QR Code Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              >
                <option value={QRCodeType.CUSTOM_URL}>Custom URL</option>
                <option value={QRCodeType.GOOGLE_REVIEW}>Google Review</option>
                <option value={QRCodeType.PRODUCT_LINK}>Product Link</option>
              </select>
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination URL
              </label>
              <input
                type="url"
                name="destinationUrl"
                placeholder="https://example.com"
                value={formData.destinationUrl}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
