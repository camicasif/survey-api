import { ApiProperty } from '@nestjs/swagger';
import { MouseCoordinateDto } from './mouse-coordinate.dto';

export class CreateDecisionDto {
  @ApiProperty({ description: 'ID de la encuesta', example: 1 })
  surveyId: number;

  @ApiProperty({ description: 'ID de la pregunta', example: 1 })
  questionId: number;

  @ApiProperty({ description: 'ID de la respuesta', example: 1 })
  answerId: number;

  @ApiProperty({
    description: 'Coordenadas del mouse como un array de puntos',
    type: [MouseCoordinateDto],
    example: [{ x: 120, y: 340 }, { x: 121, y: 341 }],
  })
  mouseCoordinates: MouseCoordinateDto[];


  @ApiProperty({ description: 'Tiempo que tardó el encuestado en decidir por la respuesta, en segundos', example: 15 })
  decisionTime: number;
}
