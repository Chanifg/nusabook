-- Seed Data for Testing & Demonstration
DO $$
DECLARE
    v_profile_id UUID := '00000000-0000-0000-0000-000000000001';
    v_agent_id UUID := '11111111-1111-1111-1111-111111111111';
    v_package_id UUID := '22222222-2222-2222-2222-222222222222';
    v_schedule_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
    -- 1. Seed Profile
    INSERT INTO profiles (id, full_name, phone_number, role)
    VALUES (
        v_profile_id,
        'Budi Santoso (Pesona Merapi)',
        '081234567890',
        'agent_owner'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Seed Travel Agent
    INSERT INTO travel_agents (
        id, owner_id, business_name, slug, description, office_address, city,
        whatsapp_number, instagram_handle, bank_name, bank_account_number, bank_account_name, is_verified, is_active
    ) VALUES (
        v_agent_id,
        v_profile_id,
        'Pesona Merapi Tour & Travel',
        'pesona-merapi',
        'Spesialis paket wisata alam Merapi, sunrise trip, dan sewa jeep lava tour terpercaya di Yogyakarta.',
        'Jl. Kaliurang KM 21, Sleman, D.I. Yogyakarta',
        'Sleman',
        '081234567890',
        '@pesonamerapi.trip',
        'BCA',
        '8820192831',
        'Budi Santoso',
        TRUE,
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

    -- 3. Seed Tour Package
    INSERT INTO tour_packages (
        id, agent_id, title, slug, category, duration_days, duration_nights,
        destination_city, meeting_point, description, itinerary,
        facilities_included, facilities_excluded, cancellation_policy, is_published
    ) VALUES (
        v_package_id,
        v_agent_id,
        'Sunrise Lava Tour Merapi & Bunker Kaliadem',
        'sunrise-lava-tour-merapi',
        'open_trip',
        1,
        0,
        'Yogyakarta',
        'Basecamp Jeep Kaliurang, Sleman',
        'Saksikan keindahan matahari terbit berlatar megahnya Gunung Merapi dilanjutkan petualangan seru menyusuri jejak erupsi dengan Jeep 4x4.',
        '[{"time": "04:00", "activity": "Kumpul di Basecamp dan briefing"}, {"time": "04:30", "activity": "Menuju Spot Sunrise Bunker Kaliadem"}, {"time": "06:30", "activity": "Kunjungan Museum Sisa Hartaku & Batu Alien"}, {"time": "08:30", "activity": "Manuver Air Kali Kuning & Selesai"}]'::JSONB,
        ARRAY['Jeep 4x4 + Driver Berpengalaman', 'BBM & Tiket Masuk Wisata', 'Pemandu Lokal', 'Air Mineral & Snack Ringan'],
        ARRAY['Pengeluaran Pribadi', 'Transportasi ke Meeting Point', 'Tips Driver'],
        'Pembatalan hingga H-3 mendapatkan pengembalian 50%. Pembatalan kurang dari 48 jam tidak dapat di-refund.',
        TRUE
    ) ON CONFLICT (id) DO NOTHING;

    -- 4. Seed Trip Schedule
    INSERT INTO trip_schedules (
        id, package_id, departure_date, return_date, total_quota, reserved_quota, booked_quota, price_per_pax, status
    ) VALUES (
        v_schedule_id,
        v_package_id,
        CURRENT_DATE + INTERVAL '7 day',
        CURRENT_DATE + INTERVAL '7 day',
        12,
        0,
        0,
        250000.00,
        'OPEN'
    ) ON CONFLICT (id) DO NOTHING;
END $$;
