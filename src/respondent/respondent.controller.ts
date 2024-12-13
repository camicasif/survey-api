import {
    Controller,
    Post,
    Put,
    Body,
    Param,
    Get,
    ClassSerializerInterceptor,
    UseInterceptors,
    NotFoundException, BadRequestException, Query,
} from '@nestjs/common';
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
        return await this.respondentService.saveOrUpdateRespondent(data);
    }

    @Get()
    async getRespondentByCI(@Query('ci') ci: string): Promise<Respondent> {
        const ciNumber = parseInt(ci, 10); // Convierte `ci` a número

        if (isNaN(ciNumber)) {
            throw new BadRequestException('El CI debe ser un número válido.');
        }

        const respondent = await this.respondentService.getRespondentByCI(ciNumber);
        if (!respondent) {
            throw new NotFoundException(`No se encontró un encuestado con CI: ${ci}`);
        }

        return respondent;
    }

    @Get('/careers')
    async getAllCareers(): Promise<Partial<Career>[]> {
        const careers = await this.respondentService.getAllCareers();
        this.loggerService.log(`Carreras consultadas exitosamente`);
        return careers;
    }

    @Get('/careers/complete')
    async getAllCareersComplete(): Promise<Career[]> {
        const careers = await this.respondentService.getAllCareersComplete();
        this.loggerService.log(`Careers consultadas exitosamente`);
        return careers;
    }
    @Post('/career')
    async saveCareer(@Body() careerDto: CareerDto): Promise<Career> {
        const career =  await this.respondentService.saveCareer(careerDto);
        this.loggerService.log(`Career ${careerDto.id ? 'actualizado' : 'creado'} exitosamente con ID: ${careerDto.id}`);
        return career;
    }
}
