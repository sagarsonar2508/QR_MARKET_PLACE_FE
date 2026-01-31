"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import apiRequest from "@/lib/api";

interface QRRedirectResponse {
  destinationUrl: string;
}

export default function QRRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        if (!slug) {
          router.push("/");
          return;
        }

        // Call backend to get QR code and record analytics
        const response = await apiRequest<any>(
          `/qrcode/${slug}/scan`,
          {
            method: "GET",
          }
        );

        // The backend will redirect, but if it returns data, use it
        if (response?.data?.destinationUrl) {
          window.location.href = response.data.destinationUrl;
        }
      } catch (error) {
        console.error("Failed to redirect from QR code:", error);
        // Fallback - still try to redirect or go home
        router.push("/");
      }
    };

    handleRedirect();
  }, [slug, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full"></div>
        <p className="text-gray-600 mt-4">Redirecting you...</p>
      </div>
    </div>
  );
}
