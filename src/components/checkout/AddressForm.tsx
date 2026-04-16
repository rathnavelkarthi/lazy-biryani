"use client";

import { useState, useCallback } from "react";
import { BrutalistButton } from "@/components/ui/BrutalistButton";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  pincode: string;
  lat: number | null;
  lng: number | null;
  label: "hostel" | "pg" | "home" | "other";
}

const EMPTY_ADDRESS: DeliveryAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "Chennai",
  pincode: "",
  lat: null,
  lng: null,
  label: "hostel",
};

interface AddressFormProps {
  onSubmit: (address: DeliveryAddress) => void;
  onBack?: () => void;
}

export function AddressForm({ onSubmit, onBack }: AddressFormProps) {
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryAddress, string>>>({});

  const update = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported on this device");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddress((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        // Reverse geocode using free Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "User-Agent": "LazyBiryani/1.0" } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            setAddress((prev) => ({
              ...prev,
              addressLine1: [addr.road, addr.neighbourhood].filter(Boolean).join(", ") || prev.addressLine1,
              city: addr.city || addr.town || addr.state_district || "Chennai",
              pincode: addr.postcode || prev.pincode,
              landmark: addr.suburb || prev.landmark,
            }));
          }
        } catch {
          // GPS coordinates still saved even if reverse geocode fails
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(
          err.code === 1
            ? "Location access denied. Please enter address manually."
            : "Could not get location. Please enter manually."
        );
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!address.fullName.trim()) newErrors.fullName = "Name is required";
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone.trim()))
      newErrors.phone = "Enter valid 10-digit number";
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode.trim()))
      newErrors.pincode = "Enter valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(address);
  };

  const labelOptions: { value: DeliveryAddress["label"]; icon: string; text: string }[] = [
    { value: "hostel", icon: "apartment", text: "Hostel" },
    { value: "pg", icon: "home_work", text: "PG" },
    { value: "home", icon: "home", text: "Home" },
    { value: "other", icon: "location_on", text: "Other" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-[family-name:var(--font-plus-jakarta-sans)] text-lg font-black text-on-surface uppercase tracking-wider flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">location_on</span>
        Delivery Address
      </h3>

      {/* GPS Button */}
      <button
        type="button"
        onClick={detectLocation}
        disabled={gpsLoading}
        className="w-full flex items-center justify-center gap-2 bg-tertiary-container border-2 border-[#333333] px-4 py-3 font-bold text-sm text-on-surface hover:brightness-95 transition-all"
      >
        <span className="material-symbols-outlined text-tertiary text-lg">
          {gpsLoading ? "hourglass_top" : "my_location"}
        </span>
        {gpsLoading ? "Detecting location..." : "Use Current Location (like Swiggy)"}
      </button>
      {gpsError && (
        <p className="text-xs text-secondary font-bold">{gpsError}</p>
      )}
      {address.lat && (
        <div className="bg-surface-container border-2 border-[#333333] p-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-base">check_circle</span>
          <span className="text-xs text-on-surface-variant">
            GPS: {address.lat.toFixed(5)}, {address.lng?.toFixed(5)}
          </span>
          {/* Mini map preview */}
          <img
            src={`https://static-maps.yandex.ru/v1?ll=${address.lng},${address.lat}&z=16&size=120,80&l=map&pt=${address.lng},${address.lat},pm2rdm`}
            alt="Location preview"
            className="ml-auto w-[120px] h-[80px] border border-[#333333] object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      {/* Address label */}
      <div className="flex gap-2">
        {labelOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => update("label", opt.value)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 border-2 text-xs font-bold uppercase tracking-wider transition-all ${
              address.label === opt.value
                ? "border-primary bg-primary-container/30 text-primary"
                : "border-[#333333] text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-base">{opt.icon}</span>
            {opt.text}
          </button>
        ))}
      </div>

      {/* Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
          />
          {errors.fullName && <p className="text-xs text-secondary mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={address.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
          />
          {errors.phone && <p className="text-xs text-secondary mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Address lines */}
      <div>
        <input
          type="text"
          placeholder="Address Line 1 (Room no, Building, Street)"
          value={address.addressLine1}
          onChange={(e) => update("addressLine1", e.target.value)}
          className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
        />
        {errors.addressLine1 && <p className="text-xs text-secondary mt-1">{errors.addressLine1}</p>}
      </div>
      <input
        type="text"
        placeholder="Address Line 2 (College/Area name)"
        value={address.addressLine2}
        onChange={(e) => update("addressLine2", e.target.value)}
        className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
      />

      {/* Landmark, City, Pincode */}
      <div className="grid grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Landmark"
          value={address.landmark}
          onChange={(e) => update("landmark", e.target.value)}
          className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => update("city", e.target.value)}
          className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
        />
        <div>
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full bg-surface-container-lowest border-2 border-[#333333] px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-colors"
          />
          {errors.pincode && <p className="text-xs text-secondary mt-1">{errors.pincode}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onBack && (
          <BrutalistButton type="button" variant="secondary" size="md" onClick={onBack} className="flex-1">
            Back
          </BrutalistButton>
        )}
        <BrutalistButton type="submit" variant="danger" size="md" className="flex-1">
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">delivery_dining</span>
            Deliver Here
          </span>
        </BrutalistButton>
      </div>
    </form>
  );
}
