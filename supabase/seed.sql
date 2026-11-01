-- ==============================================================================
-- Nusabook Rich Database Seeding
-- 8 Verified Travel Agencies across Indonesia with Rich Packages, Schedules,
-- Sample Bookings, Passenger Manifests, and Payout Records.
-- Idempotent: Can be safely re-run multiple times (ON CONFLICT DO NOTHING).
-- ==============================================================================

DO $$
DECLARE
    -- Agent 1: Pesona Merapi (Yogyakarta / Sleman)
    v_u1 UUID := '00000000-0000-0000-0000-000000000001';
    v_a1 UUID := '11111111-1111-1111-1111-111111111111';
    v_p1_1 UUID := '22222222-2222-2222-2222-222222222222';
    v_p1_2 UUID := '22222222-2222-2222-2222-222222222223';
    v_s1_1 UUID := '33333333-3333-3333-3333-333333333333';
    v_s1_2 UUID := '33333333-3333-3333-3333-333333333334';
    v_b1_1 UUID := '44444444-4444-4444-4444-444444444441';

    -- Agent 2: Bromo Overland Adventure (Malang)
    v_u2 UUID := '00000000-0000-0000-0000-000000000002';
    v_a2 UUID := '11111111-1111-1111-1111-111111111112';
    v_p2_1 UUID := '22222222-2222-2222-2222-222222222231';
    v_p2_2 UUID := '22222222-2222-2222-2222-222222222232';
    v_s2_1 UUID := '33333333-3333-3333-3333-333333333341';
    v_s2_2 UUID := '33333333-3333-3333-3333-333333333342';
    v_b2_1 UUID := '44444444-4444-4444-4444-444444444442';

    -- Agent 3: Flores Bahari Mandiri (Labuan Bajo)
    v_u3 UUID := '00000000-0000-0000-0000-000000000003';
    v_a3 UUID := '11111111-1111-1111-1111-111111111113';
    v_p3_1 UUID := '22222222-2222-2222-2222-222222222241';
    v_p3_2 UUID := '22222222-2222-2222-2222-222222222242';
    v_s3_1 UUID := '33333333-3333-3333-3333-333333333351';
    v_s3_2 UUID := '33333333-3333-3333-3333-333333333352';
    v_b3_1 UUID := '44444444-4444-4444-4444-444444444443';

    -- Agent 4: Osing Heritage Travel (Banyuwangi)
    v_u4 UUID := '00000000-0000-0000-0000-000000000004';
    v_a4 UUID := '11111111-1111-1111-1111-111111111114';
    v_p4_1 UUID := '22222222-2222-2222-2222-222222222251';
    v_p4_2 UUID := '22222222-2222-2222-2222-222222222252';
    v_s4_1 UUID := '33333333-3333-3333-3333-333333333361';

    -- Agent 5: Laras Dieng Adventure (Wonosobo / Dieng)
    v_u5 UUID := '00000000-0000-0000-0000-000000000005';
    v_a5 UUID := '11111111-1111-1111-1111-111111111115';
    v_p5_1 UUID := '22222222-2222-2222-2222-222222222261';
    v_s5_1 UUID := '33333333-3333-3333-3333-333333333371';

    -- Agent 6: Borobudur Sunrise Tour (Magelang)
    v_u6 UUID := '00000000-0000-0000-0000-000000000006';
    v_a6 UUID := '11111111-1111-1111-1111-111111111116';
    v_p6_1 UUID := '22222222-2222-2222-2222-222222222271';
    v_s6_1 UUID := '33333333-3333-3333-3333-333333333381';

    -- Agent 7: Karimun Wave Explorer (Jepara)
    v_u7 UUID := '00000000-0000-0000-0000-000000000007';
    v_a7 UUID := '11111111-1111-1111-1111-111111111117';
    v_p7_1 UUID := '22222222-2222-2222-2222-222222222281';
    v_s7_1 UUID := '33333333-3333-3333-3333-333333333391';

    -- Agent 8: Borneo Sea Expeditions (Berau)
    v_u8 UUID := '00000000-0000-0000-0000-000000000008';
    v_a8 UUID := '11111111-1111-1111-1111-111111111118';
    v_p8_1 UUID := '22222222-2222-2222-2222-222222222291';
    v_s8_1 UUID := '33333333-3333-3333-3333-333333333399';

BEGIN
    -- ==============================================================================
    -- 0. Seed Auth Users (Satisfy profiles foreign key)
    -- ==============================================================================
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
        VALUES
            (v_u1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'budi@pesonamerapi.id', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Budi Santoso"}'::jsonb, NOW(), NOW()),
            (v_u2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'arya@bromooverland.com', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Raden Arya"}'::jsonb, NOW(), NOW()),
            (v_u3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maria@floresbahari.id', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Maria Fransiska"}'::jsonb, NOW(), NOW()),
            (v_u4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slamet@osingheritage.com', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Slamet Supratman"}'::jsonb, NOW(), NOW()),
            (v_u5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teguh@wonolanddieng.id', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Teguh Prasetyo"}'::jsonb, NOW(), NOW()),
            (v_u6, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'aminah@borobudursunrise.id', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Siti Aminah"}'::jsonb, NOW(), NOW()),
            (v_u7, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dani@karimunwave.com', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Ahmad Dani"}'::jsonb, NOW(), NOW()),
            (v_u8, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'haryanto@borneosea.id', '', NOW(), '{"provider":"email"}'::jsonb, '{"full_name":"Haryanto"}'::jsonb, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- ==============================================================================
    -- 1. Seed Profiles
    -- ==============================================================================
    INSERT INTO profiles (id, full_name, phone_number, role)
    VALUES
        (v_u1, 'Budi Santoso (Pesona Merapi)', '081234567890', 'agent_owner'),
        (v_u2, 'Raden Arya (Bromo Overland)', '081398765432', 'agent_owner'),
        (v_u3, 'Maria Fransiska (Flores Bahari)', '082145678901', 'agent_owner'),
        (v_u4, 'Slamet Supratman (Osing Heritage)', '085234567812', 'agent_owner'),
        (v_u5, 'Teguh Prasetyo (Laras Dieng)', '087812345678', 'agent_owner'),
        (v_u6, 'Siti Aminah (Borobudur Sunrise)', '081298765411', 'agent_owner'),
        (v_u7, 'Ahmad Dani (Karimun Wave)', '082233445566', 'agent_owner'),
        (v_u8, 'Haryanto (Borneo Sea)', '085311223344', 'agent_owner')
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 2. Seed Travel Agents (8 Verified Agencies)
    -- ==============================================================================
    INSERT INTO travel_agents (
        id, owner_id, business_name, slug, description, office_address, city,
        whatsapp_number, instagram_handle, bank_name, bank_account_number, bank_account_name, is_verified, is_active
    ) VALUES
        (
            v_a1, v_u1, 'Pesona Merapi Tour & Travel', 'pesona-merapi',
            'Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.',
            'Jl. Kaliurang KM 21, Sleman, D.I. Yogyakarta', 'Sleman',
            '081234567890', '@pesonamerapi.trip', 'BCA', '8820192831', 'Budi Santoso', TRUE, TRUE
        ),
        (
            v_a2, v_u2, 'Bromo Overland Adventure', 'bromo-overland',
            'Operator spesialis ekspedisi Gunung Bromo, sunrise hunter, dan overland Jawa Timur berpengalaman sejak 2017.',
            'Jl. Ijen No. 45, Klojen, Kota Malang, Jawa Timur', 'Malang',
            '081398765432', '@bromo.overland', 'Mandiri', '1440019283741', 'Raden Arya Pratama', TRUE, TRUE
        ),
        (
            v_a3, v_u3, 'Flores Bahari Mandiri', 'flores-bahari',
            'Spesialis liveaboard Phinisi mewah, island hopping Taman Nasional Komodo, dan diving charter Labuan Bajo.',
            'Jl. Soekarno Hatta No. 88, Labuan Bajo, Nusa Tenggara Timur', 'Labuan Bajo',
            '082145678901', '@floresbahari.sail', 'BNI', '0398217345', 'Maria Fransiska', TRUE, TRUE
        ),
        (
            v_a4, v_u4, 'Osing Heritage Travel', 'osing-heritage',
            'Pemandu resmi pendakian api biru Kawah Ijen, safari savana Baluran, dan eksplorasi budaya suku Osing.',
            'Jl. Basuki Rahmat No. 12, Banyuwangi, Jawa Timur', 'Banyuwangi',
            '085234567812', '@osingheritage.trip', 'BRI', '002101039821509', 'Slamet Supratman', TRUE, TRUE
        ),
        (
            v_a5, v_u5, 'Laras Dieng Adventure', 'wonoland-dieng',
            'Mitra terpercaya eksplorasi dataran tinggi Dieng, sunrise Sikunir, kawah vulkanik, dan festival budaya.',
            'Jl. Raya Dieng KM 15, Kejajar, Wonosobo, Jawa Tengah', 'Wonosobo',
            '087812345678', '@larasdieng.adv', 'BCA', '1692019482', 'Teguh Prasetyo', TRUE, TRUE
        ),
        (
            v_a6, v_u6, 'Borobudur Sunrise Tour', 'borobudur-sunrise',
            'Spesialis wisata budaya Candi Borobudur, Punthuk Setumbu, dan arung jeram Sungai Elo Magelang.',
            'Jl. Medang Kamulan No. 9, Borobudur, Magelang, Jawa Tengah', 'Magelang',
            '081298765411', '@borobudur.sunrise', 'BCA', '7310294821', 'Siti Aminah', TRUE, TRUE
        ),
        (
            v_a7, v_u7, 'Karimun Wave Explorer', 'karimun-wave',
            'Paket wisata bahari lengkap Karimunjawa: snorkeling terumbu karang, hopping island, dan kapal cepat Express Bahari.',
            'Jl. Kartini No. 25, Pelabuhan Kartini, Jepara, Jawa Tengah', 'Jepara',
            '082233445566', '@karimunwave.id', 'Mandiri', '1350029384721', 'Ahmad Dani', TRUE, TRUE
        ),
        (
            v_a8, v_u8, 'Borneo Sea Expeditions', 'borneo-sea',
            'Penyelenggara trip kepulauan Derawan, Maratua, Sangalaki, dan snorkeling danau ubur-ubur tanpa sengat Kakaban.',
            'Jl. SA Maulana No. 101, Tanjung Redeb, Berau, Kalimantan Timur', 'Berau',
            '085311223344', '@borneosea.exp', 'BNI', '0821948201', 'Haryanto', TRUE, TRUE
        )
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 3. Seed Tour Packages (Lengkap dengan Itinerary & Fasilitas)
    -- ==============================================================================
    INSERT INTO tour_packages (
        id, agent_id, title, slug, category, duration_days, duration_nights,
        destination_city, meeting_point, description, itinerary,
        facilities_included, facilities_excluded, cancellation_policy, thumbnail_url, is_published
    ) VALUES
        -- Agent 1 (Merapi)
        (
            v_p1_1, v_a1, 'Sunrise Lava Tour Merapi & Bunker Kaliadem', 'sunrise-lava-tour-merapi',
            'open_trip', 1, 0, 'Yogyakarta', 'Basecamp Jeep Kaliurang, Sleman',
            'Saksikan keindahan matahari terbit berlatar megahnya Gunung Merapi dilanjutkan petualangan menyusuri jejak erupsi dengan Jeep 4x4.',
            '[{"time": "04:00", "activity": "Kumpul di Basecamp Jeep dan pengarahan"}, {"time": "04:30", "activity": "Menuju Spot Sunrise Bunker Kaliadem"}, {"time": "06:30", "activity": "Kunjungan Museum Sisa Hartaku dan Batu Alien"}, {"time": "08:30", "activity": "Manuver Air Kali Kuning dan Selesai"}]'::JSONB,
            ARRAY['Jeep 4x4 dan Driver Berpengalaman', 'BBM dan Tiket Masuk Objek Wisata', 'Pemandu Lokal', 'Air Mineral dan Snack Ringan', 'Asuransi Jasa Raharja'],
            ARRAY['Pengeluaran Pribadi', 'Transportasi ke Meeting Point', 'Tips Sukarela Driver'],
            'Pembatalan hingga H-3 mendapatkan pengembalian 50%. Pembatalan kurang dari 48 jam tidak dapat di-refund.',
            'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80', TRUE
        ),
        (
            v_p1_2, v_a1, 'Private Heritage Sunset Ratu Boko & Candi Prambanan', 'private-heritage-ratu-boko',
            'private_trip', 1, 0, 'Yogyakarta', 'Hotel / Stasiun Tugu Yogyakarta',
            'Tur privat eksklusif mengunjungi mahakarya Candi Hindu termegah Prambanan dan menikmati senja dari gerbang Istana Ratu Boko.',
            '[{"time": "13:00", "activity": "Penjemputan di area Kota Yogyakarta"}, {"time": "14:00", "activity": "Eksplorasi Kompleks Candi Prambanan didampingi Kurator"}, {"time": "16:30", "activity": "Menuju Pelataran Candi Ratu Boko untuk Golden Sunset"}, {"time": "18:30", "activity": "Makan Malam Kuliner Khas Jogja dan Kembali ke Hotel"}]'::JSONB,
            ARRAY['Kendaraan MPV AC Bersih + BBM', 'Tiket Terusan Prambanan dan Ratu Boko', 'Pemandu Lisensi HPI', 'Air Mineral Dingin'],
            ARRAY['Pengeluaran Pribadi', 'Makan Malam'],
            'Pembatalan dapat dilakukan hingga H-2 dengan potongan biaya administrasi 20%.',
            'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 2 (Bromo)
        (
            v_p2_1, v_a2, 'Midnight Overland Bromo Sunrise & Savana Teletubbies', 'bromo-sunrise-savana-teletubbies',
            'open_trip', 1, 0, 'Malang', 'Stasiun Kota Malang / Area Kota Malang',
            'Petualangan legendaris menyambut fajar emas dari Penanjakan 1 Bromo, dilanjutkan kawah aktif, Pasir Berbisik, dan bukit Teletubbies.',
            '[{"time": "00:30", "activity": "Penjemputan di meeting point Kota Malang"}, {"time": "03:30", "activity": "Tiba di Rest Area Bromo dan pindah Jeep 4x4"}, {"time": "05:00", "activity": "Momen Golden Sunrise di Kingkong Hill"}, {"time": "07:00", "activity": "Trekking Kawah Bromo dan Pura Poten"}, {"time": "09:30", "activity": "Eksplorasi Pasir Berbisik dan Savana Hijau"}, {"time": "12:30", "activity": "Kembali tiba di Malang"}]'::JSONB,
            ARRAY['Jeep Hardtop 4x4 Terawat', 'Tiket Masuk Resmi TNBTS', 'Driver Berpengalaman sebagai Fotografer', 'Transport Shuttle PP Malang', 'Air Mineral'],
            ARRAY['Sewa Kuda di Kawah Bromo', 'Makan dan Jaket Hangat'],
            'Garansi berangkat setiap hari. Pembatalan H-1 dikenakan biaya 100%.',
            'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80', TRUE
        ),
        (
            v_p2_2, v_a2, 'Private Jeep Bromo Milky Way Stargazing & Kawah Bromo', 'private-bromo-milky-way',
            'private_trip', 1, 0, 'Malang', 'Bandara Juanda / Hotel Kota Malang',
            'Pengalaman astronomi eksklusif memotret gugusan bintang Bima Sakti di lautan pasir kaldera Bromo didampingi fotografer profesional.',
            '[{"time": "22:00", "activity": "Penjemputan khusus privat di Surabaya/Malang"}, {"time": "01:30", "activity": "Sesi pemotretan astrofotografi Milky Way di Lautan Pasir"}, {"time": "04:30", "activity": "Menuju Spot Sunrise Privat Seruni Point"}, {"time": "08:00", "activity": "Kawah Bromo dan Sarapan Hangat Kaldera"}]'::JSONB,
            ARRAY['Jeep Khusus Privat', 'Fotografer dan File RAW/JPEG', 'Tiket Masuk TNBTS', 'Minuman Hangat dan Sarapan'],
            ARRAY['Perlengkapan Pribadi'],
            'Pembatalan hingga H-3 mendapatkan pengembalian 70%.',
            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 3 (Labuan Bajo)
        (
            v_p3_1, v_a3, 'Labuan Bajo Komodo Phinisi Sail 3D2N AC Cabin', 'labuan-bajo-phinisi-sail-3d2n',
            'open_trip', 3, 2, 'Labuan Bajo', 'Bandara Komodo (LBJ) / Pelabuhan Marina',
            'Jelajahi keajaiban purba Pulau Komodo, puncak ikonik Pulau Padar, pantai pasir merah muda, dan berenang bersama pari Manta.',
            '[{"time": "Hari 1", "activity": "Boarding Kapal Phinisi, Pulau Kelor, Menjerite Snorkeling, Sunset Pulau Kalong"}, {"time": "Hari 2", "activity": "Trekking Sunrise Pulau Padar, Pink Beach, Berburu Komodo di Pulau Komodo, Taka Makassar"}, {"time": "Hari 3", "activity": "Manta Point, Pulau Kanawa Snorkeling, Kembali ke Labuan Bajo"}]'::JSONB,
            ARRAY['Kabin AC Phinisi Selama 3 Hari 2 Malam', 'Makan 7x Chef on Board', 'Alat Snorkeling dan Pelampung', 'Dokumentasi Drone dan Go Pro', 'Ranger Komodo'],
            ARRAY['Tiket Masuk Taman Nasional Komodo', 'Tiket Pesawat ke Labuan Bajo', 'Tipping Kru Kapal'],
            'Reschedule gratis hingga H-14. Pembatalan H-7 tidak dapat di-refund.',
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', TRUE
        ),
        (
            v_p3_2, v_a3, 'One Day Speedboat Padar Pink Beach & Manta Point', 'one-day-speedboat-komodo',
            'open_trip', 1, 0, 'Labuan Bajo', 'Pelabuhan Marina Labuan Bajo',
            'Jelajahi 6 destinasi terbaik Taman Nasional Komodo dalam satu hari penuh dengan speedboat berkecepatan tinggi.',
            '[{"time": "05:30", "activity": "Meeting point di Pelabuhan Marina"}, {"time": "07:00", "activity": "Trekking Puncak Pulau Padar"}, {"time": "09:30", "activity": "Pink Beach dan Snorkeling"}, {"time": "11:30", "activity": "Pulau Komodo dan Makan Siang Lunchbox"}, {"time": "13:30", "activity": "Taka Makassar dan Manta Point"}, {"time": "16:00", "activity": "Pulau Kanawa dan Kembali ke Labuan Bajo"}]'::JSONB,
            ARRAY['Speedboat 3x 250HP Berstandar Keselamatan', 'Makan Siang Lunchbox', 'Air Mineral dan Buah', 'Alat Snorkeling', 'Guide Berlisensi'],
            ARRAY['Tiket Masuk TN Komodo', 'Keperluan Pribadi'],
            'Pembatalan H-2 pengembalian 50%.',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 4 (Banyuwangi)
        (
            v_p4_1, v_a4, 'Kawah Ijen Blue Fire & Kawah Wurung Midnight', 'kawah-ijen-blue-fire-midnight',
            'open_trip', 1, 0, 'Banyuwangi', 'Stasiun Banyuwangi Kota / Karangasem',
            'Menyaksikan fenomena langka api biru abadi di kawah asam terbesar di dunia, panorama danau toska, dan savana Kawah Wurung.',
            '[{"time": "00:00", "activity": "Penjemputan di Stasiun Banyuwangi"}, {"time": "01:30", "activity": "Tiba di Pos Paltuding dan briefing keselamatan"}, {"time": "02:00", "activity": "Mulai pendakian 3 km menuju puncak Ijen"}, {"time": "04:00", "activity": "Eksplorasi Blue Fire dan Danau Kawah Belerang"}, {"time": "06:30", "activity": "Sunrise di bibir kawah Ijen"}, {"time": "09:00", "activity": "Kunjungan ke Savana Kawah Wurung dan Kembali"}]'::JSONB,
            ARRAY['Transportasi PP Stasiun / Hotel Banyuwangi', 'Tiket Masuk Cagar Alam Kawah Ijen', 'Masker Gas Respirator Standar', 'Senter Kepala', 'Guide Lokal'],
            ARRAY['Troli Dorong / Becak Ijen', 'Makan Pribadi'],
            'Pembatalan sebelum 24 jam bebas biaya.',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', TRUE
        ),
        (
            v_p4_2, v_a4, 'Baluran Africa Van Java Safari & Pantai Bama', 'baluran-safari-pantai-bama',
            'open_trip', 1, 0, 'Banyuwangi', 'Pusat Kota Banyuwangi',
            'Jelajahi savana terluas di Jawa dengan latar Gunung Baluran, berjumpa kawanan banteng liar, rusa, burung merak, dan pantai mangrove.',
            '[{"time": "07:30", "activity": "Penjemputan di Kota Banyuwangi"}, {"time": "09:00", "activity": "Memasuki Savana Bekol dan observasi satwa"}, {"time": "11:30", "activity": "Menuju Menara Pandang Savana Baluran"}, {"time": "13:00", "activity": "Eksplorasi Pantai Bama dan Hutan Mangrove"}, {"time": "15:30", "activity": "Perjalanan kembali ke Banyuwangi"}]'::JSONB,
            ARRAY['Mobil Wisata AC', 'Tiket Masuk TN Baluran', 'Guide Lokal', 'Air Mineral'],
            ARRAY['Makan Siang Pribadi'],
            'Pembatalan H-1 dapat dialihkan tanggal lain.',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 5 (Dieng)
        (
            v_p5_1, v_a5, 'Dieng Golden Sunrise Sikunir & Telaga Warna 2D1N', 'dieng-golden-sunrise-sikunir',
            'open_trip', 2, 1, 'Yogyakarta', 'Stasiun Tugu / Kota Wonosobo',
            'Menikmati keindahan negeri di atas awan, pesona telaga multiwarna, kawah vulkanik aktif Sikidang, dan kemegahan Candi Arjuna.',
            '[{"time": "Hari 1", "activity": "Penjemputan di Jogja / Wonosobo, Candi Arjuna, Kawah Sikidang, Telaga Warna, Check-in Homestay Dieng"}, {"time": "Hari 2", "activity": "Trekking Golden Sunrise Bukit Sikunir, Sarapan Mie Ongklok Khas Wonosobo, Gardu Pandang Tieng, Kembali"}]'::JSONB,
            ARRAY['Transport Shuttle AC', 'Homestay 1 Malam di Dieng', 'Tiket Seluruh Objek Wisata', 'Makan 3x Termasuk Mie Ongklok', 'Guide Lokal'],
            ARRAY['Pengeluaran Pribadi', 'Tips Sukarela'],
            'Pembatalan H-3 uang kembali 50%.',
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 6 (Borobudur / Magelang)
        (
            v_p6_1, v_a6, 'Private Premium Trip Candi Borobudur & Punthuk Setumbu', 'borobudur-punthuk-setumbu',
            'private_trip', 1, 0, 'Magelang', 'Stasiun Tugu Jogja / Kota Magelang',
            'Pengalaman privat eksklusif melihat kabut fajar Candi Borobudur dari bukit Punthuk Setumbu dilanjutkan tur naik ke struktur candi.',
            '[{"time": "04:00", "activity": "Penjemputan dan menuju Bukit Punthuk Setumbu"}, {"time": "05:00", "activity": "Menyaksikan Siluet Borobudur di Fajar Pagi"}, {"time": "07:00", "activity": "Sarapan Tradisional Resto Desa Wisata"}, {"time": "08:30", "activity": "Tur Eksklusif Naik Struktur Candi Borobudur didampingi Pamong Budaya"}, {"time": "11:30", "activity": "Kembali ke kota asal"}]'::JSONB,
            ARRAY['Mobil Privat AC Bersih + BBM', 'Tiket Sunrise Punthuk Setumbu', 'Tiket Naik Struktur Candi Borobudur Resmi', 'Pamong Budaya Berlisensi', 'Sarapan Pagi'],
            ARRAY['Pengeluaran Pribadi'],
            'Pembatalan H-2 dikenakan administrasi 20%.',
            'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 7 (Karimunjawa)
        (
            v_p7_1, v_a7, 'Eksotisme Karimunjawa Bahari 3D2N Full Snorkeling', 'karimunjawa-bahari-3d2n',
            'open_trip', 3, 2, 'Jepara', 'Pelabuhan Kartini Jepara',
            'Surga bahari Jawa Tengah: snorkeling bersama hiu jinak, penangkaran penyu, terumbu karang warna-warni, dan sunset di Pantai Ujung Gelam.',
            '[{"time": "Hari 1", "activity": "Kapal Cepat Express Bahari ke Karimunjawa, Check-in Penginapan AC, Sunset Pantai Batu Topeng"}, {"time": "Hari 2", "activity": "Tur Perahu ke Pulau Menjangan Kecil Snorkeling, Santap Ikan Bakar di Pantai Cemara, Penangkaran Hiu"}, {"time": "Hari 3", "activity": "Belanja Souvenir Khas, Kembali dengan Kapal Cepat ke Jepara"}]'::JSONB,
            ARRAY['Tiket Kapal Express Bahari PP', 'Penginapan AC 2 Malam', 'Perahu Wisata Snorkeling', 'Alat Snorkeling dan Pelampung', 'Makan 6x Termasuk BBQ Ikan', 'Dokumentasi Underwater'],
            ARRAY['Transportasi Menuju Pelabuhan Kartini Jepara', 'Pengeluaran Pribadi'],
            'Jadwal keberangkatan pasti hari Jumat dan Sabtu setiap pekan.',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', TRUE
        ),

        -- Agent 8 (Derawan)
        (
            v_p8_1, v_a8, 'Derawan & Maratua Island Hopping Paradise 4D3N', 'derawan-maratua-paradise-4d3n',
            'open_trip', 4, 3, 'Berau', 'Bandara Kalimarau Berau (BEJ)',
            'Sensasi berenang bersama ubur-ubur tanpa racun di Danau Kakaban, gua air biru Haji Mangku Maratua, dan snorkeling pari manta Sangalaki.',
            '[{"time": "Hari 1", "activity": "Penjemputan Bandara Berau, Speedboat ke Pulau Derawan, Sunset Dermaga Kayu"}, {"time": "Hari 2", "activity": "Island Hopping Maratua Paradise, Snorkeling Palung Laut, Gua Haji Mangku, Danau Ubur-ubur Kakaban"}, {"time": "Hari 3", "activity": "Manta Point Sangalaki, Penangkaran Penyu Hijau, Spot Gosong Pasir"}, {"time": "Hari 4", "activity": "Speedboat kembali ke Berau dan pengantaran bandara"}]'::JSONB,
            ARRAY['Speedboat Carter Selama 4 Hari', 'Water Villa / Resort AC 3 Malam', 'Makan 9x Menu Seafood', 'Tiket Masuk Seluruh Pulau', 'Alat Snorkeling Lengkap', 'Guide Lokal dan Drone'],
            ARRAY['Tiket Pesawat ke Berau', 'Pengeluaran Pribadi'],
            'Pembatalan hingga H-7 mendapatkan pengembalian 50%.',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', TRUE
        )
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 4. Seed Trip Schedules (Active Dates with Dynamic Capacities)
    -- ==============================================================================
    INSERT INTO trip_schedules (
        id, package_id, departure_date, return_date, total_quota, reserved_quota, booked_quota, price_per_pax, status
    ) VALUES
        -- Merapi
        (v_s1_1, v_p1_1, CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '5 day', 12, 2, 4, 250000.00, 'OPEN'),
        (v_s1_2, v_p1_2, CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '7 day', 6, 0, 2, 450000.00, 'OPEN'),
        -- Bromo
        (v_s2_1, v_p2_1, CURRENT_DATE + INTERVAL '3 day', CURRENT_DATE + INTERVAL '3 day', 12, 1, 9, 450000.00, 'OPEN'),
        (v_s2_2, v_p2_2, CURRENT_DATE + INTERVAL '10 day', CURRENT_DATE + INTERVAL '10 day', 5, 0, 0, 1250000.00, 'OPEN'),
        -- Labuan Bajo
        (v_s3_1, v_p3_1, CURRENT_DATE + INTERVAL '6 day', CURRENT_DATE + INTERVAL '8 day', 16, 2, 10, 2850000.00, 'OPEN'),
        (v_s3_2, v_p3_2, CURRENT_DATE + INTERVAL '4 day', CURRENT_DATE + INTERVAL '4 day', 20, 0, 15, 1350000.00, 'OPEN'),
        -- Banyuwangi
        (v_s4_1, v_p4_1, CURRENT_DATE + INTERVAL '2 day', CURRENT_DATE + INTERVAL '2 day', 18, 3, 10, 380000.00, 'OPEN'),
        -- Dieng
        (v_s5_1, v_p5_1, CURRENT_DATE + INTERVAL '8 day', CURRENT_DATE + INTERVAL '9 day', 15, 1, 11, 650000.00, 'OPEN'),
        -- Magelang / Borobudur
        (v_s6_1, v_p6_1, CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '5 day', 8, 0, 4, 650000.00, 'OPEN'),
        -- Karimunjawa
        (v_s7_1, v_p7_1, CURRENT_DATE + INTERVAL '12 day', CURRENT_DATE + INTERVAL '14 day', 20, 2, 10, 1250000.00, 'OPEN'),
        -- Derawan
        (v_s8_1, v_p8_1, CURRENT_DATE + INTERVAL '15 day', CURRENT_DATE + INTERVAL '18 day', 16, 0, 10, 2450000.00, 'OPEN')
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 5. Seed Sample Bookings (PAID & UNPAID Transactions)
    -- ==============================================================================
    INSERT INTO bookings (
        id, booking_code, agent_id, schedule_id, customer_name, customer_email,
        customer_whatsapp, total_pax, price_per_pax, total_amount, platform_fee,
        agent_payout_amount, payment_status, payment_method, payment_reference,
        payment_expired_at, paid_at, is_manual_entry
    ) VALUES
        (
            v_b1_1, 'NB-202610-0001', v_a1, v_s1_1, 'Dimas Prasetyo', 'dimas.prasetyo@gmail.com',
            '081299887766', 2, 250000.00, 500000.00, 10000.00, 490000.00,
            'PAID', 'MANUAL_TRANSFER', 'TRF-BCA-98124',
            NOW() + INTERVAL '20 minute', NOW() - INTERVAL '1 hour', FALSE
        ),
        (
            v_b2_1, 'NB-202610-0002', v_a2, v_s2_1, 'Anisa Rahmawati', 'anisa.rahma@yahoo.com',
            '081388776655', 3, 450000.00, 1350000.00, 27000.00, 1323000.00,
            'PAID', 'MOCK_QRIS', 'QRIS-MID-44819',
            NOW() + INTERVAL '20 minute', NOW() - INTERVAL '3 hour', FALSE
        ),
        (
            v_b3_1, 'NB-202610-0003', v_a3, v_s3_1, 'Hendrawan Kusuma', 'hendra.kusuma@gmail.com',
            '085611223344', 2, 2850000.00, 5700000.00, 114000.00, 5586000.00,
            'PAID', 'MANUAL_TRANSFER', 'TRF-BNI-20194',
            NOW() + INTERVAL '20 minute', NOW() - INTERVAL '2 hour', FALSE
        )
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 6. Seed Passenger Manifest (Peserta dengan Presensi Check-in)
    -- ==============================================================================
    INSERT INTO booking_passengers (
        id, booking_id, full_name, id_card_number, gender, phone_number,
        emergency_contact, special_notes, is_checked_in, checked_in_at
    ) VALUES
        (
            uuid_generate_v4(), v_b1_1, 'Dimas Prasetyo', '3404011204950001',
            'MALE', '081299887766', 'Ibu Rahayu (081299880000)', 'Tidak ada pantangan makan',
            TRUE, NOW() - INTERVAL '30 minute'
        ),
        (
            uuid_generate_v4(), v_b1_1, 'Dewi Anggraini', '3404015609970002',
            'FEMALE', '081299887767', 'Ibu Rahayu (081299880000)', 'Mabuk darat ringan',
            FALSE, NULL
        ),
        (
            uuid_generate_v4(), v_b2_1, 'Anisa Rahmawati', '3573016503940001',
            'FEMALE', '081388776655', 'Bpk. Herman (081388001122)', 'Siapkan jaket ukuran M',
            TRUE, NOW() - INTERVAL '15 minute'
        )
    ON CONFLICT (id) DO NOTHING;

    -- ==============================================================================
    -- 7. Seed Agent Payouts (Contoh Transaksi Pencairan 98% Bersih)
    -- ==============================================================================
    INSERT INTO agent_payouts (
        id, agent_id, amount, platform_deduction, net_transferred, status,
        bank_destination_name, bank_destination_account, bank_destination_holder,
        transfer_proof_url, requested_at, processed_at
    ) VALUES
        (
            uuid_generate_v4(), v_a1, 500000.00, 10000.00, 490000.00,
            'TRANSFERRED', 'BCA', '8820192831', 'Budi Santoso',
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
            NOW() - INTERVAL '2 day', NOW() - INTERVAL '1 day'
        ),
        (
            uuid_generate_v4(), v_a2, 1350000.00, 27000.00, 1323000.00,
            'APPROVED', 'Mandiri', '1440019283741', 'Raden Arya Pratama',
            NULL, NOW() - INTERVAL '1 day', NULL
        )
    ON CONFLICT (id) DO NOTHING;

END $$;
