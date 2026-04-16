"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { mockOrders } from "@/lib/orders";
import { useProducts } from "@/lib/ProductContext";
import { Navbar } from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const statusVariant: Record<string, "pending" | "primary" | "tertiary" | "success"> = {
  pending: "pending",
  preparing: "primary",
  out_for_delivery: "tertiary",
  delivered: "success",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-on-surface-variant font-bold">Loading...</span>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const { products } = useProducts();
  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = mockOrders.filter((o) => o.status !== "delivered").length;

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-2">
            <div>
              <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl font-black text-on-surface tracking-tighter">
                Admin Dashboard
              </h1>
              <p className="text-on-surface-variant text-sm">
                Welcome back, {user.name}
              </p>
            </div>
            <Badge variant="primary">Admin Panel</Badge>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: mockOrders.length, icon: "receipt_long" },
              { label: "Active Orders", value: activeOrders, icon: "local_shipping" },
              { label: "Revenue", value: `\u20B9${totalRevenue}`, icon: "payments" },
              { label: "Products", value: products.length, icon: "inventory_2" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-4"
              >
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">
                  {stat.icon}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-on-surface">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-8">
            <Link href="/admin/products">
              <div className="inline-flex items-center gap-3 bg-primary-container/30 border-4 border-[#333333] brutalist-shadow px-6 py-4 hover:bg-primary-container/50 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
                <div>
                  <div className="font-black text-on-surface text-sm">Manage Products</div>
                  <div className="text-xs text-on-surface-variant">Add, edit, delete products in the shop</div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-lg ml-2">arrow_forward</span>
              </div>
            </Link>
          </div>

          {/* Orders table - desktop */}
          <div className="hidden md:block bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#333333] text-white">
                  {["Order ID", "Customer", "Items", "Total", "Status", "Address"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-black uppercase tracking-widest text-xs"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t-2 border-[#333333] hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-4 py-3 font-black text-sm text-on-surface">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 font-bold text-sm text-on-surface">
                      {order.userName}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-black text-sm text-primary">
                      &#8377;{order.total}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[order.status]}>
                        {statusLabel[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate">
                      {order.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Orders cards - mobile */}
          <div className="md:hidden space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-black text-on-surface text-sm">
                      {order.id}
                    </span>
                    <p className="font-bold text-on-surface-variant text-sm">
                      {order.userName}
                    </p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>
                    {statusLabel[order.status]}
                  </Badge>
                </div>

                <div className="text-sm text-on-surface-variant mb-2">
                  {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
                </div>

                <div className="flex justify-between items-center pt-2 border-t-2 border-outline-variant">
                  <span className="text-xs text-on-surface-variant truncate max-w-[60%]">
                    {order.address}
                  </span>
                  <span className="font-black text-primary text-lg">
                    &#8377;{order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
