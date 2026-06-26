"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { checkPhone, verifyOtp } from "@/services/requests/auth";
import { syncGuestWishlistToBackend } from "@/services/requests/wishlist";
import { useTranslations } from "next-intl";
import amplitude from "@/amplitude";
import { trackRegistrationConversion } from "@/lib/google-ads-conversion";
import { useGuestId } from "@/services/guest-id";
import { useQueryClient } from "@tanstack/react-query";

interface PhoneAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PhoneAuthModal({
  open,
  onOpenChange,
  onSuccess,
}: PhoneAuthModalProps) {
  const t = useTranslations();
  const { guestId } = useGuestId();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("+998");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sendingCode, setSendingCode] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { update } = useSession();

  // Countdown effect to handle resend timeout
  useEffect(() => {
    if (countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [countdown]);

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

  const formatPhoneDisplay = (value: string): string => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "");

    // If empty, return empty
    if (!cleaned) return "";

    // Ensure it starts with +998
    let phone = cleaned;
    if (phone.startsWith("998")) {
      phone = `+${phone}`;
    } else if (phone.startsWith("0")) {
      phone = `+998${phone.slice(1)}`;
    } else if (!phone.startsWith("+")) {
      phone = `+998${phone}`;
    }

    // Extract digits after +998
    const digits = phone.replace(/^\+998/, "");

    // Format: +998 XX XXX-XX-XX
    if (digits.length === 0) return "+998";
    if (digits.length <= 2) return `+998 ${digits}`;
    if (digits.length <= 5)
      return `+998 ${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 7)
      return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Store the raw phone value (cleaned) for validation
    const cleaned = formatPhone(inputValue);
    // Ensure +998 is always present
    if (!cleaned.startsWith("+998")) {
      setPhone("+998");
    } else {
      setPhone(cleaned);
    }
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^\+998\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendCode = async () => {
    const formattedPhone = formatPhone(phone);

    if (!validatePhone(formattedPhone)) {
      toast.error(t("auth.invalidPhone"));
      return;
    }

    setSendingCode(true);

    try {
      const response = await checkPhone(formattedPhone);

      if (response.errors) {
        const errorMessage = response.errors[0]?.message || t("auth.error");
        toast.error(errorMessage);

        // Handle rate limiting - start countdown
        if (errorMessage.includes("Seconds")) {
          const match = errorMessage.match(/(\d+)\s*Seconds?/i);
          if (match) {
            const seconds = parseInt(match[1]);
            setCanResend(false);
            setCountdown(seconds);
          }
        }
      } else {
        toast.success(t("auth.smsSent"));
        setPhone(formattedPhone);
        setStep("otp");
        // Set 60 second countdown before allowing resend
        setCanResend(false);
        setCountdown(60);
      }
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message || t("auth.sendCodeError"),
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("auth.invalidOtp"));
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp({
        phone: phone,
        token: otpCode,
        guest_id: guestId, // backend merges the guest cart into this user
      });

      if (response.token && response.status) {
        // Use next-auth to sign in with the JWT token
        const result = await signIn("credentials", {
          phone: phone,
          token: response.token, // JWT token from verify-otp
          redirect: false,
        });

        if (result?.error) {
          toast.error(t("auth.loginError"));
        } else {
          trackRegistrationConversion();
          // Push the guest wishlist (localStorage) to the user's account
          await syncGuestWishlistToBackend();
          // Backend merged the guest cart into the user — refetch cart/wishlist
          queryClient.invalidateQueries({ queryKey: ["/v1/cart"] });
          queryClient.invalidateQueries({
            queryKey: ["/v1/customer/wish-list"],
          });
          toast.success(t("auth.loginSuccess"));
          await update();
          onSuccess && onSuccess();
          onOpenChange(false);
          resetForm();
        }
      } else {
        toast.error(t("auth.wrongOtp"));
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message || t("auth.verifyError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    await handleSendCode();
  };

  const resetForm = () => {
    setPhone("+998");
    setOtpCode("");
    setStep("phone");
    setCanResend(true);
    setCountdown(0);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[80%] rounded-4xl">
        <DialogHeader>
          <DialogTitle>{t("auth.title")}</DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? t("auth.phoneDescription")
              : t("auth.otpDescription", { phone: formatPhoneDisplay(phone) })}
          </DialogDescription>
        </DialogHeader>
        {step === "phone" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.phoneLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t("auth.phonePlaceholder")}
                value={formatPhoneDisplay(phone)}
                onChange={handlePhoneChange}
                disabled={sendingCode}
                required
                autoFocus
                className="text-lg"
              />
            </div>

            <Button
              type="button"
              onClick={handleSendCode}
              disabled={
                sendingCode || phone === "+998" || !validatePhone(phone)
              }
              className="w-full"
            >
              {sendingCode ? t("auth.waiting") : t("auth.sendCode")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">{t("auth.otpLabel")}</Label>
              <Input
                id="otp"
                type="text"
                placeholder={t("auth.otpPlaceholder")}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                required
                autoFocus
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                {t("auth.otpHint", { phone: formatPhoneDisplay(phone) })}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("auth.verifying") : t("auth.verify")}
              </Button>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpCode("");
                  }}
                  disabled={loading}
                  className="text-xs w-full"
                >
                  {t("auth.changePhone")}
                </button>

                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={loading || !canResend}
                    className="text-xs"
                  >
                    {t("auth.resendCode")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled
                    className="text-xs text-muted-foreground"
                  >
                    {t("auth.resendCode")} ({countdown}s)
                  </Button>
                )}
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
