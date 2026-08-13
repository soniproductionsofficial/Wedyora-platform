// Hand-written types matching supabase/migrations/0001_phase1_init.sql.
// Once there's a live Supabase project, these can be regenerated exactly via:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts
// Keeping them hand-written for now so the app type-checks before that project exists.
//
// Shape follows @supabase/postgrest-js's GenericSchema/GenericTable contract
// (Row/Insert/Update/Relationships per table, Views/Functions on the schema)
// so joined `.select("related(...)")` queries type-check correctly.

export type UserRole = "customer" | "vendor" | "admin";
export type VendorStatus = "pending_payment" | "pending" | "approved" | "rejected" | "suspended";
export type BookingStatus =
  | "pending_assignment"
  | "pending_vendor_acceptance"
  | "awaiting_payment"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";
export type PaymentStatus = "created" | "paid" | "failed" | "refunded";
export type PaymentType = "advance" | "final";
export type PayoutStatus = "pending" | "released";
export type VendorPlanKeyDb =
  | "basic_verified"
  | "professional_partner"
  | "premium_partner"
  | "studio_partner";
export type PartnerTierDb = "standard" | "gold" | "platinum";
export type PackageTier = "basic" | "premium" | "luxury";
export type VendorPaymentType =
  | "registration_fee"
  | "security_deposit"
  | "annual_renewal"
  | "incentive_bonus"
  | "penalty"
  | "security_deposit_refund";
export type VendorPaymentDirection = "credit" | "debit";
export type VendorPaymentStatus = "pending" | "paid" | "waived";
export type PayoutMilestoneKeyDb =
  | "booking_confirmation"
  | "wedding_completed"
  | "raw_files_uploaded"
  | "quality_check_approved"
  | "customer_delivery_completed";
export type PayoutMilestoneStatus = "pending" | "released";
export type WeddingDayIncidentType =
  | "vendor_running_late"
  | "equipment_failure"
  | "weather_disruption"
  | "guest_count_mismatch"
  | "vendor_no_show"
  | "payment_dispute_onsite";
export type WeddingDayDeliverableCategory =
  | "raw_photos"
  | "raw_videos"
  | "drone_footage"
  | "audio_files"
  | "backup_files";
export type ContactMessageStatus = "new" | "read" | "resolved";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          city: string | null;
          email: string | null;
          preferred_language: string;
          wedding_date: string | null;
          wedding_venue_name: string | null;
          budget_min: number | null;
          budget_max: number | null;
          location_lat: number | null;
          location_lng: number | null;
          onboarding_completed_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      service_categories: {
        Row: { id: string; name: string; slug: string };
        Insert: Partial<Database["public"]["Tables"]["service_categories"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_categories"]["Row"]>;
        Relationships: [];
      };
      occasions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          phase: "pre_wedding" | "wedding" | "post_wedding" | "life_event";
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["occasions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["occasions"]["Row"]>;
        Relationships: [];
      };
      vendor_profiles: {
        Row: {
          id: string;
          business_name: string;
          category_id: string | null;
          city: string | null;
          bio: string | null;
          experience_years: number | null;
          portfolio_urls: string[];
          status: VendorStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          pan_number: string | null;
          aadhaar_number: string | null;
          gst_number: string | null;
          bank_account_holder_name: string | null;
          bank_account_number: string | null;
          bank_ifsc: string | null;
          team_size: number | null;
          service_areas: string[];
          available_from: string | null;
          equipment_details: string | null;
          plan: VendorPlanKeyDb | null;
          security_deposit_amount: number | null;
          plan_paid_at: string | null;
          plan_expires_at: string | null;
          successful_events_count: number;
          partner_tier: PartnerTierDb;
          agreed_to_vendor_terms_at: string | null;
          agreed_to_cancellation_policy_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vendor_profiles"]["Row"]> & {
          id: string;
          business_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_profiles"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vendor_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      packages: {
        Row: {
          id: string;
          vendor_id: string;
          title: string;
          description: string | null;
          customer_price: number;
          vendor_payout: number;
          tier: PackageTier | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["packages"]["Row"]> & {
          vendor_id: string;
          title: string;
          customer_price: number;
          vendor_payout: number;
        };
        Update: Partial<Database["public"]["Tables"]["packages"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "packages_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendor_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          category_id: string;
          occasion_id: string | null;
          package_id: string | null;
          vendor_id: string | null;
          event_date: string;
          city: string;
          guest_count: number | null;
          budget_min: number | null;
          budget_max: number | null;
          special_requirements: string | null;
          status: BookingStatus;
          assigned_by: string | null;
          assigned_at: string | null;
          agreed_price: number | null;
          agreed_vendor_payout: number | null;
          advance_amount: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> & {
          customer_id: string;
          category_id: string;
          event_date: string;
          city: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "bookings_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "service_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_occasion_id_fkey";
            columns: ["occasion_id"];
            isOneToOne: false;
            referencedRelation: "occasions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendor_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          type: PaymentType;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          payout_status: PayoutStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]> & {
          booking_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          vendor_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          booking_id: string;
          customer_id: string;
          vendor_id: string;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendor_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      add_ons: {
        Row: {
          id: string;
          name: string;
          customer_price: number;
          vendor_payout: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["add_ons"]["Row"]> & {
          name: string;
          customer_price: number;
          vendor_payout: number;
        };
        Update: Partial<Database["public"]["Tables"]["add_ons"]["Row"]>;
        Relationships: [];
      };
      booking_add_ons: {
        Row: {
          id: string;
          booking_id: string;
          add_on_id: string;
          customer_price: number;
          vendor_payout: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_add_ons"]["Row"]> & {
          booking_id: string;
          add_on_id: string;
          customer_price: number;
          vendor_payout: number;
        };
        Update: Partial<Database["public"]["Tables"]["booking_add_ons"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "booking_add_ons_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_add_ons_add_on_id_fkey";
            columns: ["add_on_id"];
            isOneToOne: false;
            referencedRelation: "add_ons";
            referencedColumns: ["id"];
          },
        ];
      };
      vendor_payments: {
        Row: {
          id: string;
          vendor_id: string;
          type: VendorPaymentType;
          direction: VendorPaymentDirection;
          amount: number;
          status: VendorPaymentStatus;
          reason: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vendor_payments"]["Row"]> & {
          vendor_id: string;
          type: VendorPaymentType;
          direction: VendorPaymentDirection;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_payments"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "vendor_payments_vendor_id_fkey";
            columns: ["vendor_id"];
            isOneToOne: false;
            referencedRelation: "vendor_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payout_milestones: {
        Row: {
          id: string;
          booking_id: string;
          milestone: PayoutMilestoneKeyDb;
          sort_order: number;
          percentage: number;
          amount: number;
          status: PayoutMilestoneStatus;
          released_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payout_milestones"]["Row"]> & {
          booking_id: string;
          milestone: PayoutMilestoneKeyDb;
          sort_order: number;
          percentage: number;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["payout_milestones"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "payout_milestones_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      wedding_day_ops: {
        Row: {
          booking_id: string;
          customer_checklist_done: string[];
          vendor_checklist_done: string[];
          checked_in_at: string | null;
          checkin_lat: number | null;
          checkin_lng: number | null;
          checkout_checklist_done: string[];
          checked_out_at: string | null;
          project_notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wedding_day_ops"]["Row"]> & {
          booking_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["wedding_day_ops"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "wedding_day_ops_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      wedding_day_incidents: {
        Row: {
          id: string;
          booking_id: string;
          issue_type: WeddingDayIncidentType;
          description: string | null;
          suggested_action: string | null;
          escalated_to: string | null;
          reported_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wedding_day_incidents"]["Row"]> & {
          booking_id: string;
          issue_type: WeddingDayIncidentType;
        };
        Update: Partial<Database["public"]["Tables"]["wedding_day_incidents"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "wedding_day_incidents_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wedding_day_incidents_reported_by_fkey";
            columns: ["reported_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wedding_day_deliverables: {
        Row: {
          id: string;
          booking_id: string;
          category: WeddingDayDeliverableCategory;
          file_path: string;
          file_name: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wedding_day_deliverables"]["Row"]> & {
          booking_id: string;
          category: WeddingDayDeliverableCategory;
          file_path: string;
          file_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["wedding_day_deliverables"]["Row"]>;
        Relationships: [
          {
            foreignKeyName: "wedding_day_deliverables_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wedding_day_deliverables_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          message: string;
          status: ContactMessageStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]> & {
          name: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
