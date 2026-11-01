export interface ManifestCsvItem {
  orderNumber: number;
  fullName: string;
  gender: string | null;
  idCardNumber: string | null;
  phoneNumber: string | null;
  emergencyContact: string | null;
  specialNotes: string | null;
  bookingCode: string;
  paymentStatus: string;
  isCheckedIn: boolean;
  checkedInAt: string | null;
}

function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined || field === '') return '""';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function generateManifestCsv(items: ManifestCsvItem[]): string {
  const header = [
    'No',
    'Nama Lengkap',
    'Gender',
    'NIK / No Identitas',
    'WhatsApp',
    'Kontak Darurat',
    'Catatan Khusus',
    'Kode Booking',
    'Status Bayar',
    'Status Kehadiran',
    'Waktu Check-in',
  ].join(',');

  const rows = items.map((item) => {
    const genderText = item.gender === 'MALE' ? 'Laki-laki' : item.gender === 'FEMALE' ? 'Perempuan' : '-';
    const checkinStatus = item.isCheckedIn ? 'Hadir' : 'Belum Hadir';
    const checkinTime = item.checkedInAt ? new Date(item.checkedInAt).toLocaleString('id-ID') : '-';

    return [
      item.orderNumber,
      escapeCsvField(item.fullName),
      escapeCsvField(genderText),
      escapeCsvField(item.idCardNumber || '-'),
      escapeCsvField(item.phoneNumber || '-'),
      escapeCsvField(item.emergencyContact || '-'),
      escapeCsvField(item.specialNotes || '-'),
      escapeCsvField(item.bookingCode),
      escapeCsvField(item.paymentStatus),
      escapeCsvField(checkinStatus),
      escapeCsvField(checkinTime),
    ].join(',');
  });

  return '\uFEFF' + [header, ...rows].join('\r\n');
}
