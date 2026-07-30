"use client";

import { Printer } from "lucide-react";

// window.print() is the only part of the call sheet that needs client JS —
// the call sheet itself is computed server-side from existing booking data
// (see the "Call Sheet" section of the booking detail pages), not a stored
// document.
export default function PrintCallSheetButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-brand-line hover:bg-brand-cream transition-colors"
    >
      <Printer className="h-3.5 w-3.5" />
      Print Call Sheet
    </button>
  );
}
