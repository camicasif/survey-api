import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({ description: 'Descripción de la respuesta', example: 'Muy satisfecho' })
  description: string;
}

export class CreateQuestionWithAnswersDto {
  @ApiProperty({ description: 'ID del formulario al que se asociará la pregunta', example: 1 })
  formId: number;

  @ApiProperty({ description: 'Descripción de la pregunta', example: '¿Qué tan satisfecho está con nuestro servicio?' })
  description: string;

  @ApiProperty({
    description: 'Lista de respuestas posibles para la pregunta',
    type: [CreateAnswerDto],
    example: [{ description: 'Muy satisfecho' }, { description: 'Satisfecho' }, { description: 'Neutral' }]
  })
  answers: CreateAnswerDto[];
}
