"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BrutalistButton } from "@/components/ui/BrutalistButton";
import { AddressForm, type DeliveryAddress } from "@/components/checkout/AddressForm";
import { useState } from "react";

function OrderSuccess({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-6 sm:p-8 max-w-md w-full text-center"
      >
        <div className="bg-tertiary-container w-16 h-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#333333]">
          <span className="material-symbols-outlined text-tertiary text-4xl">
            check_circle
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-2xl font-black text-on-surface mb-2">
          Order Placed!
        </h2>
        <p className="text-on-surface-variant mb-1">
          Your biryani is being prepared.
        </p>
        <p className="text-sm text-on-surface-variant mb-6">
          Payment: Cash on Delivery
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/menu">
            <BrutalistButton variant="primary" size="md" className="w-full">
              Order More
            </BrutalistButton>
          </Link>
          <Link href="/">
            <BrutalistButton variant="secondary" size="md" className="w-full">
              Back to Home
            </BrutalistButton>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } =
    useCart();
  const [ordered, setOrdered] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [savedAddress, setSavedAddress] = useState<DeliveryAddress | null>(null);

  const handlePlaceOrder = () => {
    if (!savedAddress) {
      setShowAddress(true);
      return;
    }
    setOrdered(true);
    clearCart();
  };

  const handleAddressSubmit = (address: DeliveryAddress) => {
    setSavedAddress(address);
    setShowAddress(false);
  };

  const isEmpty = items.length === 0 && !ordered;

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen pt-24 sm:pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="font-[family-name:var(--font-plus-jakarta-sans)] text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-2">
              Your Cart
            </h1>
            <p className="text-on-surface-variant">
              {isEmpty ? "Nothing here yet. Go grab some biryani!" : `${totalItems} item${totalItems > 1 ? "s" : ""} ready to go.`}
            </p>
          </div>

          {isEmpty ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">
                shopping_cart
              </span>
              <p className="text-on-surface-variant mb-6 text-lg">
                Your cart is empty. Let&apos;s fix that.
              </p>
              <Link href="/menu">
                <BrutalistButton variant="primary" size="lg">
                  Browse Menu
                </BrutalistButton>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Items list */}
              <div className="flex-1 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow flex flex-col sm:flex-row overflow-hidden"
                  >
                    {/* Product image */}
                    <div className="sm:w-32 sm:h-32 h-40 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-[family-name:var(--font-plus-jakarta-sans)] font-black text-on-surface text-base">
                          {item.product.name}
                        </h3>
                        <p className="text-primary font-black text-lg">
                          &#8377;{item.product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border-2 border-[#333333]">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center font-black text-lg hover:bg-surface-container transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 h-9 flex items-center justify-center font-black text-base border-x-2 border-[#333333] bg-surface-container-lowest">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center font-black text-lg hover:bg-surface-container transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="font-black text-on-surface text-base min-w-[60px] text-right">
                          &#8377;{item.product.price * item.quantity}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-error hover:bg-error-container p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined text-xl">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:w-96 shrink-0">
                <div className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow p-5 sticky top-24">
                  {showAddress ? (
                    <AddressForm
                      onSubmit={handleAddressSubmit}
                      onBack={() => setShowAddress(false)}
                    />
                  ) : (
                    <>
                      <h2 className="font-[family-name:var(--font-plus-jakarta-sans)] text-lg font-black text-on-surface mb-4 uppercase tracking-wider">
                        Order Summary
                      </h2>

                      <div className="space-y-2 mb-4">
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-on-surface-variant">
                              {item.product.name} x{item.quantity}
                            </span>
                            <span className="font-bold text-on-surface">
                              &#8377;{item.product.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t-2 border-[#333333] pt-3 mb-2">
                        <div className="flex justify-between text-sm text-on-surface-variant">
                          <span>Delivery</span>
                          <span className="font-bold text-tertiary">FREE</span>
                        </div>
                      </div>

                      <div className="border-t-4 border-[#333333] pt-3 mb-4">
                        <div className="flex justify-between">
                          <span className="font-black text-on-surface text-lg">
                            Total
                          </span>
                          <span className="font-black text-primary text-2xl">
                            &#8377;{totalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Saved address display */}
                      {savedAddress && (
                        <div className="mb-4 bg-tertiary-container/20 border-2 border-[#333333] p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black uppercase tracking-widest text-tertiary flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">location_on</span>
                              {savedAddress.label}
                            </span>
                            <button
                              onClick={() => setShowAddress(true)}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Change
                            </button>
                          </div>
                          <p className="text-sm text-on-surface font-bold">{savedAddress.fullName}</p>
                          <p className="text-xs text-on-surface-variant">
                            {savedAddress.addressLine1}
                            {savedAddress.addressLine2 ? `, ${savedAddress.addressLine2}` : ""}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {savedAddress.city} - {savedAddress.pincode}
                          </p>
                          <p className="text-xs text-on-surface-variant">{savedAddress.phone}</p>
                          {savedAddress.lat && (
                            <p className="text-xs text-tertiary mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">my_location</span>
                              GPS linked
                            </p>
                          )}
                        </div>
                      )}

                      <BrutalistButton
                        variant={savedAddress ? "danger" : "primary"}
                        size="lg"
                        className="w-full text-base sm:text-lg"
                        onClick={handlePlaceOrder}
                      >
                        {savedAddress ? "Place Order (COD)" : "Add Delivery Address"}
                      </BrutalistButton>

                      <p className="text-xs text-on-surface-variant text-center mt-3 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm text-tertiary">
                          verified_user
                        </span>
                        Cash on Delivery only
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {ordered && (
          <OrderSuccess onClose={() => setOrdered(false)} />
        )}
      </main>
      <Footer />
    </>
  );
}
