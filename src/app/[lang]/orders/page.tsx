"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import {
  Copy,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Loader2,
} from "lucide-react";
import { formatCurrency } from "@/lib";
import { useOrders } from "@/services/queries/orders";
import { Order, OrderDetail } from "@/types/api";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const t = useTranslations("orders");
  const router = useRouter();
  const { status } = useSession();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname;
      router.push(`/auth?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [status, router]);

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

  // Helper function to parse product details from JSON string
  const parseProductDetails = (productDetailsJson: string) => {
    try {
      return JSON.parse(productDetailsJson);
    } catch {
      return null;
    }
  };

  // Helper function to get product name from order detail
  const getProductName = (detail: OrderDetail) => {
    if (detail.product?.name) {
      return detail.product.name;
    }
    const parsed = parseProductDetails(detail.product_details);
    return parsed?.name || `Mahsulot #${detail.product_id}`;
  };

  // Helper function to get product image from order detail
  const getProductImage = (detail: OrderDetail) => {
    // Try product object first
    if (detail.product?.thumbnail_full_url?.path) {
      return detail.product.thumbnail_full_url.path;
    }
    if (detail.product?.images_full_url?.[0]?.path) {
      return detail.product.images_full_url[0].path;
    }

    // Try parsing product_details JSON
    const parsed = parseProductDetails(detail.product_details);
    if (parsed?.thumbnail_full_url?.path) {
      return parsed.thumbnail_full_url.path;
    }
    if (parsed?.images_full_url?.[0]?.path) {
      return parsed.images_full_url[0].path;
    }

    return null;
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: t("statusDelivered"),
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          icon: CheckCircle2,
        };
      case "out_for_delivery":
        return {
          label: t("statusOutForDelivery"),
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: Truck,
        };
      case "returned":
        return {
          label: t("statusReturned"),
          color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
          icon: Package,
        };
      case "pending":
        return {
          label: t("statusPending"),
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          icon: Clock,
        };
      case "confirmed":
      case "processing":
      case "processed":
        return {
          label: t("statusProcessing"),
          color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          icon: Clock,
        };
      case "failed":
      case "canceled":
        return {
          label: t("statusCanceled"),
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

  const orders = data?.orders || [];
  const totalSize = data?.total_size || 0;
  const totalPages = Math.ceil(totalSize / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full mt-6"
      >
        <TabsContent value={activeTab} className="mt-2 space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">{t("loading")}</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
                <Package className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{t("error")}</h3>
                  <p className="text-muted-foreground mt-1">
                    {t("errorDescription")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
                <Package className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{t("noOrders")}</h3>
                  <p className="text-muted-foreground mt-1">
                    {t("noOrdersDescription")}
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
                              {t("orderNumber", { id: order.id })}
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
                        {order.details && order.details.length > 0 && (
                          <div>
                            <h4 className="mb-4 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              {t("products")}
                            </h4>
                            <div className="space-y-4">
                              {order.details.map((detail) => {
                                const productName = getProductName(detail);
                                const productImage = getProductImage(detail);
                                return (
                                  <div
                                    key={detail.id}
                                    className="flex items-start gap-4"
                                  >
                                    {productImage && (
                                      <div className="h-20 w-20 overflow-hidden rounded-lg border bg-muted">
                                        <Image
                                          width={80}
                                          height={80}
                                          src={productImage}
                                          alt={productName}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <h5 className="font-semibold">
                                        {productName}
                                      </h5>
                                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{t("items", { qty: detail.qty })}</span>
                                        <span>•</span>
                                        <span className="font-semibold text-foreground">
                                          {formatCurrency(detail.price)}
                                        </span>
                                      </div>
                                      {detail.variant && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                          {t("variant", { variant: detail.variant })}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Delivery Info - if available */}
                        {order.shipping_address_data && (
                          <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                                {t("deliveryAddress")}
                              </p>
                              <p className="text-sm">
                                {order.shipping_address_data.address}
                                {order.shipping_address_data.city &&
                                  `, ${order.shipping_address_data.city}`}
                                {order.shipping_address_data.district_id &&
                                  ` (Tuman ID: ${order.shipping_address_data.district_id})`}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                                {t("recipient")}
                              </p>
                              {order.shipping_address_data
                                .contact_person_name && (
                                <p className="text-sm font-medium">
                                  {
                                    order.shipping_address_data
                                      .contact_person_name
                                  }
                                </p>
                              )}
                              {order.shipping_address_data.phone && (
                                <p className="text-sm text-muted-foreground">
                                  {order.shipping_address_data.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Total */}
                        <div className="flex items-center justify-between border-t pt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{t("total")}</span>
                            {order.payment_status !== "paid" && (
                              <Badge variant="destructive" className="text-xs">
                                {t("notPaid")}
                              </Badge>
                            )}
                          </div>
                          <span className="text-2xl font-bold">
                            {formatCurrency(order.order_amount)}
                          </span>
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
