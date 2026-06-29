import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BranchesModule } from './modules/branches/branches.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ContentModule } from './modules/content/content.module';
import { PatientsModule } from './modules/patients/patients.module';
import { QueueModule } from './modules/queue/queue.module';
import { MedicalRecordsModule } from './modules/medical-records/medical-records.module';
import { BillingModule } from './modules/billing/billing.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadModule } from './modules/upload/upload.module';
import { AdminsModule } from './modules/admins/admins.module';
import { PosModule } from './modules/pos/pos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    BranchesModule,
    DoctorsModule,
    ServicesModule,
    AppointmentsModule,
    ContentModule,
    PatientsModule,
    QueueModule,
    MedicalRecordsModule,
    BillingModule,
    PharmacyModule,
    NotificationsModule,
    ReportsModule,
    SettingsModule,
    UploadModule,
    AdminsModule,
    PosModule,
  ],
})
export class AppModule {}
