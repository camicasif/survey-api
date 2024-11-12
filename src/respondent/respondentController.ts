import { Controller, Post, Put, Body, Param, Get, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { Respondent } from './respondent.entity';
import { LoggerService } from '../backoffice/logger.service';
import { CareerDto } from './dto/career.dto';
import { Career } from './career.entity';

@Controller('respondent')
@UseInterceptors(ClassSerializerInterceptor)
export class RespondentController {
    constructor(private readonly respondentService: RespondentService,
                private readonly loggerService: LoggerService,) {}

    @Post()
    async createOrUpdateRespondent(@Body() data: Partial<Respondent>): Promise<Respondent> {
        const respondent = await this.respondentService.saveOrUpdateRespondent(data);
        this.loggerService.log(`Respondent ${respondent.id ? 'actualizado' : 'creado'} exitosamente con ID: ${respondent.id}`);
        return respondent;
    }

    @Put(':id')
    async updateRespondent(@Param('id') id: number, @Body() data: Partial<Respondent>): Promise<Respondent> {
        data.id = id;
        const respondent = await this.respondentService.saveOrUpdateRespondent(data);
        this.loggerService.log(`Respondent actualizado exitosamente con ID: ${respondent.id}`);
        return respondent;
    }

    @Get(':ci')
    async getRespondentByCI(@Param('ci') ci: number): Promise<Respondent> {
        const respondent = await this.respondentService.getRespondentByCI(ci);
        this.loggerService.log(`Respondent con CI: ${ci} consultado exitosamente`);
        return respondent;
    }

    @Post('/career')
    async saveCareer(@Body() careerDto: CareerDto): Promise<Career> {
        const career =  await this.respondentService.saveCareer(careerDto);
        this.loggerService.log(`Career ${careerDto.id ? 'actualizado' : 'creado'} exitosamente con ID: ${careerDto.id}`);
        return career;
    }
}
