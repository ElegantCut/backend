import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Get('availability')
    async getAvailability(@Query('date') date: string, @Query('barberId') barberId: string) {
        return this.appointmentsService.getAvailability(date, +barberId);
    }

    @Post('book')
    async book(@Body() data: any) {
        return this.appointmentsService.bookAppointment(data);
    }

    @Get()
    async getAll() {
        return this.appointmentsService.getAll();
    }
}
