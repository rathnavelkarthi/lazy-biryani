export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Demo credentials — NOT for production
export const demoUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@lazybiryani.com",
    password: "admin123",
    name: "Admin Chef",
    role: "admin",
  },
  {
    id: "user-1",
    email: "user@lazybiryani.com",
    password: "user123",
    name: "Hungry Student",
    role: "user",
  },
];

export function findUser(
  email: string,
  password: string
): Omit<User, "password"> | null {
  const user = demoUsers.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}
