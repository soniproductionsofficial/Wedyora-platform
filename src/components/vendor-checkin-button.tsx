"use client";

import { useState, useTransition } from "react";
import { MapPin } from "lucide-react";
import { vendorCheckinAction } from "@/lib/actions/wedding-day-ops";

// Mirrors src/components/signup-location-step.tsx's geolocation pattern —
// the only other place in this app that needs client-side JS. This is a
// one-time check-in timestamp, not continuous tracking: the browser can't
// track location in the background anyway, so there's no live map here
// (that's deferred to a future native mobile app).
export default function VendorCheckinButton({
  bookingId,
  checkedInAt,
}: {
  bookingId: string;
  checkedInAt: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [locationDenied, setLocationDenied] = useState(false);

  if (checkedInAt) {
    return (
      <p className="text-sm text-green-700 font-medium">
        Checked in at {new Date(checkedInAt).toLocaleString("en-IN")}
      </p>
    );
  }

  function checkInWithoutLocation() {
    startTransition(async () => {
      await vendorCheckinAction(bookingId, null, null);
    });
  }

  function handleCheckIn() {
    if (!("geolocation" in navigator)) {
      setLocationDenied(true);
      checkInWithoutLocation();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        startTransition(async () => {
          await vendorCheckinAction(bookingId, latitude, longitude);
        });
      },
      () => {
        setLocationDenied(true);
        checkInWithoutLocation();
      }
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCheckIn}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-full bg-brand-button text-brand-black font-semibold px-5 py-2.5 text-sm hover:bg-brand-button-dark transition-colors disabled:opacity-60"
      >
        <MapPin className="h-4 w-4" />
        {isPending ? "Checking in…" : "Check In at Venue"}
      </button>
      {locationDenied && (
        <p className="text-xs text-brand-gray">
          Location wasn&rsquo;t available — checked in without it.
        </p>
      )}
    </div>
  );
}
