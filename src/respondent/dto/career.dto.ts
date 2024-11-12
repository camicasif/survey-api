import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CareerDto {
  @ApiProperty({ description: 'ID de la carrera (para actualizar)', example: 1, required: false })
  id?: number;

  @ApiProperty({ description: 'Nombre de la carrera', example: 'Ingeniería de Sistemas' })
  name: string;

  @ApiProperty({ description: 'Descripción de la carrera', example: 'Carrera orientada al desarrollo de software y sistemas de información.' })
  description: string;
}
