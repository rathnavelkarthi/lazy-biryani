import crypto from "crypto";
import {
  generateOrderId,
  isValidOrderId,
  sanitizeCustomerId,
} from "./order-id";

export { generateOrderId, isValidOrderId, sanitizeCustomerId };

export interface SmartGatewayOrderRequest {
  orderId: string;
  amount: number;
  customerId: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  description?: string;
}

export interface SmartGatewaySDKPayload {
  requestId: string;
  service: string;
  payload: {
    action: string;
    merchantId: string;
    clientId: string;
    orderId: string;
    amount: string;
    currency: string;
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
    environment: "sandbox" | "production";
    sdkPayloadVersion: string;
    signature?: string;
  };
}

export interface SmartGatewayVerifyResponse {
  valid: boolean;
  orderId: string;
  status: "CHARGED" | "PENDING" | "AUTHENTICATION_FAILED" | "AUTHORIZATION_FAILED" | "CANCELLED";
  paymentId?: string;
  paymentMethod?: string;
}

const MERCHANT_ID = process.env.SMARTGATEWAY_MERCHANT_ID || "SG5441";
const API_KEY = process.env.SMARTGATEWAY_API_KEY || "CE5CDCA9CBF4A95B2CF8A5A5269D6D";
const RESPONSE_KEY = process.env.SMARTGATEWAY_RESPONSE_KEY || "A6B589E2067410492F5DFEDD1E5772";
const CLIENT_ID = process.env.SMARTGATEWAY_PAYMENT_PAGE_CLIENT_ID || process.env.SMARTGATEWAY_CLIENT_ID || "hdfcmaster";
const BASE_URL = process.env.SMARTGATEWAY_BASE_URL || "https://smartgateway.hdfcuat.bank.in";
const ENVIRONMENT = (process.env.SMARTGATEWAY_ENV as "sandbox" | "uat" | "production") || "uat";
const IS_TEST_MODE = process.env.NEXT_PUBLIC_SMARTGATEWAY_TEST_MODE === "true";
const ENABLE_LOGGING = process.env.SMARTGATEWAY_ENABLE_LOGGING === "true";

export interface SmartGatewayOrderStatus {
  id: string;
  order_id: string;
  status: string;
  status_id: number;
  amount: number;
  currency: string;
  merchant_id: string;
  customer_id?: string;
  customer_email?: string;
  customer_phone?: string;
  txn_id?: string;
  payment_method?: string;
  payment_method_type?: string;
  payment_gateway_response?: {
    resp_code?: string;
    rrn?: string;
    epg_txn_id?: string;
    auth_id_code?: string;
    txn_id?: string;
    resp_message?: string;
  };
}

export interface SmartGatewaySessionResponse {
  merchantId: string;
  orderId: string;
  amount: number;
  currency: string;
  environment: string;
  isTestMode: boolean;
  paymentUrl: string;
  gatewayOrderId?: string;
  gatewayStatus?: string;
  paymentLinks?: {
    web?: string;
    mobile?: string;
    iframe?: string;
  };
  sdkPayload?: SmartGatewaySDKPayload;
}

/**
 * Dual inquiry / Status API (mandatory per HDFC security audit).
 * Server-to-server GET to SmartGateway: GET {base}/orders/{order_id}
 * Auth: Basic base64(apiKey:) with x-merchantid and x-customerid headers.
 */
export async function inquiryOrderStatus(
  orderId: string,
  customerId?: string
): Promise<{ ok: boolean; status?: SmartGatewayOrderStatus; error?: string }> {
  const apiKey = process.env.SMARTGATEWAY_API_KEY || API_KEY;
  const merchantId = process.env.SMARTGATEWAY_MERCHANT_ID || MERCHANT_ID;
  const baseUrl = (process.env.SMARTGATEWAY_BASE_URL || BASE_URL || "https://smartgateway.hdfcuat.bank.in").replace(/\/$/, "");
  const url = `${baseUrl}/orders/${encodeURIComponent(orderId)}`;

  try {
    const headers: Record<string, string> = {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      "x-merchantid": merchantId,
      "Content-Type": "application/json",
    };
    if (customerId) headers["x-customerid"] = customerId;

    if (ENABLE_LOGGING) {
      console.log("[SmartGateway] Checking order status:", url);
    }

    const res = await fetch(url, { method: "GET", headers });
    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error_message || `Status inquiry failed with status ${res.status}`,
      };
    }
    return { ok: true, status: data as SmartGatewayOrderStatus };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Status inquiry network error";
    return { ok: false, error: msg };
  }
}

/**
 * Generates HMAC SHA256 signature for SmartGateway payload verification
 */
export function generateHMACSignature(params: Record<string, string>, secretKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return crypto.createHmac("sha256", secretKey).update(queryString).digest("hex");
}

/**
 * Creates SmartGateway Order Session via POST {BASE_URL}/session
 * Returns hosted checkout payment URL to redirect user directly to HDFC SmartGateway Base URL.
 */
export async function createSmartGatewaySession(req: SmartGatewayOrderRequest): Promise<SmartGatewaySessionResponse> {
  const apiKey = process.env.SMARTGATEWAY_API_KEY || API_KEY;
  const merchantId = process.env.SMARTGATEWAY_MERCHANT_ID || MERCHANT_ID;
  const clientId = process.env.SMARTGATEWAY_PAYMENT_PAGE_CLIENT_ID || process.env.SMARTGATEWAY_CLIENT_ID || CLIENT_ID;
  const baseUrl = (process.env.SMARTGATEWAY_BASE_URL || BASE_URL || "https://smartgateway.hdfcuat.bank.in").replace(/\/$/, "");
  const amountStr = req.amount.toFixed(2);
  const timestamp = Date.now().toString();

  const sessionBody = {
    order_id: req.orderId,
    amount: amountStr,
    currency: "INR",
    customer_id: req.customerId,
    customer_email: req.customerEmail || "guest@lazybiryani.com",
    customer_phone: req.customerPhone || "9999999999",
    payment_page_client_id: clientId,
    action: "paymentPage",
    return_url: req.returnUrl,
    description: req.description || `Lazy Biryani Order ${req.orderId}`,
  };

  const headers: Record<string, string> = {
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
    "x-merchantid": merchantId,
    "x-customerid": req.customerId,
    "Content-Type": "application/json",
  };

  if (ENABLE_LOGGING) {
    console.log("[SmartGateway] Initiating session:", { url: `${baseUrl}/session`, body: sessionBody });
  }

  try {
    const res = await fetch(`${baseUrl}/session`, {
      method: "POST",
      headers,
      body: JSON.stringify(sessionBody),
    });

    const data = await res.json();

    if (ENABLE_LOGGING) {
      console.log("[SmartGateway] Session response status:", res.status, data);
    }

    if (res.ok && (data.payment_links || data.status)) {
      const paymentUrl =
        data.payment_links?.web ||
        data.payment_links?.mobile ||
        data.payment_links?.iframe ||
        `${baseUrl}/payment-page/order/${data.id || req.orderId}`;

      return {
        merchantId,
        orderId: req.orderId,
        amount: req.amount,
        currency: "INR",
        environment: ENVIRONMENT,
        isTestMode: false,
        paymentUrl,
        gatewayOrderId: data.id,
        gatewayStatus: data.status,
        paymentLinks: data.payment_links,
        sdkPayload: data.sdk_payload,
      };
    }

    throw new Error(data?.error_message || data?.message || `Gateway returned status ${res.status}`);
  } catch (err: unknown) {
    if (!IS_TEST_MODE) {
      throw err;
    }

    // Fallback for offline local sandbox test if enabled
    console.warn("[SmartGateway] Live session creation failed, using sandbox fallback:", err);
    const payloadParams: Record<string, string> = {
      action: "paymentPage",
      merchantId,
      clientId,
      orderId: req.orderId,
      amount: amountStr,
      currency: "INR",
      customerId: req.customerId,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone || "9999999999",
      returnUrl: req.returnUrl,
      environment: ENVIRONMENT === "uat" ? "sandbox" : ENVIRONMENT,
      timestamp,
    };

    const signature = generateHMACSignature(payloadParams, apiKey);

    const sdkPayload: SmartGatewaySDKPayload = {
      requestId: `REQ_${timestamp}`,
      service: "in.juspay.hyperpay",
      payload: {
        action: "paymentPage",
        merchantId,
        clientId,
        orderId: req.orderId,
        amount: amountStr,
        currency: "INR",
        customerId: req.customerId,
        customerEmail: req.customerEmail,
        customerPhone: req.customerPhone || "9999999999",
        returnUrl: req.returnUrl,
        environment: ENVIRONMENT === "uat" ? "sandbox" : ENVIRONMENT,
        sdkPayloadVersion: "v1",
        signature,
      },
    };

    return {
      merchantId,
      orderId: req.orderId,
      amount: req.amount,
      currency: "INR",
      environment: ENVIRONMENT,
      isTestMode: true,
      paymentUrl: `${baseUrl}/payment-page/order/${req.orderId}`,
      sdkPayload,
    };
  }
}

/**
 * Verifies SmartGateway HMAC signature from webhook or return URL response
 */
export function verifySmartGatewaySignature(
  params: Record<string, string>,
  receivedSignature: string
): boolean {
  if (IS_TEST_MODE && receivedSignature.startsWith("test_sig_")) {
    return true;
  }
  const secretKey = RESPONSE_KEY || API_KEY;
  const calculatedSignature = generateHMACSignature(params, secretKey);
  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(receivedSignature)
  );
}
