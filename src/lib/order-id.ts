/**
 * Order ID helpers for HDFC SmartGateway bank testing compliance.
 *
 * This module is intentionally free of Node-only imports so it can be used
 * from both client components and server API routes.
 *
 * Bank rules for order IDs:
 * 1) Less than 21 characters
 * 2) No special characters (alphanumeric only)
 * 3) Can be alphanumeric
 * 4) Should be Non-Sequential
 */

const ORDER_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a bank-compliant order ID:
 * <2-char prefix><14 random alphanumeric chars> = 16 chars total (< 21).
 * Cryptographically random (Web Crypto) so it is non-sequential.
 */
export function generateOrderId(prefix = "LB"): string {
  const randomSource =
    typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues
      ? globalThis.crypto.getRandomValues(new Uint8Array(14))
      : new Uint8Array(14).map(() => Math.floor(Math.random() * 256));
  let id = prefix;
  for (const b of randomSource) {
    id += ORDER_ID_ALPHABET[b % ORDER_ID_ALPHABET.length];
  }
  // Hard cap at 20 chars (< 21) and strip anything non-alphanumeric
  return id.slice(0, 20).replace(/[^A-Za-z0-9]/g, "");
}

/**
 * Validates an order ID against the bank's mandatory format rules.
 * Returns true only if: alphanumeric, non-empty, max 20 chars.
 */
export function isValidOrderId(orderId: string): boolean {
  return /^[A-Za-z0-9]{1,20}$/.test(orderId);
}

/**
 * Sanitizes a customer ID to a safe alphanumeric form (keeps uniqueness).
 */
export function sanitizeCustomerId(customerId: string): string {
  const cleaned = customerId.replace(/[^A-Za-z0-9]/g, "");
  return cleaned.slice(0, 40) || "guest";
}
