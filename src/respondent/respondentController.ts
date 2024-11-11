import { Controller, Post, Put, Body, Param, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { Respondent } from './respondent.entity';

@Controller('respondent')
@UseInterceptors(ClassSerializerInterceptor)
export class RespondentController {
    constructor(private readonly respondentService: RespondentService) {}

    @Post()
    async createOrUpdateRespondent(@Body() data: Partial<Respondent>): Promise<Respondent> {
        return await this.respondentService.saveOrUpdateRespondent(data);
    }

    @Put(':id')
    async updateRespondent(@Param('id') id: number, @Body() data: Partial<Respondent>): Promise<Respondent> {
        data.id = id;
        return await this.respondentService.saveOrUpdateRespondent(data);
    }

    @Get(':ci')
    async getRespondentByCI(@Param('ci') ci: number): Promise<Respondent> {

        return await this.respondentService.getRespondentByCI(ci);
    }
}
