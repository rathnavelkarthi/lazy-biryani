export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered";
  createdAt: string;
  address: string;
}

// Mock orders for admin dashboard
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-1",
    userName: "Rahul K.",
    items: [
      { productId: "chicken-dum-kit", name: "Chicken Dum Biryani Kit", price: 89, quantity: 2 },
      { productId: "egg-biryani-kit", name: "Egg Biryani Kit", price: 79, quantity: 1 },
    ],
    total: 257,
    status: "preparing",
    createdAt: "2026-04-15T10:30:00",
    address: "Room 204, Boys Hostel, VIT Vellore",
  },
  {
    id: "ORD-002",
    userId: "user-2",
    userName: "Sneha M.",
    items: [
      { productId: "veg-biryani-kit", name: "Veg Biryani Kit", price: 69, quantity: 3 },
    ],
    total: 207,
    status: "out_for_delivery",
    createdAt: "2026-04-15T11:15:00",
    address: "Room 312, Girls Hostel, BITS Pilani",
  },
  {
    id: "ORD-003",
    userId: "user-3",
    userName: "Arjun P.",
    items: [
      { productId: "mutton-biryani-kit", name: "Mutton Biryani Kit", price: 129, quantity: 1 },
      { productId: "chicken-dum-kit", name: "Chicken Dum Biryani Kit", price: 89, quantity: 1 },
    ],
    total: 218,
    status: "delivered",
    createdAt: "2026-04-14T19:45:00",
    address: "Flat 5B, PG Near SRM, Chennai",
  },
  {
    id: "ORD-004",
    userId: "user-4",
    userName: "Priya S.",
    items: [
      { productId: "egg-biryani-kit", name: "Egg Biryani Kit", price: 79, quantity: 4 },
    ],
    total: 316,
    status: "pending",
    createdAt: "2026-04-15T14:20:00",
    address: "Room 118, NIT Trichy Hostel",
  },
  {
    id: "ORD-005",
    userId: "user-5",
    userName: "Dev R.",
    items: [
      { productId: "chicken-dum-kit", name: "Chicken Dum Biryani Kit", price: 89, quantity: 5 },
      { productId: "veg-biryani-kit", name: "Veg Biryani Kit", price: 69, quantity: 2 },
    ],
    total: 583,
    status: "preparing",
    createdAt: "2026-04-15T13:00:00",
    address: "PG Block C, Koramangala, Bangalore",
  },
];
