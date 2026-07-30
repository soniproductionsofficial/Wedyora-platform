// Hand-written types matching supabase/migrations/0001_phase1_init.sql.
// Once there's a live Supabase project, these can be regenerated exactly via:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts
// Keeping them hand-written for now so the app type-checks before that project exists.
//
// Shape follows @supabase/postgrest-js's GenericSchema/GenericTable contract
// (Row/Insert/Update/Relationships per table, Views/Functions on the schema)
// so joined `.select("related(...)")` queries type-check correctly.

export type UserRole = "customer" | "vendor" | "admin";
export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";
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
      vendor_profiles: {
        Row: {
          id: string;
          business_name: string;
          category_id: string;
          city: string;
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
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["vendor_profiles"]["Row"]> & {
          id: string;
          business_name: string;
          category_id: string;
          city: string;
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
          price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["packages"]["Row"]> & {
          vendor_id: string;
          title: string;
          price: number;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
