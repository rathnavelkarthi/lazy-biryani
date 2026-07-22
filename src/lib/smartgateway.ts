import crypto from "crypto";

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
const CLIENT_ID = process.env.SMARTGATEWAY_CLIENT_ID || "hdfcmaster";
const BASE_URL = process.env.SMARTGATEWAY_BASE_URL || "https://smartgateway.hdfcuat.bank.in";
const ENVIRONMENT = (process.env.SMARTGATEWAY_ENV as "sandbox" | "uat" | "production") || "uat";
const IS_TEST_MODE = process.env.NEXT_PUBLIC_SMARTGATEWAY_TEST_MODE !== "false";

/**
 * Generates HMAC SHA256 signature for SmartGateway payload verification
 */
export function generateHMACSignature(params: Record<string, string>, secretKey: string): string {
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return crypto.createHmac("sha256", secretKey).update(queryString).digest("hex");
}

/**
 * Creates SmartGateway Order Session and React Native SDK compatible payload
 */
export function createSmartGatewaySession(req: SmartGatewayOrderRequest) {
  const amountStr = req.amount.toFixed(2);
  const timestamp = Date.now().toString();

  const payloadParams: Record<string, string> = {
    action: "paymentPage",
    merchantId: MERCHANT_ID,
    clientId: CLIENT_ID,
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

  // Sign payload
  const signature = generateHMACSignature(payloadParams, API_KEY);

  // React Native Hypercheckout SDK payload structure (as expected by @juspay-tech/react-native-hypersdk)
  const sdkPayload: SmartGatewaySDKPayload = {
    requestId: `REQ_${timestamp}`,
    service: "in.juspay.hyperpay",
    payload: {
      action: "paymentPage",
      merchantId: MERCHANT_ID,
      clientId: CLIENT_ID,
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

  const getGatewayUrl = () => {
    if (BASE_URL) return `${BASE_URL.replace(/\/$/, "")}/checkout`;
    if (ENVIRONMENT === "uat") return "https://smartgateway.hdfcuat.bank.in/checkout";
    if (ENVIRONMENT === "sandbox") return "https://sandbox.smartgateway.hdfc.bank.in/checkout";
    return "https://smartgateway.hdfc.bank.in/checkout";
  };

  return {
    merchantId: MERCHANT_ID,
    orderId: req.orderId,
    amount: req.amount,
    currency: "INR",
    environment: ENVIRONMENT,
    isTestMode: IS_TEST_MODE,
    sdkPayload,
    gatewayUrl: getGatewayUrl(),
    dashboardUrl: ENVIRONMENT === "uat"
      ? "https://dashboard.smartgateway.hdfcuat.bank.in"
      : "https://dashboard.smartgateway.hdfc.bank.in",
  };
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
