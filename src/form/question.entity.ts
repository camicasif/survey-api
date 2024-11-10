import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Form } from './form.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'ID único generado automáticamente para la pregunta',
        example: 1,
    })
    id: number;

    @Column('text')
    @ApiProperty({
        description: 'Descripción o contenido de la pregunta',
        example: '¿Qué tan satisfecho está con nuestro servicio?',
    })
    description: string;

    @ManyToOne(() => Form, (form) => form.questions)
    @ApiProperty({
        description: 'Formulario al que pertenece la pregunta',
        type: () => Form,
    })
    form: Form;

    @OneToMany(() => Answer, (answer) => answer.question)
    @ApiProperty({
        description: 'Lista de respuestas posibles para la pregunta',
        type: () => [Answer],
    })
    answers: Answer[];
}