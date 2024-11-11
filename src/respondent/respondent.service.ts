import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respondent } from './respondent.entity';
import {LoggerService} from "../backoffice/logger.service";
import { Career } from './career.entity';
@Injectable()
export class RespondentService {


    constructor(
        @InjectRepository(Respondent)
        private readonly respondentRepository: Repository<Respondent>,
        @InjectRepository(Career)
        private readonly careerRepository: Repository<Career>,
        private readonly loggerService: LoggerService
    ) {}

    async saveOrUpdateRespondent(data: Partial<Respondent>): Promise<Respondent> {
        if (data.career && data.career.id) {
            const existingCareer = await this.careerRepository.findOne({ where: { id: data.career.id } });
            if (!existingCareer) {
                throw new NotFoundException(`La carrera con id ${data.career.id} no existe.`);
            }
        }

        if (data.id) {
            const existingRespondent = await this.respondentRepository.findOne({ where: { id: data.id } });
            if (!existingRespondent) {
                throw new NotFoundException(`Respondent con id ${data.id} no encontrado.`);
            }
            try {
                await this.respondentRepository.update(data.id, data);
                return await this.respondentRepository.findOne({ where: { id: data.id }, relations: ['career'] });
            } catch (error) {
                this.loggerService.logError(`Error al actualizar el encuestado: ${error.message}`, error.stack);
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new ConflictException('El número de cédula de identidad ya existe.');
                }
                throw error;
            }
        } else {
            try {
                const newRespondent = this.respondentRepository.create(data);
                return await this.respondentRepository.save(newRespondent);
            } catch (error) {
                this.loggerService.logError(`Error al guardar el nuevo encuestado: ${error.message}`, error.stack);
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new ConflictException('El número de cédula de identidad ya existe.');
                }
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
}
