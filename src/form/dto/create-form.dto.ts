import { ApiProperty } from '@nestjs/swagger';

export class CreateFormDto {

  @ApiProperty({ description: 'ID del formulario (para actualizar)', example: 1, required: false })
  id?: number;

  @ApiProperty({ description: 'Título del formulario', example: 'Encuesta de Satisfacción' })
  title: string;

  @ApiProperty({ description: 'Descripción del formulario', example: 'Formulario para medir la satisfacción del cliente' })
  description: string;

}
