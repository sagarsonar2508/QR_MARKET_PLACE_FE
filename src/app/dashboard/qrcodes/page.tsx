"use client";

import React, { useState, useEffect } from "react";
import { useQRCode } from "@/hooks/useQRCode";
import { QRCodeCard } from "@/components/QRCodeCard";
import { CreateQRCodeModal } from "@/components/modals/CreateQRCodeModal";
import { RotateLinkModal } from "@/components/modals/RotateLinkModal";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { CreateQRCodeData, QRCodeResponseData } from "@/services/qrcode.service";

export default function QRCodesPage() {
  const {
    qrCodes,
    isLoading,
    error,
    fetchQRCodes,
    createQRCode,
    rotateLink,
    disableQRCode,
    deleteQRCode,
    clearError,
  } = useQRCode();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRotateLinkModalOpen, setIsRotateLinkModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeResponseData | null>(null);
  const [confirmAction, setConfirmAction] = useState<"delete" | "disable" | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch QR codes on mount
  useEffect(() => {
    fetchQRCodes();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreateQRCode = async (data: CreateQRCodeData) => {
    try {
      await createQRCode(data);
      setSuccessMessage("QR Code created successfully!");
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Failed to create QR code:", err);
    }
  };

  const handleRotateLink = (qrCode: QRCodeResponseData) => {
    setSelectedQRCode(qrCode);
    setIsRotateLinkModalOpen(true);
  };

  const handleRotateLinkSubmit = async (data: { destinationUrl: string }) => {
    if (!selectedQRCode) return;

    try {
      await rotateLink(selectedQRCode._id, data);
      setSuccessMessage("Link rotated successfully!");
      setIsRotateLinkModalOpen(false);
      setSelectedQRCode(null);
    } catch (err) {
      console.error("Failed to rotate link:", err);
    }
  };

  const handleDisableClick = (qrCode: QRCodeResponseData) => {
    setSelectedQRCode(qrCode);
    setConfirmAction("disable");
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteClick = (qrCode: QRCodeResponseData) => {
    setSelectedQRCode(qrCode);
    setConfirmAction("delete");
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedQRCode || !confirmAction) return;

    try {
      if (confirmAction === "delete") {
        await deleteQRCode(selectedQRCode._id);
        setSuccessMessage("QR Code deleted successfully!");
      } else if (confirmAction === "disable") {
        await disableQRCode(selectedQRCode._id);
        setSuccessMessage("QR Code disabled successfully!");
      }

      setIsConfirmDialogOpen(false);
      setSelectedQRCode(null);
      setConfirmAction(null);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmDialogOpen(false);
    setSelectedQRCode(null);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">QR Codes</h2>
          <p className="text-gray-600 mt-1">
            {qrCodes.length} QR code{qrCodes.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          + Create QR Code
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Empty State */}
      {qrCodes.length === 0 && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16m10-16v16M7 4h10a2 2 0 012 2v0a2 2 0 01-2 2H7m0 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2m-5 4v2m0 0v2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No QR Codes Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first QR code to get started. You can create multiple QR codes
            for different purposes.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Create Your First QR Code
          </button>
        </div>
      )}

      {/* QR Codes Grid */}
      {qrCodes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qrCode) => (
            <QRCodeCard
              key={qrCode._id}
              qrCode={qrCode}
              onEdit={() => {}} // Edit functionality can be expanded
              onRotateLink={handleRotateLink}
              onDisable={handleDisableClick}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && qrCodes.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full"></div>
          <p className="text-gray-600 mt-4">Loading QR codes...</p>
        </div>
      )}

      {/* Modals */}
      <CreateQRCodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQRCode}
        isLoading={isLoading}
      />

      {selectedQRCode && (
        <RotateLinkModal
          isOpen={isRotateLinkModalOpen}
          onClose={() => {
            setIsRotateLinkModalOpen(false);
            setSelectedQRCode(null);
          }}
          currentUrl={selectedQRCode.destinationUrl}
          onSubmit={handleRotateLinkSubmit}
          isLoading={isLoading}
        />
      )}

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
        onCancel={handleCancelConfirm}
      />
    </div>
  );
}
