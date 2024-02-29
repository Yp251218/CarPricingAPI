import { Controller, 
    Post, 
    Body, 
    UseGuards,
    Patch,
    Param,
    Get,
    Query
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service'; 
import { AuthGuard } from 'src/guards/auth.guard'; 
import { CurrentUser } from 'src/users/decorators/current-user.decorator'; 


import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto'; 
import { Serialize } from 'src/interceptors/serialize.interceptor'; 
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard'; 
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post() 
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        console.log(user);
        
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: number, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query)
    }
    
}
