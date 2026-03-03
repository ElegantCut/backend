import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }
    // estos son los get
    @Get('availability')
    async getAvailability(@Query('date') date: string, @Query('barberId') barberId: string) {
        return this.appointmentsService.getAvailability(date, +barberId);
    }

    @Get()
    async getAll() {
        return this.appointmentsService.getAll();
    }

    //Este es el nuevo get para llevar las reservas
    @Get('barber/:id')
    async getByBarber(@Param('id') id: string) {
        return this.appointmentsService.getAppointmentsByBarber(+id);
    }



    //aca voy a añadir los post

    @Post()
    async createAppointment(@Body() CreateAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.createAppointment(CreateAppointmentDto);
    }
}
