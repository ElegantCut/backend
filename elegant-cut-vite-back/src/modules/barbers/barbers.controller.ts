import { Controller, Get, Param } from '@nestjs/common';
import { BarbersService } from './barbers.service';

@Controller('barbers')
export class BarbersController {
    constructor(private readonly barbersService: BarbersService) { }

    @Get()
    async getPublic() {
        return this.barbersService.getPublicBarbers();
    }

    @Get('admin/all')
    async getAllForAdmin() {
        return this.barbersService.getAllBarbers();
    }

    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.barbersService.getBarberStats(+id);
    }
}
