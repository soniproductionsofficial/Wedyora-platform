"use client";

import { useState, useTransition } from "react";
import { MapPin } from "lucide-react";
import { submitVendorLocationAction } from "@/lib/actions/vendor";

export default function VendorLocationStep() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "denied">("idle");

  function handleAllow() {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        startTransition(async () => {
          await submitVendorLocationAction(latitude, longitude);
        });
      },
      () => {
        setStatus("denied");
      },
    );
  }

  function handleSkip() {
    startTransition(async () => {
      await submitVendorLocationAction(null, null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="text-sm text-brand-gray">
          Allow location access so Wedyora can match you with nearby bookings
          and show you in the right city.
        </p>
        {status === "denied" && (
          <p className="text-xs text-brand-orange-dark">
            Location wasn&rsquo;t available — you can skip and continue.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleAllow}
        disabled={isPending}
        className="w-full rounded-full bg-brand-button py-3 font-semibold text-brand-black transition-colors hover:bg-brand-button-dark disabled:opacity-60"
      >
        {isPending ? "Please wait…" : "Allow Location Access"}
      </button>
      <button
        type="button"
        onClick={handleSkip}
        disabled={isPending}
        className="text-center text-xs text-brand-gray disabled:opacity-60"
      >
        Not Now
      </button>
    </div>
  );
}
