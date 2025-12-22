"use client";

import { useState } from "react";
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
import { User, Phone, Calendar, LogOut, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Muhiddin",
    lastName: "Kabraliev",
    birthDate: "1995-03-15",
    phone: "+998905650213",
  });

  const handleSave = () => {
    // Bu yerda API ga so'rov yuboriladi
    toast.success("Ma'lumotlaringiz muvaffaqiyatli yangilandi");
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Bu yerda logout logikasi bo'ladi
    toast.success("Siz tizimdan muvaffaqiyatli chiqdingiz");
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
        </CardContent>
      </Card>
    </div>
  );
}
