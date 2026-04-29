"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { checkPhone, verifyOtp } from "@/services/requests/auth";
import { useRouter } from "next/navigation";
import { trackRegistrationConversion } from "@/lib/google-ads-conversion";

export default function AuthPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sendingCode, setSendingCode] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      // Get return URL from query params or default to home
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl") || "/";
      router.push(returnUrl);
    }
  }, [status, router]);

  const formatPhone = (value: string) => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "");
    // Ensure it starts with +998
    if (cleaned.startsWith("998")) {
      return `+${cleaned}`;
    }
    if (cleaned.startsWith("0")) {
      return `+998${cleaned.slice(1)}`;
    }
    if (!cleaned.startsWith("+")) {
      return `+998${cleaned}`;
    }
    return cleaned;
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendCode = async () => {
    const formattedPhone = formatPhone(phone);

    if (!validatePhone(formattedPhone)) {
      toast.error(t("invalidPhone"));
      return;
    }

    setSendingCode(true);

    try {
      const response = await checkPhone(formattedPhone);

      if (response.errors) {
        const errorMessage = response.errors[0]?.message || t("error");
        toast.error(errorMessage);

        // Handle rate limiting - start countdown
        if (errorMessage.includes("Seconds")) {
          const match = errorMessage.match(/(\d+)\s*Seconds?/i);
          if (match) {
            const seconds = parseInt(match[1]);
            setCountdown(seconds);
            setCanResend(false);
            const interval = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 1) {
                  clearInterval(interval);
                  setCanResend(true);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }
      } else {
        toast.success(t("smsSent"));
        setPhone(formattedPhone);
        setStep("otp");
      }
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message || t("sendCodeError")
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("invalidOtp"));
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp({
        phone: phone,
        token: otpCode,
      });

      if (response.token && response.status) {
        // Use next-auth to sign in with the JWT token
        const result = await signIn("credentials", {
          phone: phone,
          token: response.token, // JWT token from verify-otp
          redirect: false,
        });

        if (result?.error) {
          toast.error(t("loginError"));
        } else {
          trackRegistrationConversion();
          toast.success(t("loginSuccess"));
          // Get return URL from query params or default to home
          const params = new URLSearchParams(window.location.search);
          const returnUrl = params.get("returnUrl") || "/";
          router.push(returnUrl);
        }
      } else {
        toast.error(t("wrongOtp"));
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message || t("verifyError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    await handleSendCode();
  };

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">{t("waiting")}</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "phone"
              ? t("phoneDescription")
              : t("otpDescription", { phone })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phoneLabel")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={sendingCode}
                  required
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendCode();
                    }
                  }}
                />
              </div>

              <Button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || !phone}
                className="w-full"
              >
                {sendingCode ? t("waiting") : t("sendCode")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">{t("otpLabel")}</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder={t("otpPlaceholder")}
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={loading}
                  required
                  autoFocus
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground">
                  {t("otpHint", { phone })}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t("verifying") : t("verify")}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep("phone");
                      setOtpCode("");
                    }}
                    disabled={loading}
                    className="text-xs"
                  >
                    {t("changePhone")}
                  </Button>

                  {canResend ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-xs"
                    >
                      {t("resendCode")}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {countdown > 0 && `${countdown}s`}
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
