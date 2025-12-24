"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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

interface PhoneAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneAuthModal({ open, onOpenChange }: PhoneAuthModalProps) {
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [sendingCode, setSendingCode] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

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
      toast.error("To'g'ri telefon raqam kiriting (masalan: +998901234567)");
      return;
    }

    setSendingCode(true);

    try {
      const response = await checkPhone(formattedPhone);

      if (response.errors) {
        const errorMessage = response.errors[0]?.message || "Xatolik yuz berdi";
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
        toast.success("SMS kod yuborildi");
        setPhone(formattedPhone);
        setStep("otp");
      }
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "Kod yuborishda xatolik yuz berdi"
      );
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      toast.error("OTP kod 6 xonali bo'lishi kerak");
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
          toast.error("Kirishda xatolik yuz berdi");
        } else {
          toast.success("Muvaffaqiyatli kirildi");
          onOpenChange(false);
          resetForm();
        }
      } else {
        toast.error("Noto'g'ri OTP kod");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(
        error?.response?.data?.errors?.[0]?.message ||
          "OTP kodni tasdiqlashda xatolik yuz berdi"
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
    setPhone("");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kirish / Ro'yxatdan o'tish</DialogTitle>
          <DialogDescription>
            {step === "phone"
              ? "Telefon raqamingizga SMS kod yuboramiz"
              : `${phone} raqamiga yuborilgan kodni kiriting`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={sendingCode}
                required
                autoFocus
              />
            </div>

            <Button
              type="button"
              onClick={handleSendCode}
              disabled={sendingCode || !phone}
              className="w-full"
            >
              {sendingCode ? "Kutilmoqda..." : "Kod yuborish"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">SMS kod</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                required
                autoFocus
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                {phone} raqamiga yuborilgan 6 xonali kodni kiriting
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
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
                  Telefon raqamni o'zgartirish
                </Button>

                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-xs"
                  >
                    Kodni qayta yuborish
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
      </DialogContent>
    </Dialog>
  );
}
