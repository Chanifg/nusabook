export type UserRole = 'superadmin' | 'agent_owner' | 'agent_staff';
export type PackageCategory = 'open_trip' | 'private_trip';
export type ScheduleStatus = 'OPEN' | 'CLOSED' | 'SOLD_OUT' | 'CANCELLED';
export type BookingStatus = 'UNPAID' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type PayoutStatus = 'REQUESTED' | 'APPROVED' | 'TRANSFERRED' | 'REJECTED';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone_number: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone_number: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone_number?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      travel_agents: {
        Row: {
          id: string;
          owner_id: string;
          business_name: string;
          slug: string;
          logo_url: string | null;
          banner_url: string | null;
          description: string | null;
          office_address: string;
          city: string;
          whatsapp_number: string;
          instagram_handle: string | null;
          bank_name: string;
          bank_account_number: string;
          bank_account_name: string;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          business_name: string;
          slug: string;
          logo_url?: string | null;
          banner_url?: string | null;
          description?: string | null;
          office_address: string;
          city: string;
          whatsapp_number: string;
          instagram_handle?: string | null;
          bank_name: string;
          bank_account_number: string;
          bank_account_name: string;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          business_name?: string;
          slug?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          description?: string | null;
          office_address?: string;
          city?: string;
          whatsapp_number?: string;
          instagram_handle?: string | null;
          bank_name?: string;
          bank_account_number?: string;
          bank_account_name?: string;
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tour_packages: {
        Row: {
          id: string;
          agent_id: string;
          title: string;
          slug: string;
          category: PackageCategory;
          duration_days: number;
          duration_nights: number;
          destination_city: string;
          meeting_point: string;
          description: string;
          itinerary: Json;
          facilities_included: string[];
          facilities_excluded: string[];
          cancellation_policy: string | null;
          thumbnail_url: string | null;
          gallery_urls: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          title: string;
          slug: string;
          category: PackageCategory;
          duration_days: number;
          duration_nights: number;
          destination_city: string;
          meeting_point: string;
          description: string;
          itinerary?: Json;
          facilities_included?: string[];
          facilities_excluded?: string[];
          cancellation_policy?: string | null;
          thumbnail_url?: string | null;
          gallery_urls?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          title?: string;
          slug?: string;
          category?: PackageCategory;
          duration_days?: number;
          duration_nights?: number;
          destination_city?: string;
          meeting_point?: string;
          description?: string;
          itinerary?: Json;
          facilities_included?: string[];
          facilities_excluded?: string[];
          cancellation_policy?: string | null;
          thumbnail_url?: string | null;
          gallery_urls?: string[];
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trip_schedules: {
        Row: {
          id: string;
          package_id: string;
          departure_date: string;
          return_date: string;
          total_quota: number;
          reserved_quota: number;
          booked_quota: number;
          price_per_pax: number;
          status: ScheduleStatus;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          package_id: string;
          departure_date: string;
          return_date: string;
          total_quota: number;
          reserved_quota?: number;
          booked_quota?: number;
          price_per_pax: number;
          status?: ScheduleStatus;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          package_id?: string;
          departure_date?: string;
          return_date?: string;
          total_quota?: number;
          reserved_quota?: number;
          booked_quota?: number;
          price_per_pax?: number;
          status?: ScheduleStatus;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string;
          agent_id: string;
          schedule_id: string;
          customer_name: string;
          customer_email: string;
          customer_whatsapp: string;
          total_pax: number;
          price_per_pax: number;
          total_amount: number;
          platform_fee: number;
          agent_payout_amount: number;
          payment_status: BookingStatus;
          payment_method: string | null;
          payment_reference: string | null;
          payment_expired_at: string;
          paid_at: string | null;
          is_manual_entry: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_code: string;
          agent_id: string;
          schedule_id: string;
          customer_name: string;
          customer_email: string;
          customer_whatsapp: string;
          total_pax: number;
          price_per_pax: number;
          total_amount: number;
          platform_fee: number;
          agent_payout_amount: number;
          payment_status?: BookingStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          payment_expired_at: string;
          paid_at?: string | null;
          is_manual_entry?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_code?: string;
          agent_id?: string;
          schedule_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_whatsapp?: string;
          total_pax?: number;
          price_per_pax?: number;
          total_amount?: number;
          platform_fee?: number;
          agent_payout_amount?: number;
          payment_status?: BookingStatus;
          payment_method?: string | null;
          payment_reference?: string | null;
          payment_expired_at?: string;
          paid_at?: string | null;
          is_manual_entry?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_passengers: {
        Row: {
          id: string;
          booking_id: string;
          full_name: string;
          id_card_number: string | null;
          gender: 'MALE' | 'FEMALE' | null;
          phone_number: string | null;
          emergency_contact: string | null;
          special_notes: string | null;
          is_checked_in: boolean;
          checked_in_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          full_name: string;
          id_card_number?: string | null;
          gender?: 'MALE' | 'FEMALE' | null;
          phone_number?: string | null;
          emergency_contact?: string | null;
          special_notes?: string | null;
          is_checked_in?: boolean;
          checked_in_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          full_name?: string;
          id_card_number?: string | null;
          gender?: 'MALE' | 'FEMALE' | null;
          phone_number?: string | null;
          emergency_contact?: string | null;
          special_notes?: string | null;
          is_checked_in?: boolean;
          checked_in_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      agent_payouts: {
        Row: {
          id: string;
          agent_id: string;
          amount: number;
          platform_deduction: number;
          net_transferred: number;
          status: PayoutStatus;
          bank_destination_name: string;
          bank_destination_account: string;
          bank_destination_holder: string;
          transfer_proof_url: string | null;
          requested_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          agent_id: string;
          amount: number;
          platform_deduction: number;
          net_transferred: number;
          status?: PayoutStatus;
          bank_destination_name: string;
          bank_destination_account: string;
          bank_destination_holder: string;
          transfer_proof_url?: string | null;
          requested_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          agent_id?: string;
          amount?: number;
          platform_deduction?: number;
          net_transferred?: number;
          status?: PayoutStatus;
          bank_destination_name?: string;
          bank_destination_account?: string;
          bank_destination_holder?: string;
          transfer_proof_url?: string | null;
          requested_at?: string;
          processed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      reserve_trip_quota: {
        Args: {
          p_schedule_id: string;
          p_pax: number;
        };
        Returns: boolean;
      };
      release_trip_quota: {
        Args: {
          p_schedule_id: string;
          p_pax: number;
        };
        Returns: void;
      };
      confirm_trip_quota: {
        Args: {
          p_schedule_id: string;
          p_pax: number;
        };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      package_category: PackageCategory;
      schedule_status: ScheduleStatus;
      booking_status: BookingStatus;
      payout_status: PayoutStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TravelAgent = Database['public']['Tables']['travel_agents']['Row'];
export type TourPackage = Database['public']['Tables']['tour_packages']['Row'];
export type TripSchedule = Database['public']['Tables']['trip_schedules']['Row'];
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BookingPassenger = Database['public']['Tables']['booking_passengers']['Row'];
export type AgentPayout = Database['public']['Tables']['agent_payouts']['Row'];