import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({ description: 'ID de la respuesta (null para nuevas respuestas)', example: null })
  id?: number;

  @ApiProperty({ description: 'Descripción de la respuesta', example: 'Muy satisfecho' })
  description: string;
}

class QuestionDto {
  @ApiProperty({ description: 'ID de la pregunta (null para nuevas preguntas)', example: null })
  id?: number;

  @ApiProperty({ description: 'Descripción de la pregunta', example: '¿Qué tan satisfecho estás?' })
  description: string;

  @ApiProperty({ description: 'Lista de respuestas asociadas a la pregunta', type: [AnswerDto] })
  answers: AnswerDto[];
}

export class CreateOrUpdateFormDto {
  @ApiProperty({ description: 'ID del formulario (null para formularios nuevos)', example: null })
  id?: number;

  @ApiProperty({ description: 'Título del formulario', example: 'Encuesta de satisfacción' })
  title: string;

  @ApiProperty({ description: 'Descripción del formulario', example: 'Formulario para medir satisfacción' })
  description: string;

  @ApiProperty({ description: 'Lista de preguntas asociadas al formulario', type: [QuestionDto] })
  questions: QuestionDto[];
}
