import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/create-users.dto';
import { IUserLookup } from './interfaces/user-lookup.interface';


@Injectable()
export class UsersService implements IUserLookup {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly prisma: PrismaService,
  ) { }

  async findOneByUsername(username: string) {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * ACTUALIZAR FOTO CON CLOUDINARY
   * Este método reemplaza la lógica local por la de la nube.
   */
  async updatePhoto(id_usuario: number, public_id: string) {
    // 1. Verificamos que el usuario exista en la tabla SQL
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con ID ${id_usuario} no fue encontrado.`,
      );
    }

    // 2. Actualizamos la columna foto_perfil con el ID de Cloudinary
    return await this.prisma.usuarios.update({
      where: { id_usuario },
      data: {
        foto_perfil: public_id,
      },
    });
  }

  // MÉTODOS DE PRISMA EXISTENTES
  async obtenerTodos() {
    return this.prisma.usuarios.findMany();
  }

  // --- NUEVOS MÉTODOS PARA EL DASHBOARD DE ADMIN ---
  async activateClient(id: number) {
    try {
      await this.prisma.usuarios.update({
        where: { id_usuario: id },
        data: { estado: true },
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async deactivateClient(id: number) {
    try {
      await this.remove(id); // remove() ya pone el estado en false
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async findAllClients() {
    try {
      const data = await this.prisma.usuarios.findMany({
        where: { id_rol: 2 }, // Clientes (todos, activos e inactivos)
        orderBy: { created_at: 'desc' },
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async findAllAdmins() {
    try {
      const data = await this.prisma.usuarios.findMany({
        where: { id_rol: 1 }, // Administradores
        orderBy: { created_at: 'desc' },
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async crearUsuario(data: CrearUsuarioDto) {
    // Encriptar la contraseña antes de guardar el usuario (Centralizado, cubre Admin y Registro)
    const hashedPassword = await this.hashPassword(data.password_hash);

    return await this.prisma.usuarios.create({
      data: {
        username: data.username,
        prim_nombre: data.prim_nombre,
        seg_nombre: data.seg_nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        email: data.email,
        password_hash: hashedPassword,
        telefono: data.telefono,
        estado: data.estado !== undefined ? data.estado : true,
        id_rol: data.id_rol !== undefined ? data.id_rol : 2,
        foto_perfil: data.foto_perfil,
      },
    });
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

  async findOne(id: number) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
      include: { rol: true }, // Opcional: Para devolver el nombre del rol también
    });

    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, data: any) {
    await this.findOne(id); // Verifica si existe primero

    // Si el admin envía una contraseña nueva, la encriptamos
    if (data.password_hash) {
      data.password_hash = await this.hashPassword(data.password_hash);
    }

    return await this.prisma.usuarios.update({
      where: { id_usuario: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe

    // Borrado suave (soft-delete): Cambiamos su estado a false (inactivo)
    return await this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: { estado: false },
    });
  }
}
