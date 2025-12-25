"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { Copy, Package, Clock, CheckCircle2, Truck } from "lucide-react";
import { formatCurrency } from "@/lib";
import { useOrders } from "@/services/queries/orders";
import { Order } from "@/types/api";

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "delivered" | "out_for_delivery"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate offset based on current page
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    if (activeTab === "delivered") return "delivered";
    if (activeTab === "out_for_delivery") return "out_for_delivery";
    return undefined; // "all" - no filter
  }, [activeTab]);

  // Fetch orders from API
  const { data, isLoading, error } = useOrders({
    limit: ITEMS_PER_PAGE,
    offset,
    status: statusFilter,
  });

  // Reset to page 1 when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "delivered" | "out_for_delivery");
    setCurrentPage(1);
  };

  const copyOrderId = (id: number) => {
    navigator.clipboard.writeText(id.toString());
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "XARIDORGA BERILGAN",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
        };
      case "out_for_delivery":
        return {
          label: "YETKAZILMOQDA",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: Truck,
        };
      case "returned":
        return {
          label: "QAYTARILDI",
          color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          icon: Package,
        };
      case "pending":
        return {
          label: "KUTILMOQDA",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          icon: Clock,
        };
      case "confirmed":
      case "processing":
      case "processed":
        return {
          label: "JARAYONDA",
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: Clock,
        };
      case "failed":
      case "canceled":
        return {
          label: "BEKOR QILINGAN",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          icon: Package,
        };
      default:
        return {
          label: status.toUpperCase(),
          color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          icon: Package,
        };
    }
  };

  const orders = data?.orders || [];
  const totalSize = data?.total_size || 0;
  const totalPages = Math.ceil(totalSize / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3 mt-6">
          <TabsTrigger value="all" className="gap-2">
            <Package className="h-4 w-4" />
            Barchasi
          </TabsTrigger>
          <TabsTrigger value="delivered" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Topshirilganlar
          </TabsTrigger>
          <TabsTrigger value="out_for_delivery" className="gap-2">
            <Truck className="h-4 w-4" />
            Yetkazilmoqda
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-2 space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
                <Package className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Xatolik yuz berdi</h3>
                  <p className="text-muted-foreground mt-1">
                    Buyurtmalarni yuklashda muammo bo'ldi
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
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
            <>
              {orders.map((order: Order) => {
                const statusInfo = getStatusInfo(order.order_status);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={order.id}
                    className="overflow-hidden transition-shadow hover:shadow-lg"
                  >
                    <CardHeader className="border-b bg-muted/30">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            className={`${statusInfo.color} border px-3 py-1`}
                          >
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
                          {new Date(order.created_at).toLocaleDateString(
                            "uz-UZ",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </time>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Order Items - if available */}
                        {order.items && order.items.length > 0 && (
                          <div>
                            <h4 className="mb-4 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Mahsulotlar:
                            </h4>
                            <div className="space-y-4">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-4"
                                >
                                  {item.image && (
                                    <div className="h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                                      <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.product_name || "Mahsulot"}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h5 className="font-semibold">
                                      {item.product_name ||
                                        `Mahsulot #${item.product_id}`}
                                    </h5>
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
                        )}

                        {/* Delivery Info - if available */}
                        {(order.delivery_address ||
                          order.recipient ||
                          order.phone) && (
                          <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                            {order.delivery_address && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                                  Yetkazib berish manzili:
                                </p>
                                <p className="text-sm">
                                  {order.delivery_address}
                                </p>
                              </div>
                            )}
                            {(order.recipient || order.phone) && (
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                                  Buyurtmani qabul qiluvchi:
                                </p>
                                {order.recipient && (
                                  <p className="text-sm font-medium">
                                    {order.recipient}
                                  </p>
                                )}
                                {order.phone && (
                                  <p className="text-sm text-muted-foreground">
                                    {order.phone}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center justify-between border-t pt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Jami:</span>
                            {order.payment_status !== "paid" && (
                              <Badge variant="destructive" className="text-xs">
                                To'lov qilinmagan
                              </Badge>
                            )}
                          </div>
                          <span className="text-2xl font-bold">
                            {formatCurrency(order.order_amount)}
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
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
