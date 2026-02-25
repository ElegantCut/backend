import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    async getAll() {
        return this.servicesService.findAll();
    }

    @Post()
    async create(@Body() data: any) {
        return this.servicesService.create(data);
    }
}
