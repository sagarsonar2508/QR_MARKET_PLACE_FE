import apiRequest from "@/lib/api";
import { ApiResponse } from "@/types";

export enum QRCodeType {
  GOOGLE_REVIEW = "GOOGLE_REVIEW",
  CUSTOM_URL = "CUSTOM_URL",
  PRODUCT_LINK = "PRODUCT_LINK",
}

export interface QRCodeResponseData {
  _id: string;
  userId: string;
  slug: string;
  type: QRCodeType;
  destinationUrl: string;
  isActive: boolean;
  expiresAt: Date | null;
  qrCodeImageUrl?: string;
  scanCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQRCodeData {
  type: QRCodeType;
  destinationUrl: string;
  expiresAt?: Date | string;
}

export interface UpdateQRCodeData {
  destinationUrl?: string;
  isActive?: boolean;
  expiresAt?: Date | string;
}

export interface RotateLinkData {
  destinationUrl: string;
}

// Create QR Code
export const createQRCodeService = async (data: CreateQRCodeData): Promise<QRCodeResponseData> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData>>("/qrcode", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
};

// Get all user's QR codes
export const getUserQRCodesService = async (): Promise<QRCodeResponseData[]> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData[]>>("/qrcode", {
    method: "GET",
  });

  return response.data;
};

// Get single QR code
export const getQRCodeService = async (qrCodeId: string): Promise<QRCodeResponseData> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData>>(`/qrcode/${qrCodeId}`, {
    method: "GET",
  });

  return response.data;
};

// Update QR code
export const updateQRCodeService = async (
  qrCodeId: string,
  data: UpdateQRCodeData
): Promise<QRCodeResponseData> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData>>(`/qrcode/${qrCodeId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.data;
};

// Rotate link (change destination URL)
export const rotateLinkService = async (
  qrCodeId: string,
  data: RotateLinkData
): Promise<QRCodeResponseData> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData>>(
    `/qrcode/${qrCodeId}/rotate-link`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  return response.data;
};

// Disable QR code
export const disableQRCodeService = async (qrCodeId: string): Promise<QRCodeResponseData> => {
  const response = await apiRequest<ApiResponse<QRCodeResponseData>>(
    `/qrcode/${qrCodeId}/disable`,
    {
      method: "POST",
    }
  );

  return response.data;
};

// Delete QR code
export const deleteQRCodeService = async (qrCodeId: string): Promise<{ message: string }> => {
  const response = await apiRequest<ApiResponse<{ message: string }>>(
    `/qrcode/${qrCodeId}`,
    {
      method: "DELETE",
    }
  );

  return response.data;
};
