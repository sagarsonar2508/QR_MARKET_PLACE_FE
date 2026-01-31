"use client";

import React, { useState, useEffect } from "react";
import { RotateLinkData } from "@/services/qrcode.service";

interface RotateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSubmit: (data: RotateLinkData) => Promise<void>;
  isLoading: boolean;
}

export const RotateLinkModal: React.FC<RotateLinkModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSubmit,
  isLoading,
}) => {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDestinationUrl(currentUrl);
      setError("");
    }
  }, [isOpen, currentUrl]);

  const validateUrl = (): boolean => {
    if (!destinationUrl.trim()) {
      setError("Destination URL is required");
      return false;
    }

    try {
      new URL(destinationUrl);
    } catch {
      setError("Please enter a valid URL");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateUrl()) return;

    try {
      await onSubmit({ destinationUrl });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to rotate link";
      setError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rotate Link</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Destination URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                ℹ️ Changing the destination URL will affect all scans going forward. The QR code pattern remains the same.
              </p>
            </div>

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
                {isLoading ? "Updating..." : "Update Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
