-- Concurrency Safe Quota Locking Functions

-- 1. Reserve Quota (Pessimistic Locking)
CREATE OR REPLACE FUNCTION reserve_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_total_quota INT;
    v_reserved INT;
    v_booked INT;
    v_status schedule_status;
BEGIN
    IF p_pax <= 0 THEN
        RETURN FALSE;
    END IF;

    -- Pessimistic Lock on the specific schedule row to prevent race conditions
    SELECT total_quota, reserved_quota, booked_quota, status
    INTO v_total_quota, v_reserved, v_booked, v_status
    FROM trip_schedules
    WHERE id = p_schedule_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    IF v_status <> 'OPEN' THEN
        RETURN FALSE;
    END IF;

    -- Validate capacity
    IF (v_reserved + v_booked + p_pax) <= v_total_quota THEN
        UPDATE trip_schedules
        SET reserved_quota = reserved_quota + p_pax,
            version = version + 1,
            updated_at = NOW()
        WHERE id = p_schedule_id;
        
        -- Automatically mark as SOLD_OUT if quota reaches limit
        IF (v_reserved + v_booked + p_pax) = v_total_quota THEN
            UPDATE trip_schedules
            SET status = 'SOLD_OUT'
            WHERE id = p_schedule_id;
        END IF;

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. Release Quota (Expired or Cancelled Bookings)
CREATE OR REPLACE FUNCTION release_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS VOID AS $$
BEGIN
    UPDATE trip_schedules
    SET reserved_quota = GREATEST(0, reserved_quota - p_pax),
        status = CASE WHEN status = 'SOLD_OUT' THEN 'OPEN'::schedule_status ELSE status END,
        version = version + 1,
        updated_at = NOW()
    WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Confirm Quota (Payment Captured/Settled)
CREATE OR REPLACE FUNCTION confirm_trip_quota(
    p_schedule_id UUID,
    p_pax INT
) RETURNS VOID AS $$
BEGIN
    UPDATE trip_schedules
    SET reserved_quota = GREATEST(0, reserved_quota - p_pax),
        booked_quota = booked_quota + p_pax,
        version = version + 1,
        updated_at = NOW()
    WHERE id = p_schedule_id;
END;
$$ LANGUAGE plpgsql;
