export interface CustomerProfileSession {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "customer";
  city?: string;
  whatsappReminderEnabled?: boolean;
}

export interface SavedTravelerItem {
  id: string;
  fullName: string;
  idCardNumber: string;
  gender: "MALE" | "FEMALE";
  phoneNumber: string;
  emergencyContact: string;
  specialNotes?: string;
}

export interface ClaimedBookingSummary {
  bookingCode: string;
  tripTitle: string;
  operatorName: string;
  departureDate: string;
  meetingPoint: string;
  totalPax: number;
  totalAmount: number;
  paymentStatus: "PAID" | "UNPAID" | "EXPIRED" | "CANCELLED";
  agentSlug: string;
  packageSlug: string;
  createdAt: string;
}

const SESSION_KEY = "nusabook_customer_session_v1";
const TRAVELERS_KEY = "nusabook_saved_travelers_v1";
const BOOKINGS_KEY = "nusabook_customer_bookings_v1";
const WISHLIST_KEY = "nusabook_customer_wishlist_v1";

export const DEFAULT_DEMO_CUSTOMER: CustomerProfileSession = {
  id: "cust-demo-001",
  fullName: "Anindya Paramitha",
  email: "anindya.paramitha@gmail.com",
  phoneNumber: "081234567890",
  role: "customer",
  city: "Yogyakarta",
  whatsappReminderEnabled: true,
};

export const DEFAULT_SAVED_TRAVELERS: SavedTravelerItem[] = [
  {
    id: "trv-1",
    fullName: "Anindya Paramitha",
    idCardNumber: "3404015208980001",
    gender: "FEMALE",
    phoneNumber: "081234567890",
    emergencyContact: "081122334455 (Bapak Hendra)",
    specialNotes: "Alergi seafood udang",
  },
  {
    id: "trv-2",
    fullName: "Raka Pratama Wijaya",
    idCardNumber: "3404011403960002",
    gender: "MALE",
    phoneNumber: "081298765432",
    emergencyContact: "081234567890 (Anindya)",
    specialNotes: "Ukuran jaket L",
  },
  {
    id: "trv-3",
    fullName: "Nadia Putri Lestari",
    idCardNumber: "3573014511990003",
    gender: "FEMALE",
    phoneNumber: "081345678901",
    emergencyContact: "081234567890 (Anindya)",
    specialNotes: "Tidak mabuk darat",
  },
];

export const DEFAULT_CUSTOMER_BOOKINGS: ClaimedBookingSummary[] = [
  {
    bookingCode: "NSB-20261018-001",
    tripTitle: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    operatorName: "Pesona Merapi Tour & Travel",
    departureDate: "2026-10-24",
    meetingPoint: "Basecamp Pesona Merapi, Kaliurang KM 22, Sleman",
    totalPax: 2,
    totalAmount: 500000,
    paymentStatus: "PAID",
    agentSlug: "pesona-merapi",
    packageSlug: "sunrise-lava-tour-merapi",
    createdAt: "2026-10-10T08:30:00Z",
  },
  {
    bookingCode: "NSB-20261018-QRVM",
    tripTitle: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
    operatorName: "Pesona Nusantara Tour (Malang)",
    departureDate: "2026-10-18",
    meetingPoint: "Stasiun Malang Kota Baru Pintu Timur",
    totalPax: 2,
    totalAmount: 900000,
    paymentStatus: "UNPAID",
    agentSlug: "bromo-overland",
    packageSlug: "bromo-sunrise-savana",
    createdAt: "2026-10-12T14:15:00Z",
  },
];

export const DEFAULT_WISHLIST_SLUGS: string[] = [
  "sunrise-lava-tour-merapi",
  "labuan-bajo-komodo-phinisi",
  "kawah-ijen-blue-fire",
];

export function maskCustomerNik(nik?: string | null): string {
  if (!nik || nik.length < 16) return "3404************";
  return `${nik.slice(0, 4)}********${nik.slice(12)}`;
}

export function getCustomerSession(): CustomerProfileSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerProfileSession;
  } catch {
    return null;
  }
}

export function saveCustomerSession(session: CustomerProfileSession): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function clearCustomerSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function getSavedTravelers(): SavedTravelerItem[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_TRAVELERS;
  try {
    const raw = window.localStorage.getItem(TRAVELERS_KEY);
    if (!raw) {
      window.localStorage.setItem(TRAVELERS_KEY, JSON.stringify(DEFAULT_SAVED_TRAVELERS));
      return DEFAULT_SAVED_TRAVELERS;
    }
    return JSON.parse(raw) as SavedTravelerItem[];
  } catch {
    return DEFAULT_SAVED_TRAVELERS;
  }
}

export function saveSavedTravelers(list: SavedTravelerItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TRAVELERS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getCustomerBookings(): ClaimedBookingSummary[] {
  if (typeof window === "undefined") return DEFAULT_CUSTOMER_BOOKINGS;
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(DEFAULT_CUSTOMER_BOOKINGS));
      return DEFAULT_CUSTOMER_BOOKINGS;
    }
    return JSON.parse(raw) as ClaimedBookingSummary[];
  } catch {
    return DEFAULT_CUSTOMER_BOOKINGS;
  }
}

export function addCustomerBooking(booking: ClaimedBookingSummary): ClaimedBookingSummary[] {
  const current = getCustomerBookings();
  const filtered = current.filter(
    (b) => b.bookingCode.toUpperCase() !== booking.bookingCode.toUpperCase()
  );
  const next = [booking, ...filtered];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
  return next;
}

export function getCustomerWishlist(): string[] {
  if (typeof window === "undefined") return DEFAULT_WISHLIST_SLUGS;
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    if (!raw) {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(DEFAULT_WISHLIST_SLUGS));
      return DEFAULT_WISHLIST_SLUGS;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return DEFAULT_WISHLIST_SLUGS;
  }
}

export function saveCustomerWishlist(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
}
