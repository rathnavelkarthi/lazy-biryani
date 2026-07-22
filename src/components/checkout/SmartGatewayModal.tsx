"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SmartGatewaySDKPayload } from "@/lib/smartgateway";

interface SmartGatewayModalProps {
  orderId: string;
  amount: number;
  customerEmail: string;
  sdkPayload?: SmartGatewaySDKPayload;
  onSuccess: (paymentId: string, paymentMethod: string) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

export function SmartGatewayModal({
  orderId,
  amount,
  customerEmail,
  sdkPayload,
  onSuccess,
  onFailure,
  onClose,
}: SmartGatewayModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking" | "sdk">("upi");
  const [upiId, setUpiId] = useState("success@hdfcbank");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [processing, setProcessing] = useState(false);
  const [showSdkJson, setShowSdkJson] = useState(false);

  const handlePay = async (shouldSucceed = true) => {
    setProcessing(true);

    try {
      if (!shouldSucceed) {
        setTimeout(() => {
          setProcessing(false);
          onFailure("Payment declined by bank or user cancelled on SmartGateway.");
        }, 1200);
        return;
      }

      // Send verification request to backend
      const res = await fetch("/api/payment/smartgateway/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId: `HDFC_TXN_${Date.now()}`,
          status: "CHARGED",
          signature: "test_sig_hdfc_smartgateway_pass",
          paymentMethod: activeTab.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setTimeout(() => {
          setProcessing(false);
          onSuccess(data.paymentId, activeTab === "upi" ? `UPI (${upiId})` : activeTab === "card" ? "Credit/Debit Card" : selectedBank);
        }, 1000);
      } else {
        setProcessing(false);
        onFailure(data.error || "Payment verification failed");
      }
    } catch (err: unknown) {
      setProcessing(false);
      const msg = err instanceof Error ? err.message : "Payment error";
      onFailure(msg);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-surface-container-lowest border-4 border-[#333333] brutalist-shadow max-w-lg w-full overflow-hidden text-on-surface"
        >
          {/* Header */}
          <div className="bg-[#004B8D] text-white p-4 flex items-center justify-between border-b-4 border-[#333333]">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#004B8D] font-black px-2 py-1 text-xs border border-blue-900 tracking-wider">
                HDFC BANK
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none text-white">SmartGateway</h3>
                <p className="text-[10px] text-blue-100 mt-0.5">Powered by Juspay Hypercheckout</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded border border-black uppercase tracking-wider">
                Test Mode
              </span>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-xl font-bold px-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Amount Bar */}
          <div className="bg-surface-container p-4 border-b-2 border-[#333333] flex justify-between items-center">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Order ID</p>
              <p className="font-mono text-sm font-bold text-on-surface">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Amount Due</p>
              <p className="text-2xl font-black text-primary">₹{amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="grid grid-cols-4 bg-gray-100 border-b-2 border-[#333333] text-xs font-bold text-center">
            <button
              onClick={() => setActiveTab("upi")}
              className={`py-3 px-2 border-r border-[#333333] ${
                activeTab === "upi" ? "bg-white text-[#004B8D] border-b-4 border-b-[#004B8D]" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              ⚡ UPI / QR
            </button>
            <button
              onClick={() => setActiveTab("card")}
              className={`py-3 px-2 border-r border-[#333333] ${
                activeTab === "card" ? "bg-white text-[#004B8D] border-b-4 border-b-[#004B8D]" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              💳 Card
            </button>
            <button
              onClick={() => setActiveTab("netbanking")}
              className={`py-3 px-2 border-r border-[#333333] ${
                activeTab === "netbanking" ? "bg-white text-[#004B8D] border-b-4 border-b-[#004B8D]" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              🏦 NetBanking
            </button>
            <button
              onClick={() => setActiveTab("sdk")}
              className={`py-3 px-2 ${
                activeTab === "sdk" ? "bg-white text-[#004B8D] border-b-4 border-b-[#004B8D]" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              📱 Mobile SDK
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {activeTab === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. success@hdfcbank"
                    className="w-full border-2 border-[#333333] p-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004B8D]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Tip: Use <code className="bg-gray-200 px-1 py-0.5 rounded text-black font-bold">success@hdfcbank</code> for test approval.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
                  <p className="text-xs text-blue-900 font-bold mb-2">Or Scan QR Code via GPay / PhonePe / Paytm</p>
                  <div className="bg-white border-2 border-black inline-block p-2 rounded">
                    {/* SVG QR Code representation */}
                    <svg className="w-28 h-28 mx-auto" viewBox="0 0 100 100">
                      <rect width="100" height="100" fill="white" />
                      <path d="M0 0h30v30H0zM70 0h30v30H70zM0 70h30v30H0z" fill="black" />
                      <path d="M5 5h20v20H5zM75 5h20v20H75zM5 75h20v20H5z" fill="white" />
                      <path d="M10 10h10v10H10zM80 10h10v10H80zM10 80h10v10H10z" fill="black" />
                      <path d="M35 5h10v20H35zM50 5h15v10H50zM35 30h25v10H35zM70 35h25v10H70zM35 50h15v20H35zM55 50h40v10H55zM55 65h15v30H55zM75 75h20v20H75z" fill="black" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">Test UPI QR Code (Simulated)</p>
                </div>
              </div>
            )}

            {activeTab === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border-2 border-[#333333] p-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#004B8D]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border-2 border-[#333333] p-2.5 text-sm font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border-2 border-[#333333] p-2.5 text-sm font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  🔒 Secure 256-bit SSL SmartGateway Encryption (Test Card)
                </p>
              </div>
            )}

            {activeTab === "netbanking" && (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                  Select NetBanking Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 border-2 text-left text-xs font-bold transition-all ${
                        selectedBank === bank
                          ? "border-[#004B8D] bg-blue-50 text-[#004B8D]"
                          : "border-gray-300 text-gray-700 hover:border-gray-500"
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sdk" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-on-surface">React Native SDK Payload</span>
                  <button
                    type="button"
                    onClick={() => setShowSdkJson(!showSdkJson)}
                    className="text-[11px] bg-gray-200 px-2 py-1 rounded font-mono font-bold"
                  >
                    {showSdkJson ? "Hide JSON" : "Format View"}
                  </button>
                </div>
                <div className="bg-gray-900 text-green-400 font-mono text-[11px] p-3 rounded overflow-x-auto max-h-52 border border-gray-700">
                  <pre>{JSON.stringify(sdkPayload || {
                    requestId: `REQ_${Date.now()}`,
                    service: "in.juspay.hyperpay",
                    payload: {
                      action: "paymentPage",
                      merchantId: "LAZYBIRYANI_TEST_MERCHANT",
                      orderId,
                      amount: amount.toFixed(2),
                      currency: "INR",
                      environment: "sandbox"
                    }
                  }, null, 2)}</pre>
                </div>
                <p className="text-[11px] text-gray-500">
                  This payload complies with HDFC SmartGateway React Native Hypercheckout SDK integration.
                </p>
              </div>
            )}

            {/* Test Execution Controls */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 flex flex-col gap-2">
              <button
                type="button"
                disabled={processing}
                onClick={() => handlePay(true)}
                className="w-full bg-[#004B8D] hover:bg-blue-900 text-white font-extrabold py-3 px-4 text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span> Processing Payment via SmartGateway...
                  </>
                ) : (
                  <>
                    <span>🔒 Pay ₹{amount.toFixed(2)} with HDFC SmartGateway</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={() => handlePay(false)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-3 text-xs border border-red-300 text-center"
              >
                Simulate Payment Failure / Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
