"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQRCode } from "@/hooks/useQRCode";
import { QRCodeResponseData } from "@/services/qrcode.service";
import { RotateLinkModal } from "@/components/modals/RotateLinkModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

export default function QRCodeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qrCodeId = params?.id as string;

  const { getQRCode, rotateLink, disableQRCode, deleteQRCode, isLoading, error } =
    useQRCode();

  const [qrCode, setQRCode] = useState<QRCodeResponseData | null>(null);
  const [isRotateLinkModalOpen, setIsRotateLinkModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"delete" | "disable" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        if (qrCodeId) {
          const data = await getQRCode(qrCodeId);
          setQRCode(data);
        }
      } catch (err) {
        console.error("Failed to fetch QR code:", err);
      }
    };

    fetchQRCode();
  }, [qrCodeId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!qrCode && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">QR Code not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (isLoading || !qrCode) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full"></div>
      </div>
    );
  }

  const isExpired = qrCode.expiresAt && new Date(qrCode.expiresAt) < new Date();
  const isInactive = !qrCode.isActive;

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      GOOGLE_REVIEW: "Google Review",
      CUSTOM_URL: "Custom URL",
      PRODUCT_LINK: "Product Link",
    };
    return typeMap[type] || type;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRotateLinkSubmit = async (data: { destinationUrl: string }) => {
    try {
      const updated = await rotateLink(qrCode._id, data);
      setQRCode(updated);
      setSuccessMessage("Link rotated successfully!");
      setIsRotateLinkModalOpen(false);
    } catch (err) {
      console.error("Failed to rotate link:", err);
    }
  };

  const handleDisableClick = () => {
    setConfirmAction("disable");
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setConfirmAction("delete");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction === "delete") {
        await deleteQRCode(qrCode._id);
        setSuccessMessage("QR Code deleted successfully!");
        setTimeout(() => router.push("/dashboard/qrcodes"), 1500);
      } else if (confirmAction === "disable") {
        const updated = await disableQRCode(qrCode._id);
        setQRCode(updated);
        setSuccessMessage("QR Code disabled successfully!");
      }

      setIsConfirmDialogOpen(false);
      setConfirmAction(null);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 font-semibold mb-4"
          >
            ← Back to QR Codes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {getTypeLabel(qrCode.type)}
          </h1>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isExpired
              ? "bg-red-100 text-red-700"
              : isInactive
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isExpired ? "Expired" : isInactive ? "Inactive" : "Active"}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Code Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">QR Code ID</p>
                <p className="text-sm font-mono text-gray-700">{qrCode._id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Slug</p>
                <p className="text-sm font-mono text-gray-700">{qrCode.slug}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Destination URL</p>
                <a
                  href={qrCode.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:text-green-700 break-all"
                >
                  {qrCode.destinationUrl}
                </a>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm text-gray-700">{formatDate(qrCode.createdAt)}</p>
              </div>

              {qrCode.expiresAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expires</p>
                  <p
                    className={`text-sm ${
                      isExpired ? "text-red-700 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {formatDate(qrCode.expiresAt)}
                  </p>
                </div>
              )}

              {/* Copy Public URL */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Public URL</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${process.env.NEXT_PUBLIC_API_URL}/qr/${qrCode.slug}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      const url = `${process.env.NEXT_PUBLIC_API_URL}/qr/${qrCode.slug}`;
                      navigator.clipboard.writeText(url);
                      setSuccessMessage("URL copied to clipboard!");
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRotateLinkModalOpen(true)}
                disabled={isExpired || isLoading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rotate Link
              </button>
              <button
                onClick={handleDisableClick}
                disabled={isInactive || isExpired || isLoading}
                className="flex-1 py-2 px-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Disable
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-6">
          {/* Scan Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total Scans</p>
                <p className="text-4xl font-bold text-green-600">
                  {qrCode.scanCount}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ℹ️ Scan count is updated in real-time as users scan this QR code.
                </p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Status</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active:</span>
                <span
                  className={`text-sm font-semibold ${
                    qrCode.isActive ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {qrCode.isActive ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expired:</span>
                <span
                  className={`text-sm font-semibold ${
                    isExpired ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isExpired ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RotateLinkModal
        isOpen={isRotateLinkModalOpen}
        onClose={() => setIsRotateLinkModalOpen(false)}
        currentUrl={qrCode.destinationUrl}
        onSubmit={handleRotateLinkSubmit}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title={
          confirmAction === "delete"
            ? "Delete QR Code?"
            : "Disable QR Code?"
        }
        message={
          confirmAction === "delete"
            ? "This action cannot be undone. The QR code will be permanently deleted."
            : "Disabling the QR code will prevent it from working. You can enable it later."
        }
        confirmText={confirmAction === "delete" ? "Delete" : "Disable"}
        cancelText="Cancel"
        isDangerous={confirmAction === "delete"}
        isLoading={isLoading}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setIsConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
      />
    </div>
  );
}
