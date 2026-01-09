"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("settings");
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
      toast.success(t("deleteAccountSuccess"));
      setIsDeleteDialogOpen(false);
      setDeletePassword("");
      signOut({ callbackUrl: "/" });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.response?.data?.message ||
        t("deleteAccountError");
      toast.error(errorMessage);
    },
  });

  const handleSave = () => {
    // Bu yerda API ga so'rov yuboriladi
    toast.success(t("updateSuccess"));
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    toast.success(t("logoutSuccess"));
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
      toast.error(t("enterPassword"));
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
            {t("personalInfo")}
          </CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t("firstName")}
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
                {t("lastName")}
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
                {t("birthDate")}
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
                {t("phone")}
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
                {t("edit")}
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleSave} className="min-w-[120px]">
                  <Save className="mr-2 h-4 w-4" />
                  {t("save")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="min-w-[120px]"
                >
                  {t("cancel")}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleLogout}
              className="min-w-[160px]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </div>

          <Separator />

          {/* Delete Account Section */}
          <div className="pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive">
                {t("dangerZone")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("dangerZoneDescription")}
              </p>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="mt-4"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("deleteAccount")}
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
              {t("deleteAccountConfirm")}
            </DialogTitle>
            <DialogDescription>
              {t("deleteAccountDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deletePassword">{t("password")}</Label>
              <Input
                id="deletePassword"
                type="password"
                placeholder={t("passwordPlaceholder")}
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
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending || !deletePassword}
            >
              {deleteAccountMutation.isPending
                ? t("deleting")
                : t("deleteAccountButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
