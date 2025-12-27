"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Calendar,
  LogOut,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { instanceAuth } from "@/services/api";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
    firstName: session?.user?.first_name || "",
    lastName: session?.user?.last_name || "",
    birthDate: session?.user?.birth_date || "",
    phone: session?.user?.phone || "",
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const { data } = await instanceAuth.post("/v1/customer/account-delete", {
        password,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Hisobingiz muvaffaqiyatli o'chirildi");
      setIsDeleteDialogOpen(false);
      setDeletePassword("");
      signOut({ callbackUrl: "/" });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        "Hisobni o'chirishda xatolik yuz berdi";
      toast.error(errorMessage);
    },
  });

  const handleSave = () => {
    // Bu yerda API ga so'rov yuboriladi
    toast.success("Ma'lumotlaringiz muvaffaqiyatli yangilandi");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success("Siz tizimdan muvaffaqiyatli chiqdingiz");
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error("Parolni kiriting");
      return;
    }
    deleteAccountMutation.mutate(deletePassword);
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Shaxsiy ma'lumotlar
          </CardTitle>
          <CardDescription>
            Ismingiz, familiyangiz va boshqa ma'lumotlarni tahrirlang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Ism
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
                className="transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Familiya
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
                className="transition-all"
              />
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Tug'ilgan sana
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                disabled={!isEditing}
                className="transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Telefon raqami
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="sm:min-w-[160px]"
              >
                <User className="mr-2 h-4 w-4" />
                Tahrirlash
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleSave} className="min-w-[120px]">
                  <Save className="mr-2 h-4 w-4" />
                  Saqlash
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="min-w-[120px]"
                >
                  Bekor qilish
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleLogout}
              className="min-w-[160px]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Tizimdan chiqish
            </Button>
          </div>

          <Separator />

          {/* Delete Account Section */}
          <div className="pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive">
                Xavfli sozlamalar
              </h3>
              <p className="text-sm text-muted-foreground">
                Hisobingizni o'chirish orqali barcha ma'lumotlaringiz butunlay
                yo'qoladi. Bu amalni qaytarib bo'lmaydi.
              </p>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="mt-4"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hisobni o'chirish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Hisobni o'chirishni tasdiqlash
            </DialogTitle>
            <DialogDescription>
              Hisobingizni o'chirish uchun parolingizni kiriting. Bu amalni
              qaytarib bo'lmaydi va barcha ma'lumotlaringiz yo'qoladi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deletePassword">Parol</Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder="Parolingizni kiriting"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleDeleteAccount();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletePassword("");
              }}
              disabled={deleteAccountMutation.isPending}
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending || !deletePassword}
            >
              {deleteAccountMutation.isPending
                ? "O'chirilmoqda..."
                : "Hisobni o'chirish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
