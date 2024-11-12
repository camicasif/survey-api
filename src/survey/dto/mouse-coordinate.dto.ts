import { ApiProperty } from '@nestjs/swagger';

export class MouseCoordinateDto {
  @ApiProperty({ description: 'Posición X del mouse', example: 120 })
  x: number;

  @ApiProperty({ description: 'Posición Y del mouse', example: 340 })
  y: number;
}
