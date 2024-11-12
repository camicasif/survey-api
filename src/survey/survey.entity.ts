import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Form } from '../form/form.entity';
import { Respondent } from '../respondent/respondent.entity';
import {Auditable} from "../backoffice/auditable.entity";

@Entity()
export class Survey extends Auditable{
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'ID único de la encuesta', example: 1 })
    id: number;

    @ManyToOne(() => Form )
    @ApiProperty({ description: 'Formulario al que pertenece la encuesta', type: () => Form })
    form: Form;

    @ManyToOne(() => Respondent )
    @ApiProperty({ description: 'Encuestado que tomó la encuesta', type: () => Respondent })
    respondent: Respondent;

    @Column('int',{ default: 0 })
    @ApiProperty({ description: 'Tiempo total que tomó completar la encuesta en segundos', example: 300 })
    responseTime: number;

    @Column('boolean', { default: false })
    @ApiProperty({ description: 'Indica si el encuestado completó todas las preguntas', example: true })
    completed: boolean;
}
