import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Define it in clinic-api/.env (see .env.example).',
  );
}
const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('🌱 Seeding aftech Klinik database...');

  // ============================================================
  // ADMIN USER
  // ============================================================
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aftechklinik.com' },
    update: { name: 'Super Admin' },
    create: {
      email: 'admin@aftechklinik.com',
      phone: '081234567890',
      passwordHash: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Super Admin user created');

  // ============================================================
  // BRANCHES
  // ============================================================
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { slug: 'aftech-klinik-jakarta-selatan' },
      update: {},
      create: {
        name: 'aftech Klinik Jakarta Selatan',
        slug: 'aftech-klinik-jakarta-selatan',
        address: 'Jl. Sudirman No. 123, Kebayoran Baru',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        phone: '021-5551234',
        email: 'jaksel@aftechklinik.com',
        facilities: ['Parking', 'Pharmacy', 'Laboratory', 'WiFi', 'Prayer Room'],
        operatingHours: {
          weekday: { open: '07:00', close: '21:00' },
          saturday: { open: '07:00', close: '17:00' },
          sunday: { open: '08:00', close: '14:00' },
        },
        latitude: -6.2297,
        longitude: 106.8295,
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'aftech-klinik-bekasi' },
      update: {},
      create: {
        name: 'aftech Klinik Bekasi',
        slug: 'aftech-klinik-bekasi',
        address: 'Jl. Ahmad Yani No. 45, Bekasi Timur',
        city: 'Bekasi',
        province: 'Jawa Barat',
        phone: '021-5552345',
        email: 'bekasi@aftechklinik.com',
        facilities: ['Parking', 'Pharmacy', 'WiFi', 'Prayer Room'],
        operatingHours: {
          weekday: { open: '07:00', close: '21:00' },
          saturday: { open: '07:00', close: '17:00' },
          sunday: { open: '08:00', close: '14:00' },
        },
        latitude: -6.2383,
        longitude: 107.0002,
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'aftech-klinik-tangerang' },
      update: {},
      create: {
        name: 'aftech Klinik Tangerang',
        slug: 'aftech-klinik-tangerang',
        address: 'Jl. MH Thamrin No. 78, Tangerang Kota',
        city: 'Tangerang',
        province: 'Banten',
        phone: '021-5553456',
        email: 'tangerang@aftechklinik.com',
        facilities: ['Parking', 'Pharmacy', 'Laboratory', 'WiFi'],
        operatingHours: {
          weekday: { open: '08:00', close: '20:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: { open: 'Tutup', close: 'Tutup' },
        },
        latitude: -6.1783,
        longitude: 106.6319,
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'aftech-klinik-depok' },
      update: {},
      create: {
        name: 'aftech Klinik Depok',
        slug: 'aftech-klinik-depok',
        address: 'Jl. Margonda Raya No. 200, Depok',
        city: 'Depok',
        province: 'Jawa Barat',
        phone: '021-5554567',
        email: 'depok@aftechklinik.com',
        facilities: ['Parking', 'Pharmacy', 'WiFi', 'Prayer Room'],
        operatingHours: {
          weekday: { open: '07:00', close: '21:00' },
          saturday: { open: '07:00', close: '17:00' },
          sunday: { open: '08:00', close: '14:00' },
        },
        latitude: -6.3923,
        longitude: 106.8229,
      },
    }),
    prisma.branch.upsert({
      where: { slug: 'aftech-klinik-bogor' },
      update: {},
      create: {
        name: 'aftech Klinik Bogor',
        slug: 'aftech-klinik-bogor',
        address: 'Jl. Pajajaran No. 55, Bogor Tengah',
        city: 'Bogor',
        province: 'Jawa Barat',
        phone: '0251-8551234',
        email: 'bogor@aftechklinik.com',
        facilities: ['Parking', 'Pharmacy', 'WiFi'],
        operatingHours: {
          weekday: { open: '08:00', close: '20:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: { open: 'Tutup', close: 'Tutup' },
        },
        latitude: -6.5944,
        longitude: 106.7892,
      },
    }),
  ]);
  console.log(`✅ ${branches.length} branches created`);

  // ============================================================
  // CLINIC ADMINS (one per clinic — scoped to their branch)
  // ============================================================
  const jaksel = branches.find((b: { slug: string }) => b.slug === 'aftech-klinik-jakarta-selatan') ?? branches[0];
  const bekasi = branches.find((b: { slug: string }) => b.slug === 'aftech-klinik-bekasi') ?? branches[1];
  const clinicAdminPassword = await bcrypt.hash('admin123456', 12);

  const clinicAdmins = [
    { email: 'admin.bekasi@aftechklinik.com', name: 'Admin Klinik Bekasi', branchId: bekasi.id },
    { email: 'admin.jaksel@aftechklinik.com', name: 'Admin Klinik Jakarta Selatan', branchId: jaksel.id },
  ];
  for (const ca of clinicAdmins) {
    await prisma.user.upsert({
      where: { email: ca.email },
      update: { name: ca.name, role: 'ADMIN', managedBranchId: ca.branchId },
      create: {
        email: ca.email,
        passwordHash: clinicAdminPassword,
        name: ca.name,
        role: 'ADMIN',
        isActive: true,
        isVerified: true,
        managedBranchId: ca.branchId,
      },
    });
  }
  console.log(`✅ ${clinicAdmins.length} clinic admins created`);

  // ============================================================
  // SERVICES
  // ============================================================
  const services = await Promise.all([
    prisma.service.upsert({ where: { slug: 'general-practice' }, update: {}, create: { name: 'Praktek Umum', slug: 'general-practice', description: 'Layanan kesehatan umum untuk seluruh anggota keluarga. Penanganan penyakit ringan hingga sedang, konsultasi kesehatan, dan rujukan.', category: 'General', sortOrder: 1 } }),
    prisma.service.upsert({ where: { slug: 'dental' }, update: {}, create: { name: 'Gigi & Mulut', slug: 'dental', description: 'Perawatan gigi lengkap termasuk pemeriksaan rutin, pembersihan karang gigi, tambal gigi, pencabutan, dan perawatan saluran akar.', category: 'Specialist', sortOrder: 2 } }),
    prisma.service.upsert({ where: { slug: 'pediatrics' }, update: {}, create: { name: 'Anak', slug: 'pediatrics', description: 'Layanan kesehatan khusus anak mulai dari bayi hingga remaja. Imunisasi, tumbuh kembang, dan penanganan penyakit anak.', category: 'Specialist', sortOrder: 3 } }),
    prisma.service.upsert({ where: { slug: 'obstetrics-gynecology' }, update: {}, create: { name: 'Kebidanan & Kandungan', slug: 'obstetrics-gynecology', description: 'Layanan kesehatan reproduksi wanita, pemeriksaan kehamilan, USG, dan konsultasi kebidanan.', category: 'Specialist', sortOrder: 4 } }),
    prisma.service.upsert({ where: { slug: 'internal-medicine' }, update: {}, create: { name: 'Penyakit Dalam', slug: 'internal-medicine', description: 'Diagnosis dan pengobatan penyakit organ dalam seperti diabetes, hipertensi, dan gangguan metabolik.', category: 'Specialist', sortOrder: 5 } }),
    prisma.service.upsert({ where: { slug: 'vaccination' }, update: {}, create: { name: 'Vaksinasi', slug: 'vaccination', description: 'Program vaksinasi lengkap untuk anak dan dewasa. Termasuk vaksin flu, hepatitis, HPV, dan vaksin perjalanan.', category: 'Preventive', sortOrder: 6 } }),
    prisma.service.upsert({ where: { slug: 'laboratory' }, update: {}, create: { name: 'Laboratorium', slug: 'laboratory', description: 'Pemeriksaan laboratorium lengkap meliputi darah, urine, kolesterol, gula darah, dan panel kesehatan komprehensif.', category: 'Diagnostic', sortOrder: 7 } }),
    prisma.service.upsert({ where: { slug: 'medical-check-up' }, update: {}, create: { name: 'Medical Check Up', slug: 'medical-check-up', description: 'Paket pemeriksaan kesehatan menyeluruh untuk deteksi dini penyakit. Tersedia paket Basic, Standard, dan Premium.', category: 'Preventive', sortOrder: 8 } }),
  ]);
  console.log(`✅ ${services.length} services created`);

  // ============================================================
  // DOCTORS
  // ============================================================
  const doctorUsers = await Promise.all([
    prisma.user.upsert({ where: { email: 'dr.sarah@aftechklinik.com' }, update: {}, create: { email: 'dr.sarah@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
    prisma.user.upsert({ where: { email: 'dr.budi@aftechklinik.com' }, update: {}, create: { email: 'dr.budi@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
    prisma.user.upsert({ where: { email: 'dr.rina@aftechklinik.com' }, update: {}, create: { email: 'dr.rina@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
    prisma.user.upsert({ where: { email: 'dr.andi@aftechklinik.com' }, update: {}, create: { email: 'dr.andi@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
    prisma.user.upsert({ where: { email: 'dr.maya@aftechklinik.com' }, update: {}, create: { email: 'dr.maya@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
    prisma.user.upsert({ where: { email: 'drg.putri@aftechklinik.com' }, update: {}, create: { email: 'drg.putri@aftechklinik.com', passwordHash: adminPassword, role: 'DOCTOR', isActive: true, isVerified: true } }),
  ]);

  const doctors = await Promise.all([
    prisma.doctor.upsert({ where: { slug: 'dr-sarah-wijaya' }, update: {}, create: { userId: doctorUsers[0].id, name: 'dr. Sarah Wijaya, Sp.PD', slug: 'dr-sarah-wijaya', specialty: 'Penyakit Dalam', bio: 'Dokter spesialis penyakit dalam dengan pengalaman lebih dari 12 tahun dalam penanganan diabetes, hipertensi, dan gangguan metabolik.', experience: 12, sortOrder: 1 } }),
    prisma.doctor.upsert({ where: { slug: 'dr-budi-santoso' }, update: {}, create: { userId: doctorUsers[1].id, name: 'dr. Budi Santoso, Sp.A', slug: 'dr-budi-santoso', specialty: 'Anak', bio: 'Dokter spesialis anak yang berdedikasi tinggi dalam kesehatan dan tumbuh kembang anak. Berpengalaman 10 tahun.', experience: 10, sortOrder: 2 } }),
    prisma.doctor.upsert({ where: { slug: 'dr-rina-hartati' }, update: {}, create: { userId: doctorUsers[2].id, name: 'dr. Rina Hartati, Sp.OG', slug: 'dr-rina-hartati', specialty: 'Kebidanan & Kandungan', bio: 'Dokter spesialis kebidanan dan kandungan dengan keahlian dalam kehamilan risiko tinggi dan USG 4D.', experience: 15, sortOrder: 3 } }),
    prisma.doctor.upsert({ where: { slug: 'dr-andi-prasetyo' }, update: {}, create: { userId: doctorUsers[3].id, name: 'dr. Andi Prasetyo', slug: 'dr-andi-prasetyo', specialty: 'Umum', bio: 'Dokter umum berpengalaman yang menangani berbagai keluhan kesehatan sehari-hari dengan pendekatan yang ramah.', experience: 8, sortOrder: 4 } }),
    prisma.doctor.upsert({ where: { slug: 'dr-maya-sari' }, update: {}, create: { userId: doctorUsers[4].id, name: 'dr. Maya Sari, Sp.PD', slug: 'dr-maya-sari', specialty: 'Penyakit Dalam', bio: 'Dokter spesialis penyakit dalam dengan fokus pada penyakit jantung dan pembuluh darah.', experience: 9, sortOrder: 5 } }),
    prisma.doctor.upsert({ where: { slug: 'drg-putri-lestari' }, update: {}, create: { userId: doctorUsers[5].id, name: 'drg. Putri Lestari', slug: 'drg-putri-lestari', specialty: 'Gigi & Mulut', bio: 'Dokter gigi dengan keahlian dalam perawatan gigi estetik, orthodonti, dan bedah mulut minor.', experience: 7, sortOrder: 6 } }),
  ]);

  // Assign doctors to branches
  for (const doctor of doctors) {
    const branchIndex = Math.floor(Math.random() * branches.length);
    await prisma.doctorBranch.upsert({
      where: { doctorId_branchId: { doctorId: doctor.id, branchId: branches[branchIndex].id } },
      update: {},
      create: { doctorId: doctor.id, branchId: branches[branchIndex].id },
    });
    // Some doctors at multiple branches
    if (Math.random() > 0.5) {
      const secondBranch = branches[(branchIndex + 1) % branches.length];
      await prisma.doctorBranch.upsert({
        where: { doctorId_branchId: { doctorId: doctor.id, branchId: secondBranch.id } },
        update: {},
        create: { doctorId: doctor.id, branchId: secondBranch.id },
      });
    }
  }

  // Schedules
  const days: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'> = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  for (const doctor of doctors) {
    const doctorBranches = await prisma.doctorBranch.findMany({ where: { doctorId: doctor.id } });
    for (const db of doctorBranches) {
      const scheduleDays = days.slice(0, 4 + Math.floor(Math.random() * 2));
      for (const day of scheduleDays) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: doctor.id,
            branchId: db.branchId,
            dayOfWeek: day,
            startTime: '08:00',
            endTime: '16:00',
            maxSlots: 20,
          },
        });
      }
    }
  }
  console.log(`✅ ${doctors.length} doctors created with schedules`);

  // ============================================================
  // PROMOTIONS
  // ============================================================
  await Promise.all([
    prisma.promotion.upsert({ where: { slug: 'medical-checkup-promo' }, update: {}, create: { title: 'Diskon 30% Medical Check Up', slug: 'medical-checkup-promo', description: 'Dapatkan diskon 30% untuk paket Medical Check Up Premium selama bulan ini. Termasuk pemeriksaan darah lengkap, EKG, dan konsultasi dokter.', startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), sortOrder: 1 } }),
    prisma.promotion.upsert({ where: { slug: 'vaksinasi-gratis' }, update: {}, create: { title: 'Vaksinasi Flu Gratis', slug: 'vaksinasi-gratis', description: 'Program vaksinasi flu gratis untuk pasien lansia (60 tahun ke atas) di seluruh cabang aftech Klinik.', startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), sortOrder: 2 } }),
    prisma.promotion.upsert({ where: { slug: 'paket-keluarga' }, update: {}, create: { title: 'Paket Sehat Keluarga', slug: 'paket-keluarga', description: 'Paket pemeriksaan kesehatan untuk seluruh anggota keluarga dengan harga spesial. Minimal 3 orang.', startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), sortOrder: 3 } }),
  ]);
  console.log('✅ Promotions created');

  // ============================================================
  // ARTICLES
  // ============================================================
  await Promise.all([
    prisma.article.upsert({ where: { slug: 'tips-menjaga-kesehatan-jantung' }, update: {}, create: { title: '10 Tips Menjaga Kesehatan Jantung', slug: 'tips-menjaga-kesehatan-jantung', excerpt: 'Penyakit jantung merupakan penyebab kematian nomor satu di dunia. Berikut tips sederhana untuk menjaga kesehatan jantung Anda.', content: 'Penyakit jantung merupakan penyebab kematian nomor satu di dunia. Dengan menerapkan gaya hidup sehat, risiko penyakit jantung dapat dikurangi secara signifikan...', category: 'Kesehatan Jantung', tags: ['jantung', 'kesehatan', 'tips'], authorName: 'dr. Sarah Wijaya', status: 'PUBLISHED', publishedAt: new Date() } }),
    prisma.article.upsert({ where: { slug: 'pentingnya-imunisasi-anak' }, update: {}, create: { title: 'Pentingnya Imunisasi Lengkap untuk Anak', slug: 'pentingnya-imunisasi-anak', excerpt: 'Imunisasi merupakan cara paling efektif untuk melindungi anak dari berbagai penyakit berbahaya.', content: 'Imunisasi adalah salah satu pencapaian terbesar dalam dunia kesehatan. Dengan imunisasi, jutaan nyawa anak telah terselamatkan...', category: 'Anak', tags: ['anak', 'imunisasi', 'vaksin'], authorName: 'dr. Budi Santoso', status: 'PUBLISHED', publishedAt: new Date() } }),
    prisma.article.upsert({ where: { slug: 'diabetes-gejala-pencegahan' }, update: {}, create: { title: 'Mengenal Diabetes: Gejala dan Pencegahan', slug: 'diabetes-gejala-pencegahan', excerpt: 'Diabetes mellitus semakin banyak ditemukan di Indonesia. Kenali gejala awal dan cara pencegahannya.', content: 'Diabetes mellitus adalah penyakit metabolik yang ditandai dengan tingginya kadar gula darah...', category: 'Penyakit Dalam', tags: ['diabetes', 'gula darah', 'pencegahan'], authorName: 'dr. Maya Sari', status: 'PUBLISHED', publishedAt: new Date() } }),
  ]);
  console.log('✅ Articles created');

  // ============================================================
  // TESTIMONIALS
  // ============================================================
  await Promise.all([
    prisma.testimonial.upsert({ where: { id: '00000000-0000-0000-0000-000000000001' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000001', name: 'Ibu Ratna Dewi', role: 'Pasien', content: 'Pelayanan di aftech Klinik sangat memuaskan. Dokternya ramah dan profesional. Proses pendaftaran juga sangat mudah melalui aplikasi.', rating: 5, sortOrder: 1 } }),
    prisma.testimonial.upsert({ where: { id: '00000000-0000-0000-0000-000000000002' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000002', name: 'Bapak Ahmad Fauzi', role: 'Pasien', content: 'Saya sangat terbantu dengan sistem antrian online. Tidak perlu menunggu lama di klinik. Dokter juga menjelaskan dengan sangat detail.', rating: 5, sortOrder: 2 } }),
    prisma.testimonial.upsert({ where: { id: '00000000-0000-0000-0000-000000000003' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000003', name: 'Ibu Siti Aminah', role: 'Pasien', content: 'Klinik yang bersih dan modern. Fasilitas lengkap dan harga terjangkau. Sudah menjadi klinik langganan keluarga kami.', rating: 5, sortOrder: 3 } }),
    prisma.testimonial.upsert({ where: { id: '00000000-0000-0000-0000-000000000004' }, update: {}, create: { id: '00000000-0000-0000-0000-000000000004', name: 'Bapak Rudi Hermawan', role: 'Pasien', content: 'Medical check up di sini sangat thorough. Hasil lab keluar cepat dan dokter langsung memberikan penjelasan yang mudah dimengerti.', rating: 4, sortOrder: 4 } }),
  ]);
  console.log('✅ Testimonials created');

  // ============================================================
  // MEDICINES + STOCK
  // ============================================================
  const medicineData = [
    { code: 'OBT001', name: 'Paracetamol 500mg', genericName: 'Paracetamol', category: 'Analgesik', unit: 'tablet', price: 500 },
    { code: 'OBT002', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotik', unit: 'kapsul', price: 2500 },
    { code: 'OBT003', name: 'Antasida Doen', genericName: 'Antasida', category: 'GI', unit: 'tablet', price: 1000 },
    { code: 'OBT004', name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'Antihistamin', unit: 'tablet', price: 1500 },
    { code: 'OBT005', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Analgesik', unit: 'tablet', price: 800 },
    { code: 'OBT006', name: 'OBH Combi Batuk', genericName: 'Obat Batuk', category: 'Batuk & Pilek', unit: 'botol', price: 25000 },
    { code: 'OBT007', name: 'Betamethasone Krim', genericName: 'Betamethasone', category: 'Dermatologi', unit: 'tube', price: 15000 },
    { code: 'OBT008', name: 'Vitamin C 500mg', genericName: 'Asam Askorbat', category: 'Vitamin', unit: 'tablet', price: 1200 },
    { code: 'OBT009', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'GI', unit: 'kapsul', price: 3500 },
    { code: 'OBT010', name: 'Metformin 500mg', genericName: 'Metformin', category: 'Antidiabetik', unit: 'tablet', price: 2000 },
  ];

  const medicines = await Promise.all(
    medicineData.map(m =>
      prisma.medicine.upsert({ where: { code: m.code }, update: {}, create: m })
    )
  );
  console.log(`✅ ${medicines.length} medicines created`);

  // Stock per branch for each medicine
  for (const branch of branches) {
    for (let i = 0; i < medicines.length; i++) {
      await prisma.productStock.upsert({
        where: { medicineId_branchId: { medicineId: medicines[i].id, branchId: branch.id } },
        update: {},
        create: {
          medicineId: medicines[i].id,
          branchId: branch.id,
          quantity: Math.floor(Math.random() * 80) + 20,
          minStock: 10,
        },
      });
    }
  }
  console.log('✅ Product stocks seeded per branch');

  // ============================================================
  // FAQs
  // ============================================================
  await Promise.all([
    prisma.faq.create({ data: { question: 'Bagaimana cara membuat janji temu?', answer: 'Anda dapat membuat janji temu melalui website kami, aplikasi mobile, atau menghubungi call center di 021-555-0000. Pilih dokter, cabang, dan waktu yang tersedia.', category: 'Appointment', sortOrder: 1 } }),
    prisma.faq.create({ data: { question: 'Apakah aftech Klinik menerima BPJS?', answer: 'Saat ini aftech Klinik melayani pasien umum dan asuransi swasta. Integrasi BPJS sedang dalam tahap persiapan dan akan tersedia dalam waktu dekat.', category: 'Pembayaran', sortOrder: 2 } }),
    prisma.faq.create({ data: { question: 'Berapa lama hasil laboratorium keluar?', answer: 'Untuk pemeriksaan darah rutin, hasil tersedia dalam 2-4 jam. Untuk pemeriksaan khusus, hasil tersedia dalam 1-3 hari kerja.', category: 'Laboratorium', sortOrder: 3 } }),
    prisma.faq.create({ data: { question: 'Apakah bisa konsultasi online?', answer: 'Fitur telemedicine sedang dalam pengembangan dan akan segera tersedia. Saat ini Anda dapat berkonsultasi melalui WhatsApp untuk informasi awal.', category: 'Layanan', sortOrder: 4 } }),
    prisma.faq.create({ data: { question: 'Apa saja metode pembayaran yang diterima?', answer: 'Kami menerima pembayaran tunai, kartu debit/kredit, transfer bank, QRIS, dan beberapa asuransi kesehatan swasta.', category: 'Pembayaran', sortOrder: 5 } }),
  ]);
  console.log('✅ FAQs created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
