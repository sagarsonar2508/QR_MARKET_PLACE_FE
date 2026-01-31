import { useState, useCallback } from "react";
import {
  createQRCodeService,
  getUserQRCodesService,
  getQRCodeService,
  updateQRCodeService,
  rotateLinkService,
  disableQRCodeService,
  deleteQRCodeService,
  QRCodeResponseData,
  CreateQRCodeData,
  UpdateQRCodeData,
  RotateLinkData,
} from "@/services/qrcode.service";

interface UseQRCodeReturn {
  qrCodes: QRCodeResponseData[];
  isLoading: boolean;
  error: string | null;
  fetchQRCodes: () => Promise<void>;
  createQRCode: (data: CreateQRCodeData) => Promise<QRCodeResponseData>;
  getQRCode: (id: string) => Promise<QRCodeResponseData>;
  updateQRCode: (id: string, data: UpdateQRCodeData) => Promise<QRCodeResponseData>;
  rotateLink: (id: string, data: RotateLinkData) => Promise<QRCodeResponseData>;
  disableQRCode: (id: string) => Promise<QRCodeResponseData>;
  deleteQRCode: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useQRCode = (): UseQRCodeReturn => {
  const [qrCodes, setQRCodes] = useState<QRCodeResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchQRCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserQRCodesService();
      setQRCodes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch QR codes";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createQRCode = useCallback(
    async (data: CreateQRCodeData): Promise<QRCodeResponseData> => {
      setIsLoading(true);
      setError(null);
      try {
        const newQRCode = await createQRCodeService(data);
        setQRCodes((prev) => [...prev, newQRCode]);
        return newQRCode;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create QR code";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getQRCode = useCallback(async (id: string): Promise<QRCodeResponseData> => {
    setError(null);
    try {
      return await getQRCodeService(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch QR code";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateQRCode = useCallback(
    async (id: string, data: UpdateQRCodeData): Promise<QRCodeResponseData> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedQRCode = await updateQRCodeService(id, data);
        setQRCodes((prev) =>
          prev.map((qr) => (qr._id === id ? updatedQRCode : qr))
        );
        return updatedQRCode;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update QR code";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const rotateLink = useCallback(
    async (id: string, data: RotateLinkData): Promise<QRCodeResponseData> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedQRCode = await rotateLinkService(id, data);
        setQRCodes((prev) =>
          prev.map((qr) => (qr._id === id ? updatedQRCode : qr))
        );
        return updatedQRCode;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to rotate link";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const disableQRCode = useCallback(
    async (id: string): Promise<QRCodeResponseData> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedQRCode = await disableQRCodeService(id);
        setQRCodes((prev) =>
          prev.map((qr) => (qr._id === id ? updatedQRCode : qr))
        );
        return updatedQRCode;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to disable QR code";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteQRCode = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        await deleteQRCodeService(id);
        setQRCodes((prev) => prev.filter((qr) => qr._id !== id));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete QR code";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    qrCodes,
    isLoading,
    error,
    fetchQRCodes,
    createQRCode,
    getQRCode,
    updateQRCode,
    rotateLink,
    disableQRCode,
    deleteQRCode,
    clearError,
  };
};
