"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib";

// Mock data - bu yerda API dan ma'lumot keladi
const orders = [
  {
    id: "72910741",
    date: "2025-09-16",
    status: "delivered",
    isPaid: true,
    items: [
      {
        name: "VOSTRO",
        quantity: 1,
        price: 3799000,
        image:
          "https://media.moddb.com/images/downloads/1/297/296999/no-photo-or-blank-image-icon-loa.jpg",
      },
    ],
    total: 3799000,
    deliveryAddress: "Toshkent, O'zbekiston, Toshkent, Yangishahar ko'chasi",
    recipient: "Kabraliev Muhiddin",
    phone: "+998 90 5650213",
  },
  {
    id: "66736862",
    date: "2025-07-27",
    status: "returned",
    isPaid: false,
    items: [
      {
        name: "Wireless Headphones",
        quantity: 2,
        price: 450000,
        image:
          "https://media.moddb.com/images/downloads/1/297/296999/no-photo-or-blank-image-icon-loa.jpg",
      },
    ],
    total: 900000,
    deliveryAddress: "Samarqand, O'zbekiston",
    recipient: "Aliyev Sardor",
    phone: "+998 91 1234567",
  },
  {
    id: "55824793",
    date: "2025-08-05",
    status: "active",
    isPaid: true,
    items: [
      {
        name: "Smart Watch",
        quantity: 1,
        price: 1200000,
        image:
          "https://media.moddb.com/images/downloads/1/297/296999/no-photo-or-blank-image-icon-loa.jpg",
      },
    ],
    total: 1200000,
    deliveryAddress: "Buxoro, O'zbekiston",
    recipient: "Karimova Dilnoza",
    phone: "+998 93 9876543",
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("all");

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "XARIDORGA BERILGAN",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
        };
      case "returned":
        return {
          label: "QAYTARILDI",
          color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          icon: XCircle,
        };
      case "active":
        return {
          label: "FAOL",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: Clock,
        };
      default:
        return {
          label: status,
          color: "bg-gray-500/10 text-gray-600",
          icon: Package,
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "unpaid") return !order.isPaid;
    if (activeTab === "active") return order.status === "active";
    return true;
  });

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3 mt-6">
        <TabsTrigger value="all" className="gap-2">
          <Package className="h-4 w-4" />
          Barchasi
        </TabsTrigger>
        <TabsTrigger value="unpaid" className="gap-2">
          <XCircle className="h-4 w-4" />
          To'lov qilinmagan
        </TabsTrigger>
        <TabsTrigger value="active" className="gap-2">
          <Clock className="h-4 w-4" />
          Faol
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-2 space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
              <Package className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Buyurtma topilmadi</h3>
                <p className="text-muted-foreground mt-1">
                  Bu bo'limda hech qanday buyurtma yo'q
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={order.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${statusInfo.color} border px-3 py-1`}>
                        <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                        {statusInfo.label}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          Buyurtma №{order.id}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => copyOrderId(order.id)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="mb-4 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Yetkazib berish manzili:
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold">{item.name}</h5>
                              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{item.quantity} ta tovar</span>
                                <span>•</span>
                                <span className="font-semibold text-foreground">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Yetkazib berish manzili:
                        </p>
                        <p className="text-sm">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Buyurtmani qabul qiluvchi:
                        </p>
                        <p className="text-sm font-medium">{order.recipient}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.phone}
                        </p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Jami:</span>
                        {!order.isPaid && (
                          <Badge variant="destructive" className="text-xs">
                            To'lov qilinmagan
                          </Badge>
                        )}
                      </div>
                      <span className="text-2xl font-bold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                      <Button className="min-w-[200px]">
                        Tovarlarni baholash
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </TabsContent>
    </Tabs>
  );
}
