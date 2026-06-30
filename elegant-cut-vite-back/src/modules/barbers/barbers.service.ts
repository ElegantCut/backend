import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbersRepository } from './barbers.repository';
import * as bcrypt from 'bcryptjs';
import { CreateBarberDto } from './dto/create.barbers.dto';
import { buildCloudinaryUrl, parseCloudinaryPhotos } from '../../common/helpers/cloudinary-url.helper';

@Injectable()
export class BarbersService {
  constructor(private readonly barbersRepo: BarbersRepository) {}

  async getAllBarbers() {
    try {
      const data = await this.barbersRepo.findAllWithPortfolioAndReviews(true);
      const mappedData = data.map((barber) => this.mapBarberWithRating(barber));
      return { success: true, data: mappedData };
    } catch (error) {
      return { success: false, data: [] };
    }
  }

  async getPublicBarbers() {
    const barbers = await this.barbersRepo.findActive();
    return barbers.map((barber) => this.mapBarberWithRating(barber));
  }

  async getBarberStats(id: number) {
    return this.barbersRepo.getStats(id);
  }

  async obtenerBarberos() {
    const data = await this.barbersRepo.findAllWithPortfolioAndReviews(false);
    return data.map((barber) => this.mapBarberWithRating(barber));
  }

    async crearBarbero(createBarberDto: CreateBarberDto) {
        // Encriptar la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createBarberDto.password_hash, salt);

        const userData = {
            prim_nombre: createBarberDto.prim_nombre,
            seg_nombre: createBarberDto.seg_nombre,
            apellido1: createBarberDto.apellido1,
            apellido2: createBarberDto.apellido2,
            email: createBarberDto.email,
            username: createBarberDto.username,
            telefono: createBarberDto.telefono,
            password_hash: hashedPassword,
        };

        const portfolioData = {
            biografia: createBarberDto.biografia || null,
            experiencia: createBarberDto.experiencia || null,
            especialidades: createBarberDto.especialidades || null,
        };

        const nuevoBarbero = await this.barbersRepo.createBarberWithPortfolio(userData, portfolioData);

        const { password_hash, ...result } = nuevoBarbero;
        return result;
    }

    async findOne(id: number) {
        const barbero = await this.barbersRepo.findOneWithDetails(id);
        if (!barbero) throw new NotFoundException(`Barbero con ID ${id} no encontrado`);
        
        const mappedBarber = this.mapBarberWithRating(barbero);
        const { password_hash, ...result } = mappedBarber;
        return result;
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe
        
        if (data.password_hash) {
            const salt = await bcrypt.genSalt(10);
            data.password_hash = await bcrypt.hash(data.password_hash, salt);
        }

        // Extraer datos del portafolio
        const portafolioData: any = {};
        if ('biografia' in data) { portafolioData.biografia = data.biografia; delete data.biografia; }
        if ('experiencia' in data) { portafolioData.experiencia = data.experiencia; delete data.experiencia; }
        if ('especialidades' in data) { portafolioData.especialidades = data.especialidades; delete data.especialidades; }

        // Actualizar usuario principal
        const actualizado = await this.barbersRepo.updateBarber(id, data);

        // Actualizar o crear portafolio si se enviaron datos
        if (Object.keys(portafolioData).length > 0) {
            const portafolioExistente = await this.barbersRepo.findPortfolioByUserId(id);

            if (portafolioExistente) {
                await this.barbersRepo.updatePortfolio(portafolioExistente.id_portafolio, portafolioData);
            } else {
                await this.barbersRepo.createPortfolio({
                    ...portafolioData,
                    id_usuario: id
                });
            }
        }

        const { password_hash, ...result } = actualizado;
        return result;
    }

    async toggleStatus(id: number) {
        const barbero = await this.findOne(id);
        const newStatus = !barbero.estado;
        
        await this.barbersRepo.updateBarber(id, { estado: newStatus });

        return { success: true, newStatus };
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica si existe
        
        // Soft delete
        return await this.barbersRepo.updateBarber(id, { estado: false });
    }

    private mapBarberWithRating(barber: any) {
        const resenas = barber.resenas_recibidas || [];
        const count = resenas.length;
        const sum = resenas.reduce((acc: number, r: any) => acc + r.calificacion, 0);
        const avg = count > 0 ? (sum / count).toFixed(1) : "5.0";

        barber.calificacion_promedio = parseFloat(avg as string);
        barber.total_resenas = count;

        // Mapear foto de perfil a URL completa de Cloudinary
        barber.foto_perfil_url = buildCloudinaryUrl(barber.foto_perfil);

        const portfolio = Array.isArray(barber.portafolios) ? barber.portafolios[0] : barber.portafolios;
        if (portfolio) {
            portfolio.calificacion = parseFloat(avg as string);
            portfolio.rese_as_count = count;

            // Parsear fotos del portafolio a URLs completas de Cloudinary
            portfolio.fotos_portafolio_urls = parseCloudinaryPhotos(portfolio.fotos_portafolio);
        }

        return barber;
    }
}
