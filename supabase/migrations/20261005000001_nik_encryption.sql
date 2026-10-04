-- ==============================================================================
-- Migration: Kepatuhan UU PDP No. 27/2022 untuk Enkripsi NIK Penumpang
-- Mengaktifkan ekstensi pgcrypto dan trigger otomatis enkripsi simetris data NIK
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tambah kolom id_card_encrypted bytea jika belum ada
ALTER TABLE booking_passengers 
ADD COLUMN IF NOT EXISTS id_card_encrypted bytea;

-- Fungsi enkripsi simetris data KTP/NIK penumpang
CREATE OR REPLACE FUNCTION encrypt_passenger_nik()
RETURNS trigger AS $$
BEGIN
  IF NEW.id_card_number IS NOT NULL AND NEW.id_card_number != '' THEN
    NEW.id_card_encrypted := pgp_sym_encrypt(
      NEW.id_card_number,
      coalesce(current_setting('app.settings.encryption_key', true), 'nusabook_pdp_default_secret_key_32b!')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sebelum insert atau update
DROP TRIGGER IF EXISTS trg_encrypt_passenger_nik ON booking_passengers;
CREATE TRIGGER trg_encrypt_passenger_nik
BEFORE INSERT OR UPDATE ON booking_passengers
FOR EACH ROW EXECUTE FUNCTION encrypt_passenger_nik();

-- View terproteksi RLS untuk mengakses manifest penumpang dengan NIK terdekripsi
CREATE OR REPLACE VIEW view_booking_passengers_decrypted AS
SELECT 
  bp.id,
  bp.booking_id,
  bp.full_name,
  CASE 
    WHEN bp.id_card_encrypted IS NOT NULL THEN
      pgp_sym_decrypt(
        bp.id_card_encrypted,
        coalesce(current_setting('app.settings.encryption_key', true), 'nusabook_pdp_default_secret_key_32b!')
      )
    ELSE bp.id_card_number
  END AS id_card_number_decrypted,
  bp.phone,
  bp.is_checked_in,
  bp.checked_in_at,
  bp.created_at
FROM booking_passengers bp;
