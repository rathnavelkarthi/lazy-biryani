"use client";

import { useAuth } from "@/lib/AuthContext";
import { useOrders, type OrderStatus } from "@/lib/OrderContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { Badge } from "@/components/ui/Badge";

const statusVariant: Record<OrderStatus, "pending" | "primary" | "tertiary" | "success" | "error"> = {
  pending: "pending",
  preparing: "primary",
  out_for_delivery: "tertiary",
  delivered: "success",
  cancelled: "error",
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusIcon: Record<OrderStatus, string> = {
  pending: "hourglass_top",
  preparing: "skillet",
  out_for_delivery: "delivery_dining",
  delivered: "check_circle",
  cancelled: "cancel",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, fetchMyOrders } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user, fetchMyOrders]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-on-surface-variant font-bold">Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-2">
              My Orders
            </h1>
            <p className="text-on-surface-variant">
              Track your biryani deliveries.
            </p>
          </div>

          {ordersLoading ? (
            <div className="text-center py-16">
              <span className="text-on-surface-variant font-bold">Loading your orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
                receipt_long
              </span>
              <p className="text-on-surface-variant mb-6 text-lg">
                No orders yet. Time to fix that!
              </p>
              <Link href="/menu">
                <BrutalistButton variant="primary" size="lg">
                  Browse Menu
                </BrutalistButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b-2 border-[#333333] bg-surface-container/30">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        {statusIcon[order.status]}
                      </span>
                      <div>
                        <span className="font-black text-on-surface text-sm">{order.id}</span>
                        <p className="text-xs text-on-surface-variant">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={statusVariant[order.status]}>
                      {statusLabel[order.status]}
                    </Badge>
                  </div>

                  {/* Order items */}
                  <div className="p-4">
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-bold text-on-surface">
                            &#8377;{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-outline-variant pt-3 flex justify-between items-center">
                      <div className="text-xs text-on-surface-variant max-w-[60%] truncate">
                        {order.address}
                      </div>
                      <span className="font-black text-primary text-xl">
                        &#8377;{order.total}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
