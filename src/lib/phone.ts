// Normalizes whatever a user types (spaces, dashes, with/without country
// code) into the E.164 format Supabase/the SMS provider require, e.g.
// "98765 43210" -> "+919876543210". Defaults to India (+91) since that's
// this platform's only market for now — revisit if Wedyora expands
// internationally (see the business plan's "Pan India -> International
// NRI Weddings" growth roadmap).
export function normalizePhone(input: string): string {
  const digitsAndPlus = input.trim().replace(/[^\d+]/g, "");

  if (digitsAndPlus.startsWith("+")) return digitsAndPlus;
  if (digitsAndPlus.length === 10) return `+91${digitsAndPlus}`;
  if (digitsAndPlus.length === 12 && digitsAndPlus.startsWith("91")) {
    return `+${digitsAndPlus}`;
  }
  // Fallback: let Supabase/the SMS provider reject it with a clear error
  // rather than silently mis-formatting an unusual input.
  return `+${digitsAndPlus}`;
}
