import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyDto {
  @ApiProperty({ description: 'ID del Form', example: 1 })
  formId: number;

  @ApiProperty({ description: 'ID del Respondent', example: 2 })
  respondentId: number;
}
