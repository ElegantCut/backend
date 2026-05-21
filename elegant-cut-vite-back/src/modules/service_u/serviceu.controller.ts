import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ServiceUService } from './serviceu.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('service_U')
export class ServiceUController {
  constructor(private readonly serviceU: ServiceUService) {}

  // post para subirlos
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upload')
  async create(@Body() data: any) {
    return this.serviceU.create(data);
  }

  // GET para obtener
  @Get()
  async findAll() {
    return this.serviceU.findAll();
  }

  // put para actualizar
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.serviceU.update(Number(id), data);
  }

  // eliminar
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete-ser/:id')
  async delete(@Param('id') id: string) {
    return this.serviceU.delete(Number(id));
  }
}
