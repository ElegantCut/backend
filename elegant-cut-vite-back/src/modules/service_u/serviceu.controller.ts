import { Controller, Post, Body, Get, Put, Delete, Param } from "@nestjs/common";
import { ServiceUService } from "./serviceu.service";

@Controller('service_U')
export class ServiceUController {

    constructor(private readonly serviceU: ServiceUService) {}

    // post para subirlos 
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
    @Put('update/:id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.serviceU.update(Number(id), data);
    }

    // eliminar 
    @Delete('delete-ser/:id')
    async delete(@Param('id') id: string) {
        return this.serviceU.delete(Number(id));
    }
}
