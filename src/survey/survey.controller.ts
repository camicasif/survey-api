import { Controller, Post, Put, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { Survey } from './survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { Decision } from './decision.entity';

@Controller('survey')
export class SurveyController {
    constructor(private readonly surveyService: SurveyService) {}

    @Post()
    async createSurvey(@Body() createSurveyDto: CreateSurveyDto): Promise<Survey> {
        const { formId, respondentId } = createSurveyDto;
        return await this.surveyService.createSurvey(formId, respondentId);
    }

    @Put(':id')
    async updateSurvey(
      @Param('id') id: number,
      @Body() updateSurveyDto: UpdateSurveyDto
    ): Promise<Survey> {
        const { responseTime, completed } = updateSurveyDto;
        return await this.surveyService.updateSurvey(id, responseTime, completed);
    }

    @Post('/decision')
    async createDecision(@Body() createDecisionDto: CreateDecisionDto): Promise<Decision> {
        const { surveyId, questionId, answerId, mouseCoordinates, decisionTime } = createDecisionDto;
        return await this.surveyService.createDecision(surveyId, questionId, answerId, mouseCoordinates, decisionTime);
    }

    @Patch(':id/delete')
    async softDeleteSurvey(@Param('id', ParseIntPipe) id: number): Promise<Survey> {
        return await this.surveyService.softDeleteSurvey(id);
    }
}
