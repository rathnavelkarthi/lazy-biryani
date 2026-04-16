"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b-4 border-[#333333] brutalist-shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b-4 border-[#333333]"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-black text-primary tracking-tighter font-[family-name:var(--font-plus-jakarta-sans)] flex items-center gap-2"
        >
          <span className="bg-secondary text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg font-black">
            L
          </span>
          <span className="hidden sm:inline">Lazy Biryani</span>
          <span className="sm:hidden">Lazy B.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/"
            className="text-on-surface font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-on-surface font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
          >
            Menu
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin"
                className="text-on-surface font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/admin/products"
                className="text-on-surface font-bold text-sm uppercase tracking-widest hover:text-primary transition-colors"
              >
                Products
              </Link>
            </>
          )}

          {/* Cart icon */}
          <Link
            href="/cart"
            className="relative text-on-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              shopping_cart
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-black w-5 h-5 flex items-center justify-center border border-[#333333]">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-surface-container-highest text-on-surface border-2 border-[#333333] px-3 py-1 text-xs font-black uppercase tracking-wider hover:bg-error hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-container text-on-primary-container border-2 border-[#333333] px-4 py-2 text-xs font-black uppercase tracking-wider brutalist-shadow brutalist-shadow-hover transition-all"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative text-on-surface w-10 h-10 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">
              shopping_cart
            </span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-black w-4 h-4 flex items-center justify-center border border-[#333333]">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-on-surface w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-background border-t-2 border-[#333333]"
          >
            <div className="flex flex-col gap-1 p-4">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-on-surface font-bold text-sm uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors"
              >
                Home
              </Link>
              <Link
                href="/menu"
                onClick={() => setMenuOpen(false)}
                className="text-on-surface font-bold text-sm uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="text-on-surface font-bold text-sm uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors flex items-center justify-between"
              >
                Cart
                {totalItems > 0 && (
                  <span className="bg-secondary text-white text-xs font-black px-2 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user?.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-on-surface font-bold text-sm uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    href="/admin/products"
                    onClick={() => setMenuOpen(false)}
                    className="text-on-surface font-bold text-sm uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors"
                  >
                    Manage Products
                  </Link>
                </>
              )}

              <div className="mt-2 pt-2 border-t-2 border-outline-variant">
                {user ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-bold text-on-surface">
                      {user.name}
                      <span className="text-xs text-on-surface-variant ml-2">
                        ({user.role})
                      </span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-error text-white px-3 py-1 text-xs font-black uppercase tracking-wider border border-[#333333]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-primary-container text-on-primary-container px-6 py-3 font-black text-sm uppercase tracking-wider text-center border-2 border-[#333333] brutalist-shadow"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
