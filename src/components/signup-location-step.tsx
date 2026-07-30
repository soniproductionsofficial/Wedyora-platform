"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { submitLocationStepAction } from "@/lib/actions/auth";

// The only step in the signup wizard that needs real client-side JS —
// reading the browser's geolocation API can't happen on the server. Per
// the Next.js Server Actions guide, an action called from an event handler
// (rather than a <form action>) must be wrapped in startTransition, which
// useTransition's startTransition gives us here.
export default function SignupLocationStep() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "denied">("idle");
  const router = useRouter();

  function handleAllow() {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        startTransition(async () => {
          await submitLocationStepAction(latitude, longitude);
        });
      },
      () => {
        setStatus("denied");
      }
    );
  }

  function handleSkip() {
    startTransition(async () => {
      await submitLocationStepAction(null, null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="text-sm text-brand-gray">
          Allow Wedyora to access your location so we can show vendors near
          you first.
        </p>
        {status === "denied" && (
          <p className="text-xs text-brand-orange-dark">
            Location wasn&rsquo;t available — no problem, you can skip this.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleAllow}
        disabled={isPending}
        className="w-full rounded-full bg-brand-orange text-white font-semibold py-3 hover:bg-brand-orange-dark transition-colors disabled:opacity-60"
      >
        {isPending ? "Please wait…" : "Allow Location Access"}
      </button>
      <button
        type="button"
        onClick={handleSkip}
        disabled={isPending}
        className="text-xs text-brand-gray text-center disabled:opacity-60"
      >
        Not Now
      </button>
      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="text-xs text-brand-gray/60 text-center"
      >
        Wrong step? Start over
      </button>
    </div>
  );
}
