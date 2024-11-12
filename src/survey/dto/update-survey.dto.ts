import { ApiProperty } from '@nestjs/swagger';

export class UpdateSurveyDto {
  @ApiProperty({ description: 'Tiempo total que tomó completar la encuesta en segundos', example: 300 })
  responseTime: number;

  @ApiProperty({ description: 'Indica si el encuestado completó todas las preguntas', example: true })
  completed: boolean;
}
