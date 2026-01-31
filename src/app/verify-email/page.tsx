"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import { Button } from "@/components/Button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token provided");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/user/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token]);

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          {status === "verifying" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="text-4xl">✓</div>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={handleBackToLogin} className="w-full">
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4 flex justify-center">
                <div className="text-4xl">✗</div>
              </div>
              <h1 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={handleBackToLogin} className="w-full">
                Go to Login
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
