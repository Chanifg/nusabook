export type UserRole = 'superadmin' | 'agent_owner' | 'agent_staff';
export type PackageCategory = 'open_trip' | 'private_trip';
export type ScheduleStatus = 'OPEN' | 'CLOSED' | 'SOLD_OUT' | 'CANCELLED';
export type BookingStatus = 'UNPAID' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED';
export type PayoutStatus = 'REQUESTED' | 'APPROVED' | 'TRANSFERRED' | 'REJECTED';

export interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface TravelAgent {
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
}

export interface TourPackage {
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
  itinerary: any[];
  facilities_included: string[];
  facilities_excluded: string[];
  cancellation_policy: string | null;
  thumbnail_url: string | null;
  gallery_urls: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripSchedule {
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
}

export interface Booking {
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
}

export interface BookingPassenger {
  id: string;
  booking_id: string;
  full_name: string;
  id_card_number: string | null;
  gender: 'MALE' | 'FEMALE' | null;
  phone_number: string | null;
  emergency_contact: string | null;
  special_notes: string | null;
  created_at: string;
}

export interface AgentPayout {
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
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile };
      travel_agents: { Row: TravelAgent };
      tour_packages: { Row: TourPackage };
      trip_schedules: { Row: TripSchedule };
      bookings: { Row: Booking };
      booking_passengers: { Row: BookingPassenger };
      agent_payouts: { Row: AgentPayout };
    };
  };
}
