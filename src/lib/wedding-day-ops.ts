// Wedding Day Operations (Chapter 9 poster) — web-feasible subset. Fixed
// lists in code, same simplification already used for vendor incentive
// tiers and penalty issues: these read like admin-configurable settings on
// the poster, but there's no admin UI to edit them yet, so they live here
// as constants until that's actually needed.

export interface ChecklistItem {
  key: string;
  label: string;
}

export const CUSTOMER_PRE_WEDDING_CHECKLIST: ChecklistItem[] = [
  { key: "final_headcount_confirmed", label: "Confirm final guest headcount" },
  { key: "venue_access_details_shared", label: "Share venue access & entry details" },
  { key: "schedule_confirmed", label: "Confirm the wedding day schedule/timings" },
  { key: "emergency_contact_shared", label: "Share an on-site emergency contact" },
];

export const VENDOR_PRE_WEDDING_CHECKLIST: ChecklistItem[] = [
  { key: "equipment_checked", label: "Equipment checked & packed" },
  { key: "team_briefed", label: "Team briefed on schedule & shot list" },
  { key: "route_planned", label: "Travel route to venue planned" },
  { key: "backup_equipment_ready", label: "Backup equipment ready" },
];

export const CHECKOUT_CHECKLIST: ChecklistItem[] = [
  { key: "all_equipment_collected", label: "All equipment collected" },
  { key: "client_signoff_obtained", label: "Client sign-off obtained on-site" },
  { key: "raw_files_backed_up_onsite", label: "Raw files backed up on-site" },
  { key: "next_steps_communicated", label: "Next steps communicated to customer" },
];

export interface IncidentIssue {
  key: string;
  label: string;
  suggestedAction: string;
  escalatedTo: string;
}

export const INCIDENT_ISSUES: IncidentIssue[] = [
  {
    key: "vendor_running_late",
    label: "Vendor running late",
    suggestedAction: "Contact vendor immediately, notify customer of revised ETA",
    escalatedTo: "Operations Admin",
  },
  {
    key: "equipment_failure",
    label: "Equipment failure",
    suggestedAction: "Activate backup equipment",
    escalatedTo: "Operations Admin",
  },
  {
    key: "weather_disruption",
    label: "Weather disruption",
    suggestedAction: "Move to the indoor contingency location per the venue plan",
    escalatedTo: "Venue Coordinator",
  },
  {
    key: "guest_count_mismatch",
    label: "Guest count mismatch",
    suggestedAction: "Confirm the final headcount with the customer on-site",
    escalatedTo: "Customer",
  },
  {
    key: "vendor_no_show",
    label: "Vendor no-show",
    suggestedAction: "Trigger the no-show penalty policy, arrange an emergency backup vendor",
    escalatedTo: "Operations Admin + Founder",
  },
  {
    key: "payment_dispute_onsite",
    label: "Payment dispute on-site",
    suggestedAction: "Do not resolve on-site — escalate to the finance team",
    escalatedTo: "Finance Admin",
  },
];

export function getIncidentIssue(key: string): IncidentIssue | undefined {
  return INCIDENT_ISSUES.find((i) => i.key === key);
}

export interface DeliverableCategory {
  key: string;
  label: string;
}

export const DELIVERABLE_CATEGORIES: DeliverableCategory[] = [
  { key: "raw_photos", label: "RAW Photos" },
  { key: "raw_videos", label: "RAW Videos" },
  { key: "drone_footage", label: "Drone Footage" },
  { key: "audio_files", label: "Audio Files" },
  { key: "backup_files", label: "Backup Files" },
];

export function labelForDeliverableCategory(key: string): string {
  return DELIVERABLE_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
