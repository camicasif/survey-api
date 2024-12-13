import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '../../form/answer.entity';

export class ResponseHeatMapDto {
  @ApiProperty({ description: 'ID del Form', example: 1 })
  formId: number;

  @ApiProperty({ description: 'Título del Formulario', example: 'Encuesta de Satisfacción' })
  title: string;

  @ApiProperty({ description: 'Número de veces que el formulario ha sido completado', example: 10 })
  nTimesTaken: number;

  @ApiProperty({ description: 'Estado del formulario (abierto o cerrado)', example: true })
  isOpen: boolean;

  @ApiProperty({ description: 'Descripción del Formulario', example: 'Formulario para evaluar la satisfacción del cliente' })
  description: string;

  @ApiProperty({ description: 'Preguntas del formulario', type: () => [Question] })
  questions: Question[];
}

export class Question {
  @ApiProperty({ description: 'ID de la pregunta', example: 1 })
  id: number;

  @ApiProperty({ description: 'Descripción de la pregunta', example: '¿Cuál es tu opinión?' })
  description: string;

  @ApiProperty({ description: 'Decisiones relacionadas con la pregunta', type: () => [Decision] })
  decisions: Decision[];

  @ApiProperty({ description: 'Respuestas posibles para la pregunta', type: () => [Answer] })
  answers: Answer[];
}

export class Decision {
  @ApiProperty({
    description: 'Coordenadas del mouse como un array de puntos',
    example: '[{"x": 120, "y": 340}, {"x": 121, "y": 341}]',
  })
  mouseCoordinates: { x: number; y: number }[];

  @ApiProperty({
    description: 'Tiempo que tardó el encuestado en decidir por la respuesta, en miliSegundos',
    example: 2505,
  })
  decisionTime: number;

  @ApiProperty({ description: 'ID de la respuesta elegida', example: 1 })
  idAnswer: number;
}
