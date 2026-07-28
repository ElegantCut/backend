import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { CrearUsuarioDto } from './dto/create-users.dto';
import { IUserIntegration } from './interfaces/user-integration.interface';

@Injectable()
export class UsersService implements IUserIntegration {
  constructor(
    private readonly usersRepo: UsersRepository,
  ) { }

  async findOneByUsername(username: string) {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmailOrGoogleId(email: string, google_id: string) {
    return await this.usersRepo.findByEmailOrGoogleId(email, google_id);
  }

  async vincularGoogleId(id_usuario: number, google_id: string) {
    return await this.usersRepo.vincularGoogleId(id_usuario, google_id);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async updatePasswordByEmail(email: string, hash: string) {
    return await this.usersRepo.updatePassword(email, hash, true);
  }

  /**
   * ACTUALIZAR FOTO CON CLOUDINARY
   * Este método reemplaza la lógica local por la de la nube.
   */
  async updatePhoto(id_usuario: number, public_id: string) {
    // 1. Verificamos que el usuario exista
    const usuario = await this.usersRepo.findById(id_usuario);

    if (!usuario) {
      throw new NotFoundException(
        `El usuario con ID ${id_usuario} no fue encontrado.`,
      );
    }

    // 2. Actualizamos la columna foto_perfil con el ID de Cloudinary
    return await this.usersRepo.updateProfilePhoto(id_usuario, public_id);
  }

  async obtenerTodos() {
    return this.usersRepo.findAll();
  }

  // --- NUEVOS MÉTODOS PARA EL DASHBOARD DE ADMIN ---
  async activateClient(id: number) {
    try {
      await this.usersRepo.updateStatus(id, true);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  //nuevo metodo para traer la info básica
  async getUserBasicInfo(id: number) {
    const user = await this.usersRepo.getUserBasicInfo(id);

    //si ya no exite el id uwu
    if (!user) {
      return { prim_nombre: 'Usuario', apellido1: 'Desconocido', email: '' };
    }
    return user;
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
      const data = await this.usersRepo.findByRole(2); // Clientes (todos, activos e inactivos)
      return { success: true, data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async findAllAdmins() {
    try {
      const data = await this.usersRepo.findByRole(1); // Administradores
      return { success: true, data };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async crearUsuario(data: CrearUsuarioDto) {
    // Check if email already exists
    const existingUserByEmail = await this.usersRepo.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new BadRequestException('Email ya registrado');
    }

    // Check if username already exists
    const existingUserByUsername = await this.usersRepo.findByUsername(data.username);
    if (existingUserByUsername) {
      throw new BadRequestException('Nombre de usuario ya registrado');
    }

    // Encriptar la contraseña antes de guardar el usuario (Centralizado, cubre Admin y Registro)
    const hashedPassword = await this.hashPassword(data.password_hash);

    return await this.usersRepo.createFullUser({
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
    });
  }

  async crearUsuarioConGoogle(data: any) {
    return await this.usersRepo.createFullUser(data);
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

  async findOne(id: number) {
    const usuario = await this.usersRepo.findById(id);

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

    return await this.usersRepo.updateUser(id, data);
  }

  async remove(id: number) {
    await this.findOne(id); // Verifica si existe

    // Borrado suave  Cambiamos su estado a false (inactivo) uwu
    return await this.usersRepo.updateStatus(id, false);
  }
}
