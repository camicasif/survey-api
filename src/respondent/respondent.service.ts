import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respondent } from './respondent.entity';
import {LoggerService} from "../backoffice/logger.service";
import { Career } from './career.entity';
import { CareerDto } from './dto/career.dto';
@Injectable()
export class RespondentService {


    constructor(
        @InjectRepository(Respondent)
        private readonly respondentRepository: Repository<Respondent>,
        @InjectRepository(Career)
        private readonly careerRepository: Repository<Career>,
        private readonly loggerService: LoggerService
    ) {}

    async saveCareer(data: CareerDto): Promise<Career> {
        if (data.id) {
            const existingCareer = await this.careerRepository.findOne({ where: { id: data.id } });
            if (!existingCareer) {
                throw new NotFoundException(`Career con ID ${data.id} no encontrado.`);
            }
            await this.careerRepository.update(data.id, data);
            return this.careerRepository.findOne({ where: { id: data.id } });
        } else {
            const newCareer = this.careerRepository.create(data);
            return await this.careerRepository.save(newCareer);
        }
    }
    async saveOrUpdateRespondent(data: Partial<Respondent>): Promise<Respondent> {
        if (data.career && data.career.id) {
            const existingCareer = await this.careerRepository.findOne({ where: { id: data.career.id } });
            if (!existingCareer) {
                throw new NotFoundException(`La carrera con id ${data.career.id} no existe.`);
            }
        }

        const existingRespondent = await this.respondentRepository.findOne({ where: { ci: data.ci } });

        if (existingRespondent) {
            // Si el encuestado ya existe, actualiza sus datos
            try {
                await this.respondentRepository.update(existingRespondent.ci, data);
                return await this.respondentRepository.findOne({
                    where: { ci: existingRespondent.ci },
                    relations: ['career']
                });
            } catch (error) {
                this.loggerService.logError(`Error al actualizar el encuestado: ${error.message}`, error.stack);
                throw error;
            }
        } else {
            try {
                const newRespondent = this.respondentRepository.create(data);
                return await this.respondentRepository.save(newRespondent);
            } catch (error) {
                this.loggerService.logError(`Error al guardar el nuevo encuestado: ${error.message}`, error.stack);
                throw error;
            }
        }
    }


    async getRespondentByCI(ci: number): Promise<Respondent> {
        return  await this.respondentRepository.findOne({
            where: { ci },
            relations: ['career'],
        });
    }

    async getAllCareers(): Promise<Partial<Career>[]> {
        return this.careerRepository.find({
            select: ['id', 'name'],
            order: {
                name: 'ASC',
            },
        });
    }

    async getAllCareersComplete(): Promise<Career[]> {
        return this.careerRepository.find({
            select: ['id', 'name','description'],
        });
    }
}
