import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.usuarios.findFirst({
      where: { username },
      include: { rol: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuarios.findFirst({
      where: { email },
    });
  }

  async findById(id: number) {
    return this.prisma.usuarios.findFirst({
      where: { id_usuario: id },
      include: { rol: true },
    });
  }

  async create(userData: any, idRol: number, hashedPassword: string) {
    const {
      username,
      email,
      prim_nombre,
      seg_nombre,
      apellido1,
      apellido2,
      telefono,
    } = userData;
    const result = await this.prisma.usuarios.create({
      data: {
        username,
        password_hash: hashedPassword,
        email,
        prim_nombre,
        seg_nombre,
        apellido1,
        apellido2,
        telefono,
        id_rol: idRol,
        estado: true,
      },
    });
    return result.id_usuario;
  }

  async createFullUser(data: any) {
    return this.prisma.usuarios.create({
      data,
      include: { rol: true },
    });
  }

  async updatePassword(
    identifier: string,
    hashedPassword: string,
    isEmail = false,
  ) {
    const where = isEmail ? { email: identifier } : { username: identifier };
    const result = await this.prisma.usuarios.updateMany({
      where,
      data: { password_hash: hashedPassword },
    });
    return result.count > 0;
  }

  async updateProfilePhoto(userId: number, photoPath: string) {
    const result = await this.prisma.usuarios.update({
      where: { id_usuario: userId },
      data: { foto_perfil: photoPath },
    });
    return result;
  }

  async updateStatus(id: number, status: boolean) {
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: { estado: status },
    });
  }

  async updateUser(id: number, data: any) {
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data,
      include: { rol: true },
    });
  }

  async findAll() {
    return this.prisma.usuarios.findMany();
  }

  async findByRole(idRol: number) {
    return this.prisma.usuarios.findMany({
      where: { id_rol: idRol },
      orderBy: { created_at: 'desc' },
    });
  }

  async getUserBasicInfo(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
      select: {
        prim_nombre: true,
        apellido1: true,
        email: true
      }
    });
  }

  async findByEmailOrGoogleId(email: string, google_id: string) {
    return this.prisma.usuarios.findFirst({
      where: {
        OR: [{ email: email }, { google_id: google_id }],
      },
      include: { rol: true },
    });
  }

  async vincularGoogleId(id: number, google_id: string) {
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: { google_id: google_id },
      include: { rol: true },
    });
  }

  async findRoleIdByName(roleName: string): Promise<number | null> {
    const rol = await this.prisma.rol.findFirst({
      where: { nombre_rol: roleName },
    });
    if (rol) return rol.id_rol;

    // Fallback para 'administrador'
    if (roleName.toLowerCase() === 'administrador') {
      const rolFallback = await this.prisma.rol.findFirst({
        where: {
          OR: [
            { nombre_rol: { contains: 'Admin' } },
            { nombre_rol: { contains: 'admin' } },
          ],
        },
      });
      if (rolFallback) return rolFallback.id_rol;
    }
    return null;
  }
}
