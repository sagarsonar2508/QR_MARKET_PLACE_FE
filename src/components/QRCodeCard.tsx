"use client";

import React from "react";
import { QRCodeResponseData } from "@/services/qrcode.service";

interface QRCodeCardProps {
  qrCode: QRCodeResponseData;
  onEdit: (qrCode: QRCodeResponseData) => void;
  onRotateLink: (qrCode: QRCodeResponseData) => void;
  onDisable: (qrCode: QRCodeResponseData) => void;
  onDelete: (qrCode: QRCodeResponseData) => void;
  isLoading: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  qrCode,
  onEdit,
  onRotateLink,
  onDisable,
  onDelete,
  isLoading,
}) => {
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getTypeLabel(qrCode.type)}
          </h3>
          <p className="text-sm text-gray-500">Slug: {qrCode.slug}</p>
        </div>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        {/* URL */}
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

        {/* Scan Count */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Scans</p>
            <p className="text-2xl font-bold text-gray-900">{qrCode.scanCount}</p>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm text-gray-700">{formatDate(qrCode.createdAt)}</p>
          </div>
        </div>

        {/* Expiry */}
        {qrCode.expiresAt && (
          <div>
            <p className="text-xs text-gray-500">Expires</p>
            <p className="text-sm text-gray-700">{formatDate(qrCode.expiresAt)}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onRotateLink(qrCode)}
          disabled={isLoading || isExpired}
          title="Change destination URL"
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Rotate Link
        </button>
        <button
          onClick={() => onDisable(qrCode)}
          disabled={isLoading || isInactive || isExpired}
          title="Disable this QR code"
          className="flex-1 py-2 px-3 bg-yellow-50 text-yellow-600 font-semibold rounded-lg hover:bg-yellow-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Disable
        </button>
        <button
          onClick={() => onDelete(qrCode)}
          disabled={isLoading}
          title="Delete this QR code"
          className="flex-1 py-2 px-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
