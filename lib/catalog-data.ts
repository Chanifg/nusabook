export interface CatalogSchedule {
  id: string;
  departureDate: string;
  returnDate: string;
  totalQuota: number;
  availableSeats: number;
  reservedQuota: number;
  bookedQuota: number;
  pricePerPax: number;
  status: "OPEN" | "CLOSED" | "SOLD_OUT";
  dateText: string;
  departureTime: string;
  statusBadge: string;
  isSoldOut: boolean;
}

export interface CatalogPackage {
  id: string;
  title: string;
  slug: string;
  category: "open_trip" | "private_trip";
  categoryLabel: string;
  duration_days: number;
  duration_nights: number;
  durationLabel: string;
  destination_city: string;
  meeting_point: string;
  description: string;
  itinerary: Array<{ time: string; activity: string }>;
  facilities_included: string[];
  facilities_excluded: string[];
  cancellation_policy: string;
  thumbnail_url: string;
  gallery_urls: string[];
  originalPrice?: number;
  pricePerPax: number;
  rating: number;
  reviewCount: number;
  vehicleType: string;
  agent: {
    id: string;
    business_name: string;
    slug: string;
    city: string;
    office_address: string;
    whatsapp_number: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_name: string;
    description: string;
    is_verified: boolean;
  };
  schedules: CatalogSchedule[];
}

export const CATALOG_PACKAGES: CatalogPackage[] = [
  // 1. Merapi
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Sunrise Lava Tour Merapi & Bunker Kaliadem",
    slug: "sunrise-lava-tour-merapi",
    category: "open_trip",
    categoryLabel: "Open Trip",
    duration_days: 1,
    duration_nights: 0,
    durationLabel: "1 Hari / Sunrise",
    destination_city: "Yogyakarta",
    meeting_point: "Basecamp Jeep Kaliurang, Sleman, Yogyakarta",
    description:
      "Saksikan keindahan matahari terbit berlatar megahnya Gunung Merapi dilanjutkan petualangan seru menyusuri jejak erupsi dengan Jeep 4x4 melintasi Kali Kuning, Bunker Kaliadem, dan Museum Sisa Hartaku.",
    itinerary: [
      { time: "04:00", activity: "Kumpul di Basecamp Jeep Kaliurang dan briefing keselamatan" },
      { time: "04:30", activity: "Menuju Spot Golden Sunrise Bunker Kaliadem" },
      { time: "06:30", activity: "Kunjungan Museum Sisa Hartaku dan Batu Alien" },
      { time: "08:30", activity: "Manuver Air Kali Kuning (Water Splash) dan penutupan trip" },
    ],
    facilities_included: [
      "Jeep 4x4 dan Driver Berpengalaman",
      "BBM dan Tiket Masuk Objek Wisata",
      "Pemandu Lokal Berlisensi",
      "Air Mineral dan Snack Pagi",
      "Asuransi Jasa Raharja",
    ],
    facilities_excluded: [
      "Pengeluaran Pribadi",
      "Transportasi Menuju Basecamp Kaliurang",
      "Tips Sukarela Driver",
    ],
    cancellation_policy: "Pembatalan hingga H-3 mendapatkan pengembalian 50%. Pembatalan kurang dari 48 jam tidak dapat di-refund.",
    thumbnail_url: "https://images.unsplash.com/photo-1704288038005-d64b6cbbd569?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1704288038005-d64b6cbbd569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1698397201841-3a56c70c96ac?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 300000,
    pricePerPax: 250000,
    rating: 4.9,
    reviewCount: 310,
    vehicleType: "Jeep 4x4 Hardtop",
    agent: {
      id: "11111111-1111-1111-1111-111111111111",
      business_name: "Pesona Merapi Tour & Travel",
      slug: "pesona-merapi",
      city: "Sleman",
      office_address: "Jl. Kaliurang KM 21, Sleman, D.I. Yogyakarta",
      whatsapp_number: "081234567890",
      bank_name: "BCA",
      bank_account_number: "8820192831",
      bank_account_name: "Budi Santoso",
      description: "Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333333",
        departureDate: "2026-10-24",
        returnDate: "2026-10-24",
        totalQuota: 12,
        availableSeats: 6,
        reservedQuota: 2,
        bookedQuota: 4,
        pricePerPax: 250000,
        status: "OPEN",
        dateText: "Sabtu, 24 Okt 2026",
        departureTime: "Pagi 04:00 WIB",
        statusBadge: "Tersedia 6 Kursi",
        isSoldOut: false,
      },
      {
        id: "33333333-3333-3333-3333-333333333334",
        departureDate: "2026-10-25",
        returnDate: "2026-10-25",
        totalQuota: 12,
        availableSeats: 8,
        reservedQuota: 0,
        bookedQuota: 4,
        pricePerPax: 250000,
        status: "OPEN",
        dateText: "Minggu, 25 Okt 2026",
        departureTime: "Pagi 04:00 WIB",
        statusBadge: "Tersedia 8 Kursi",
        isSoldOut: false,
      },
    ],
  },

  // 2. Borobudur
  {
    id: "22222222-2222-2222-2222-222222222271",
    title: "Private Premium Trip Candi Borobudur & Punthuk Setumbu",
    slug: "borobudur-punthuk-setumbu",
    category: "private_trip",
    categoryLabel: "Private Trip",
    duration_days: 1,
    duration_nights: 0,
    durationLabel: "1 Hari",
    destination_city: "Magelang",
    meeting_point: "Lobi Hotel / Stasiun Tugu Jogja / Area Magelang",
    description:
      "Pengalaman privat eksklusif melihat kemegahan kabut fajar Candi Borobudur dari bukit Punthuk Setumbu, dilanjutkan sarapan tradisional dan tur naik ke struktur Candi Borobudur didampingi Pamong Budaya resmi.",
    itinerary: [
      { time: "04:00", activity: "Penjemputan di hotel dan perjalanan menuju Punthuk Setumbu" },
      { time: "05:00", activity: "Momen magis siluet Borobudur berselimut kabut fajar" },
      { time: "07:00", activity: "Sarapan tradisional di resto desa wisata Borobudur" },
      { time: "08:30", activity: "Tur eksklusif naik struktur Candi Borobudur dengan pemandu resmi" },
      { time: "11:30", activity: "Perjalanan kembali ke titik penjemputan" },
    ],
    facilities_included: [
      "Mobil Privat AC Bersih dan BBM",
      "Tiket Sunrise Punthuk Setumbu",
      "Tiket Naik Struktur Candi Borobudur",
      "Pamong Budaya Lisensi Resmi",
      "Sarapan Tradisional dan Air Mineral",
    ],
    facilities_excluded: ["Pengeluaran Pribadi", "Tipping Sukarela"],
    cancellation_policy: "Pembatalan H-2 dikenakan administrasi 20%.",
    thumbnail_url: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 750000,
    pricePerPax: 650000,
    rating: 4.9,
    reviewCount: 165,
    vehicleType: "Innova Reborn AC",
    agent: {
      id: "11111111-1111-1111-1111-111111111116",
      business_name: "Borobudur Sunrise Tour",
      slug: "borobudur-sunrise",
      city: "Magelang",
      office_address: "Jl. Medang Kamulan No. 9, Borobudur, Magelang, Jawa Tengah",
      whatsapp_number: "081298765411",
      bank_name: "BCA",
      bank_account_number: "7310294821",
      bank_account_name: "Siti Aminah",
      description: "Spesialis wisata budaya Candi Borobudur, Punthuk Setumbu, dan arung jeram Sungai Elo Magelang.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333381",
        departureDate: "2026-10-25",
        returnDate: "2026-10-25",
        totalQuota: 8,
        availableSeats: 4,
        reservedQuota: 0,
        bookedQuota: 4,
        pricePerPax: 650000,
        status: "OPEN",
        dateText: "Minggu, 25 Okt 2026",
        departureTime: "Pagi 04:00 WIB",
        statusBadge: "Tersisa 4 Kursi",
        isSoldOut: false,
      },
    ],
  },

  // 3. Bromo
  {
    id: "22222222-2222-2222-2222-222222222231",
    title: "Open Trip Bromo Sunrise & Savana Teletubbies 1D",
    slug: "bromo-sunrise-savana",
    category: "open_trip",
    categoryLabel: "Open Trip",
    duration_days: 1,
    duration_nights: 0,
    durationLabel: "1 Hari / Midnight",
    destination_city: "Malang",
    meeting_point: "Stasiun KA Malang Kota Baru / Rest Area Tumpang",
    description:
      "Petualangan legendaris menyambut fajar emas dari Penanjakan 1 Bromo, dilanjutkan kawah aktif Bromo, Pura Poten, Pasir Berbisik, dan bukit Teletubbies hijau.",
    itinerary: [
      { time: "00:30", activity: "Penjemputan di Stasiun Malang Kota Baru" },
      { time: "03:30", activity: "Tiba di Rest Area Bromo dan pindah Jeep 4x4" },
      { time: "05:00", activity: "Golden Sunrise Penanjakan 1 / Kingkong Hill" },
      { time: "07:00", activity: "Trekking Kawah Bromo dan Pura Poten" },
      { time: "09:30", activity: "Eksplorasi Pasir Berbisik dan Savana Teletubbies" },
      { time: "12:30", activity: "Kembali tiba di Kota Malang" },
    ],
    facilities_included: [
      "Jeep Hardtop 4x4 Terawat",
      "Tiket Masuk Resmi TNBTS",
      "Driver Berpengalaman sebagai Fotografer",
      "Transport Shuttle PP Malang",
      "Air Mineral",
    ],
    facilities_excluded: ["Sewa Kuda di Kawah", "Makan dan Jaket Hangat"],
    cancellation_policy: "Garansi berangkat setiap hari. Pembatalan H-1 dikenakan biaya 100%.",
    thumbnail_url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 550000,
    pricePerPax: 450000,
    rating: 4.9,
    reviewCount: 248,
    vehicleType: "Jeep 4x4 Hardtop",
    agent: {
      id: "11111111-1111-1111-1111-111111111112",
      business_name: "Bromo Overland Adventure",
      slug: "bromo-overland",
      city: "Malang",
      office_address: "Jl. Ijen No. 45, Klojen, Kota Malang, Jawa Timur",
      whatsapp_number: "081398765432",
      bank_name: "Mandiri",
      bank_account_number: "1440019283741",
      bank_account_name: "Raden Arya Pratama",
      description: "Operator spesialis ekspedisi Gunung Bromo, sunrise hunter, dan overland Jawa Timur berpengalaman sejak 2017.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333341",
        departureDate: "2026-10-18",
        returnDate: "2026-10-18",
        totalQuota: 12,
        availableSeats: 2,
        reservedQuota: 1,
        bookedQuota: 9,
        pricePerPax: 450000,
        status: "OPEN",
        dateText: "Minggu, 18 Okt 2026",
        departureTime: "Midnight 00:30 WIB",
        statusBadge: "Tersisa 2 Kursi Lagi!",
        isSoldOut: false,
      },
    ],
  },

  // 4. Labuan Bajo
  {
    id: "22222222-2222-2222-2222-222222222241",
    title: "Labuan Bajo Komodo Phinisi Sail 3D2N AC Cabin",
    slug: "labuan-bajo-komodo-phinisi",
    category: "open_trip",
    categoryLabel: "Liveaboard",
    duration_days: 3,
    duration_nights: 2,
    durationLabel: "3 Hari 2 Malam",
    destination_city: "Labuan Bajo",
    meeting_point: "Pelabuhan Marina Labuan Bajo / Bandara Komodo (LBJ)",
    description:
      "Jelajahi keajaiban purba Pulau Komodo, trekking puncak Pulau Padar, bersantai di Pantai Pink, berenang bersama pari Manta di Manta Point, dan nikmati menginap di kabin ber-AC kapal Phinisi kayu tradisional.",
    itinerary: [
      { time: "Hari 1", activity: "Boarding Kapal Phinisi, Pulau Kelor, Snorkeling Menjerite, Sunset Pulau Kalong" },
      { time: "Hari 2", activity: "Trekking Sunrise Pulau Padar, Pink Beach, Berburu Komodo di Pulau Komodo, Taka Makassar" },
      { time: "Hari 3", activity: "Manta Point Snorkeling, Pulau Kanawa, Kembali ke Pelabuhan Marina Labuan Bajo" },
    ],
    facilities_included: [
      "Kabin AC Phinisi Selama 3 Hari 2 Malam",
      "Makan 7x Menu Nusantara oleh Chef on Board",
      "Alat Snorkeling dan Pelampung Lengkap",
      "Dokumentasi Foto Drone dan Go Pro",
      "Ranger Komodo dan Guide HPI",
    ],
    facilities_excluded: ["Tiket Masuk TN Komodo", "Tiket Pesawat ke Labuan Bajo", "Tips Kru Kapal"],
    cancellation_policy: "Reschedule gratis hingga H-14. Pembatalan H-7 tidak dapat di-refund.",
    thumbnail_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 3200000,
    pricePerPax: 2850000,
    rating: 4.9,
    reviewCount: 420,
    vehicleType: "Phinisi Superior AC",
    agent: {
      id: "11111111-1111-1111-1111-111111111113",
      business_name: "Flores Bahari Mandiri",
      slug: "flores-bahari",
      city: "Labuan Bajo",
      office_address: "Jl. Soekarno Hatta No. 88, Labuan Bajo, Nusa Tenggara Timur",
      whatsapp_number: "082145678901",
      bank_name: "BNI",
      bank_account_number: "0398217345",
      bank_account_name: "Maria Fransiska",
      description: "Spesialis liveaboard Phinisi mewah, island hopping Taman Nasional Komodo, dan diving charter Labuan Bajo.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333351",
        departureDate: "2026-10-23",
        returnDate: "2026-10-25",
        totalQuota: 16,
        availableSeats: 4,
        reservedQuota: 2,
        bookedQuota: 10,
        pricePerPax: 2850000,
        status: "OPEN",
        dateText: "Jumat, 23 Okt 2026",
        departureTime: "Pagi 08:30 WITA",
        statusBadge: "Tersisa 4 Kabin",
        isSoldOut: false,
      },
    ],
  },

  // 5. Kawah Ijen
  {
    id: "22222222-2222-2222-2222-222222222251",
    title: "Kawah Ijen Blue Fire & Kawah Wurung Midnight",
    slug: "kawah-ijen-blue-fire",
    category: "open_trip",
    categoryLabel: "Midnight Tour",
    duration_days: 1,
    duration_nights: 0,
    durationLabel: "1 Hari / Midnight",
    destination_city: "Banyuwangi",
    meeting_point: "Stasiun Banyuwangi Kota / Karangasem",
    description:
      "Menyaksikan langsung fenomena langka api biru elektrik abadi di kawah asam terbesar di dunia, pemandangan danau toska vulkanik, dan savana Kawah Wurung yang eksotis.",
    itinerary: [
      { time: "00:00", activity: "Penjemputan di Stasiun Banyuwangi Kota" },
      { time: "01:30", activity: "Tiba di Pos Paltuding dan briefing keselamatan" },
      { time: "02:00", activity: "Mulai pendakian 3 km menuju bibir kawah Ijen" },
      { time: "04:00", activity: "Eksplorasi Blue Fire dan danau belerang" },
      { time: "06:30", activity: "Momen sunrise di puncak kawah Ijen" },
      { time: "09:00", activity: "Kunjungan ke Savana Kawah Wurung dan pengantaran pulang" },
    ],
    facilities_included: [
      "Transportasi PP Stasiun / Hotel Banyuwangi",
      "Tiket Masuk Cagar Alam Kawah Ijen",
      "Masker Gas Respirator Standar",
      "Senter Kepala dan Pemandu Lokal",
    ],
    facilities_excluded: ["Troli Dorong / Becak Ijen", "Makan Pribadi"],
    cancellation_policy: "Pembatalan sebelum 24 jam bebas biaya.",
    thumbnail_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 450000,
    pricePerPax: 380000,
    rating: 4.8,
    reviewCount: 189,
    vehicleType: "Transport PP Stasiun",
    agent: {
      id: "11111111-1111-1111-1111-111111111114",
      business_name: "Osing Heritage Travel",
      slug: "osing-heritage",
      city: "Banyuwangi",
      office_address: "Jl. Basuki Rahmat No. 12, Banyuwangi, Jawa Timur",
      whatsapp_number: "085234567812",
      bank_name: "BRI",
      bank_account_number: "002101039821509",
      bank_account_name: "Slamet Supratman",
      description: "Pemandu resmi pendakian api biru Kawah Ijen, safari savana Baluran, dan eksplorasi budaya suku Osing.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333361",
        departureDate: "2026-10-22",
        returnDate: "2026-10-22",
        totalQuota: 18,
        availableSeats: 5,
        reservedQuota: 3,
        bookedQuota: 10,
        pricePerPax: 380000,
        status: "OPEN",
        dateText: "Kamis, 22 Okt 2026",
        departureTime: "Midnight 00:00 WIB",
        statusBadge: "Tersisa 5 Kursi",
        isSoldOut: false,
      },
    ],
  },

  // 6. Karimunjawa
  {
    id: "22222222-2222-2222-2222-222222222281",
    title: "Eksotisme Karimunjawa Bahari 3D2N Full Snorkeling",
    slug: "karimunjawa-bahari-snorkeling",
    category: "open_trip",
    categoryLabel: "Bahari Trip",
    duration_days: 3,
    duration_nights: 2,
    durationLabel: "3 Hari 2 Malam",
    destination_city: "Jepara",
    meeting_point: "Pelabuhan Kartini Jepara",
    description:
      "Surga bahari Jawa Tengah: snorkeling bersama hiu jinak di Menjangan Besar, penangkaran penyu, terumbu karang warna-warni Pulau Cemara Kecil, dan sunset di Pantai Ujung Gelam.",
    itinerary: [
      { time: "Hari 1", activity: "Kapal Cepat Express Bahari ke Karimunjawa, Check-in Penginapan AC, Sunset Pantai Batu Topeng" },
      { time: "Hari 2", activity: "Tur Perahu ke Pulau Menjangan Kecil Snorkeling, Santap Ikan Bakar di Pantai Cemara, Penangkaran Hiu" },
      { time: "Hari 3", activity: "Belanja Souvenir Khas, Kembali dengan Kapal Cepat ke Jepara" },
    ],
    facilities_included: [
      "Tiket Kapal Express Bahari PP",
      "Penginapan AC 2 Malam di Karimunjawa",
      "Perahu Wisata Snorkeling",
      "Alat Snorkeling dan Pelampung",
      "Makan 6x Termasuk BBQ Ikan Bakar",
      "Dokumentasi Foto Underwater",
    ],
    facilities_excluded: ["Transportasi Menuju Pelabuhan Kartini Jepara", "Pengeluaran Pribadi"],
    cancellation_policy: "Jadwal keberangkatan pasti hari Jumat dan Sabtu setiap pekan.",
    thumbnail_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 1450000,
    pricePerPax: 1250000,
    rating: 4.9,
    reviewCount: 312,
    vehicleType: "Express Bahari PP",
    agent: {
      id: "11111111-1111-1111-1111-111111111117",
      business_name: "Karimun Wave Explorer",
      slug: "karimun-wave",
      city: "Jepara",
      office_address: "Jl. Kartini No. 25, Pelabuhan Kartini, Jepara, Jawa Tengah",
      whatsapp_number: "082233445566",
      bank_name: "Mandiri",
      bank_account_number: "1350029384721",
      bank_account_name: "Ahmad Dani",
      description: "Paket wisata bahari lengkap Karimunjawa: snorkeling terumbu karang, hopping island, dan kapal cepat Express Bahari.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333391",
        departureDate: "2026-10-28",
        returnDate: "2026-10-30",
        totalQuota: 20,
        availableSeats: 8,
        reservedQuota: 2,
        bookedQuota: 10,
        pricePerPax: 1250000,
        status: "OPEN",
        dateText: "Rabu, 28 Okt 2026",
        departureTime: "Pagi 09:00 WIB",
        statusBadge: "Tersisa 8 Kursi",
        isSoldOut: false,
      },
    ],
  },

  // 7. Dieng
  {
    id: "22222222-2222-2222-2222-222222222261",
    title: "Dieng Golden Sunrise Sikunir & Telaga Warna 2D1N",
    slug: "dieng-golden-sunrise-highlands",
    category: "open_trip",
    categoryLabel: "Culture & Nature",
    duration_days: 2,
    duration_nights: 1,
    durationLabel: "2 Hari 1 Malam",
    destination_city: "Yogyakarta",
    meeting_point: "Stasiun Tugu Jogja / Alun-alun Wonosobo",
    description:
      "Menikmati keindahan negeri di atas awan, pesona telaga multiwarna, kawah vulkanik aktif Sikidang, kemegahan Candi Arjuna, dan golden sunrise spektakuler dari puncak bukit Sikunir.",
    itinerary: [
      { time: "Hari 1", activity: "Penjemputan di Jogja/Wonosobo, Candi Arjuna, Kawah Sikidang, Telaga Warna, Check-in Homestay Dieng" },
      { time: "Hari 2", activity: "Trekking Golden Sunrise Bukit Sikunir, Sarapan Mie Ongklok Khas Wonosobo, Gardu Pandang Tieng, Kembali" },
    ],
    facilities_included: [
      "Transport Shuttle AC",
      "Homestay 1 Malam di Dieng",
      "Tiket Seluruh Objek Wisata",
      "Makan 3x Termasuk Mie Ongklok Khas",
      "Pemandu Lokal Berpengalaman",
    ],
    facilities_excluded: ["Pengeluaran Pribadi", "Tips Sukarela"],
    cancellation_policy: "Pembatalan H-3 uang kembali 50%.",
    thumbnail_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 750000,
    pricePerPax: 650000,
    rating: 4.7,
    reviewCount: 142,
    vehicleType: "Homestay + Mie Ongklok",
    agent: {
      id: "11111111-1111-1111-1111-111111111115",
      business_name: "Laras Dieng Adventure",
      slug: "wonoland-dieng",
      city: "Wonosobo",
      office_address: "Jl. Raya Dieng KM 15, Kejajar, Wonosobo, Jawa Tengah",
      whatsapp_number: "087812345678",
      bank_name: "BCA",
      bank_account_number: "1692019482",
      bank_account_name: "Teguh Prasetyo",
      description: "Mitra terpercaya eksplorasi dataran tinggi Dieng, sunrise Sikunir, kawah vulkanik, dan festival budaya.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333371",
        departureDate: "2026-10-31",
        returnDate: "2026-11-01",
        totalQuota: 15,
        availableSeats: 3,
        reservedQuota: 1,
        bookedQuota: 11,
        pricePerPax: 650000,
        status: "OPEN",
        dateText: "Sabtu, 31 Okt 2026",
        departureTime: "Pagi 07:00 WIB",
        statusBadge: "Tersisa 3 Kursi",
        isSoldOut: false,
      },
    ],
  },

  // 8. Derawan
  {
    id: "22222222-2222-2222-2222-222222222291",
    title: "Derawan & Maratua Island Hopping Paradise 4D3N",
    slug: "derawan-maratua-island-hopping",
    category: "open_trip",
    categoryLabel: "Island Hopping",
    duration_days: 4,
    duration_nights: 3,
    durationLabel: "4 Hari 3 Malam",
    destination_city: "Berau",
    meeting_point: "Bandara Kalimarau Berau (BEJ) / Pelabuhan Tanjung Batu",
    description:
      "Sensasi berenang bersama ribuan ubur-ubur tanpa racun di Danau Kakaban, menyelami keindahan gua air biru Haji Mangku Maratua, dan snorkeling bersama pari manta di Sangalaki.",
    itinerary: [
      { time: "Hari 1", activity: "Penjemputan Bandara Berau, Speedboat ke Pulau Derawan, Sunset Dermaga Kayu" },
      { time: "Hari 2", activity: "Island Hopping Maratua Paradise, Snorkeling Palung Laut, Gua Haji Mangku, Danau Ubur-ubur Kakaban" },
      { time: "Hari 3", activity: "Manta Point Sangalaki, Penangkaran Penyu Hijau, Spot Gosong Pasir" },
      { time: "Hari 4", activity: "Speedboat kembali ke Berau dan pengantaran bandara" },
    ],
    facilities_included: [
      "Speedboat Carter Selama 4 Hari",
      "Water Villa / Resort AC 3 Malam di Derawan",
      "Makan 9x Menu Seafood Nusantara",
      "Tiket Masuk Seluruh Pulau dan Retribusi",
      "Alat Snorkeling Lengkap dan Pelampung",
      "Pemandu Lokal dan Dokumentasi Drone",
    ],
    facilities_excluded: ["Tiket Pesawat ke Berau", "Pengeluaran Pribadi"],
    cancellation_policy: "Pembatalan hingga H-7 mendapatkan pengembalian 50%.",
    thumbnail_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery_urls: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    ],
    originalPrice: 2800000,
    pricePerPax: 2450000,
    rating: 4.9,
    reviewCount: 98,
    vehicleType: "Speedboat & Water Villa",
    agent: {
      id: "11111111-1111-1111-1111-111111111118",
      business_name: "Borneo Sea Expeditions",
      slug: "borneo-sea",
      city: "Berau",
      office_address: "Jl. SA Maulana No. 101, Tanjung Redeb, Berau, Kalimantan Timur",
      whatsapp_number: "085311223344",
      bank_name: "BNI",
      bank_account_number: "0821948201",
      bank_account_name: "Haryanto",
      description: "Penyelenggara trip kepulauan Derawan, Maratua, Sangalaki, dan snorkeling danau ubur-ubur tanpa sengat Kakaban.",
      is_verified: true,
    },
    schedules: [
      {
        id: "33333333-3333-3333-3333-333333333399",
        departureDate: "2026-11-05",
        returnDate: "2026-11-08",
        totalQuota: 16,
        availableSeats: 6,
        reservedQuota: 0,
        bookedQuota: 10,
        pricePerPax: 2450000,
        status: "OPEN",
        dateText: "Kamis, 05 Nov 2026",
        departureTime: "Pagi 09:30 WITA",
        statusBadge: "Tersisa 6 Kursi",
        isSoldOut: false,
      },
    ],
  },
];

export function findCatalogPackage(agentSlug: string, packageSlug: string): CatalogPackage | undefined {
  const normAgent = (agentSlug || "").toLowerCase();
  const normPkg = (packageSlug || "").toLowerCase();

  // 1. Exact match agent and package
  const exact = CATALOG_PACKAGES.find(
    (p) => p.agent.slug.toLowerCase() === normAgent && p.slug.toLowerCase() === normPkg
  );
  if (exact) return exact;

  // 2. Fallback match by package slug (guarantees accessibility even if legacy URL uses different agent slug)
  return CATALOG_PACKAGES.find((p) => p.slug.toLowerCase() === normPkg);
}

export function findCatalogAgent(agentSlug: string) {
  const match = CATALOG_PACKAGES.find((p) => p.agent.slug.toLowerCase() === agentSlug.toLowerCase());
  if (!match) return undefined;
  return {
    ...match.agent,
    packages: CATALOG_PACKAGES.filter((p) => p.agent.slug.toLowerCase() === agentSlug.toLowerCase()),
  };
}

export function findCatalogPackageByScheduleId(scheduleId: string): { pkg: CatalogPackage; schedule: CatalogSchedule } | undefined {
  for (const pkg of CATALOG_PACKAGES) {
    const sch = pkg.schedules.find((s) => s.id === scheduleId);
    if (sch) return { pkg, schedule: sch };
  }
  return undefined;
}

