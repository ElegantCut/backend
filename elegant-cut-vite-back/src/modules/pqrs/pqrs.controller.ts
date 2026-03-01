import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PqrsService } from './pqrs.service';

@Controller('pqrs')
export class PqrsController {
    constructor(private readonly pqrsService: PqrsService) { }

    @Post()
    async create(@Body() data: any) {
        return this.pqrsService.create(data);
    }

    @Get()
    async obtenerPqrs() {
        return this.pqrsService.obtenerPqrs();
    }
}
