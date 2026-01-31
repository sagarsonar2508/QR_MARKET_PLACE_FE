"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupService, verifyOtpService } from "@/services/auth.service";

type SignupStep = "register" | "verify-otp" | "set-password";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("register");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.email || !formData.firstName || !formData.lastName) {
        setError("All fields are required");
        return;
      }

      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (formData.firstName.length < 2) {
        setError("First name must be at least 2 characters");
        return;
      }

      if (formData.lastName.length < 2) {
        setError("Last name must be at least 2 characters");
        return;
      }

      await signupService(formData.email, formData.firstName, formData.lastName);
      setSuccessMessage("OTP sent to your email. Please verify to continue.");
      setStep("verify-otp");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!formData.otp || formData.otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      await verifyOtpService(formData.email, formData.otp);
      setSuccessMessage("Email verified! Please set your password.");
      setStep("set-password");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "OTP verification failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!formData.password || !formData.confirmPassword) {
        setError("Both password fields are required");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Import setPasswordService dynamically to avoid circular imports
      const { setPasswordService } = await import("@/services/auth.service");
      await setPasswordService({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage("Password set successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              QR Market
            </h1>
            <p className="text-gray-600">
              {step === "register" && "Create your account"}
              {step === "verify-otp" && "Verify your email"}
              {step === "set-password" && "Set your password"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Step 1: Register */}
          {step === "register" && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* First Name Field */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Last Name Field */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === "verify-otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-700 text-sm">
                  We've sent a 6-digit OTP to <strong>{formData.email}</strong>
                </p>
              </div>

              {/* OTP Field */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  placeholder="000000"
                  value={formData.otp}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-center text-2xl tracking-widest"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP */}
              <button
                type="button"
                className="w-full py-2 px-4 border border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, otp: "" }));
                  handleSignupSubmit(new Event("submit") as any);
                }}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Set Password */}
          {step === "set-password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Setting Password..." : "Complete Signup"}
              </button>
            </form>
          )}

          {/* Divider */}
          {step === "register" && (
            <>
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-gray-500 text-sm">or</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Login Link */}
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Sign in
                </Link>
              </p>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-900 font-medium mb-2">Next Steps:</p>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>✓ Create your account</li>
                  <li>✓ Verify your email with OTP</li>
                  <li>✓ Set your password</li>
                </ul>
              </div>
            </>
          )}

          {/* Back to Login for non-register steps */}
          {step !== "register" && (
            <p className="text-center text-gray-600 mt-6">
              <Link
                href="/login"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Back to login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
