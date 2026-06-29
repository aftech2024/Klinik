export const CLINIC_NAME = 'aftech Klinik';
export const CLINIC_TAGLINE = 'Pelayanan Kesehatan Terbaik untuk Keluarga Anda';
export const CLINIC_PHONE = '021-555-0000';
export const CLINIC_EMAIL = 'info@aftechklinik.com';
export const BOOKING_URL = '/booking';
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? 'http://localhost:3003';
export const STATS = [
  { value: '50+', label: 'Dokter Spesialis' },
  { value: '11', label: 'Cabang' },
  { value: '100K+', label: 'Pasien' },
  { value: '15+', label: 'Tahun Pengalaman' },
] as const;
