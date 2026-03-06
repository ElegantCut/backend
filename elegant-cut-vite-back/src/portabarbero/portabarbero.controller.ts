import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CreatePortaDto } from './dto/porta.dto';
import { PortabarberoService } from './portabarbero.service';

@Controller('portabarbero')
export class PortabarberoController {
    constructor(private readonly portabarberoService: PortabarberoService) { }

    //vamos a crear el método post
    @Post()
    async crearPortafolio(@Body() createPortaDto: CreatePortaDto) {
        return await this.portabarberoService.crearPortafolio(createPortaDto)
    }

    @Get(':id')
    async getPortafolioByBarber(@Param('id') id: string) {
        return await this.portabarberoService.getPortafolioByBarber(+id)
    }
}
