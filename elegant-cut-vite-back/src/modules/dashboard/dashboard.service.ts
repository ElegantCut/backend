import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
    constructor(private readonly dashboardRepo: DashboardRepository) { }

    async getStats() {
        return this.dashboardRepo.getSummaryStats();
    }

    async getActivity() {
        return this.dashboardRepo.getRecentActivity();
    }
}
