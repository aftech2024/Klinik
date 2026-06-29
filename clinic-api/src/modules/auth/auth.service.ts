import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: 'PATIENT',
        isVerified: false,
      },
    });

    // Create patient record
    const medicalNumber = `PAT-${Date.now().toString(36).toUpperCase()}`;
    await this.prisma.patient.create({
      data: {
        userId: user.id,
        medicalNumber,
        name: dto.name,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: dto.name,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { patient: true, doctor: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.managedBranchId);
    const name = user.name || user.patient?.name || user.doctor?.name || user.email;

    // Include managed clinic info for admins
    let branch: { id: string; name: string; city: string } | null = null;
    if (user.managedBranchId) {
      branch = await this.prisma.branch.findUnique({
        where: { id: user.managedBranchId },
        select: { id: true, name: true, city: true },
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name,
        branchId: user.managedBranchId,
        branch,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
      storedToken.user.managedBranchId,
    );

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
    return { message: 'Logout berhasil' };
  }

  private async generateTokens(userId: string, email: string, role: string, branchId?: string | null) {
    const payload = { sub: userId, email, role, branchId: branchId ?? null };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true, doctor: true, managedBranch: { select: { id: true, name: true, city: true } } },
    });
    if (!user) throw new UnauthorizedException();
    const name = user.name || user.patient?.name || user.doctor?.name || user.email;
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name,
      branchId: user.managedBranchId,
      branch: user.managedBranch,
    };
  }
}
