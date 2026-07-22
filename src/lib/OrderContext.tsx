"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  paymentMethod?: "cod" | "smartgateway";
  paymentStatus?: "pending" | "paid" | "failed";
  paymentId?: string;
  gatewayOrderId?: string;
}

interface PlaceOrderOptions {
  paymentMethod?: "cod" | "smartgateway";
  paymentStatus?: "pending" | "paid" | "failed";
  paymentId?: string;
  gatewayOrderId?: string;
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  placeOrder: (
    items: OrderItem[],
    total: number,
    address: string,
    options?: PlaceOrderOptions
  ) => Promise<{ error?: string; orderId?: string }>;
  fetchMyOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<{ error?: string }>;
  updateOrderPayment: (
    orderId: string,
    paymentStatus: "pending" | "paid" | "failed",
    paymentId?: string
  ) => Promise<{ error?: string }>;
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: false,
  placeOrder: async () => ({}),
  fetchMyOrders: async () => {},
  fetchAllOrders: async () => {},
  updateOrderStatus: async () => ({}),
  updateOrderPayment: async () => ({}),
});

function dbToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    userName: row.user_name as string,
    items: row.items as OrderItem[],
    total: row.total as number,
    status: row.status as OrderStatus,
    address: row.address as string,
    createdAt: row.created_at as string,
    paymentMethod: (row.payment_method as "cod" | "smartgateway") || "cod",
    paymentStatus: (row.payment_status as "pending" | "paid" | "failed") || "pending",
    paymentId: row.payment_id as string | undefined,
    gatewayOrderId: row.gateway_order_id as string | undefined,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const placeOrder = useCallback(
    async (
      items: OrderItem[],
      total: number,
      address: string,
      options: PlaceOrderOptions = {}
    ) => {
      if (!user) return { error: "You must be logged in to place an order" };

      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.from("orders").insert({
        id: orderId,
        user_id: user.id,
        user_name: user.name,
        items,
        total,
        status: options.paymentStatus === "paid" ? "preparing" : "pending",
        address,
        payment_method: options.paymentMethod || "cod",
        payment_status: options.paymentStatus || (options.paymentMethod === "smartgateway" ? "pending" : "paid"),
        payment_id: options.paymentId || null,
        gateway_order_id: options.gatewayOrderId || null,
      });

      if (error) return { error: error.message };
      return { orderId };
    },
    [user]
  );

  const fetchMyOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(dbToOrder));
    }
    setLoading(false);
  }, [user]);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(dbToOrder));
    }
    setLoading(false);
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) return { error: error.message };

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    return {};
  }, []);

  const updateOrderPayment = useCallback(
    async (
      orderId: string,
      paymentStatus: "pending" | "paid" | "failed",
      paymentId?: string
    ) => {
      const updates: Record<string, unknown> = { payment_status: paymentStatus };
      if (paymentId) updates.payment_id = paymentId;
      if (paymentStatus === "paid") updates.status = "preparing";

      const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (error) return { error: error.message };

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                paymentStatus,
                paymentId: paymentId || o.paymentId,
                status: paymentStatus === "paid" ? "preparing" : o.status,
              }
            : o
        )
      );
      return {};
    },
    []
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        placeOrder,
        fetchMyOrders,
        fetchAllOrders,
        updateOrderStatus,
        updateOrderPayment,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
