import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';
import { DashboardController } from './dashboard.controller';

@Module({
    controllers: [DashboardController],
    providers: [DashboardService, DashboardRepository],
})
export class DashboardModule { }
