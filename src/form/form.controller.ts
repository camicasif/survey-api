import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { FormService } from './form.service';
import { Form } from './form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateQuestionWithAnswersDto } from './dto/create-questions-with-answers.dto';
import { Question } from './question.entity';

@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Get()
    async getAllFormsOpen(): Promise<Partial<Form>[]> {
        return await this.formService.getAllFormsOpen();
    }

    @Get(':id')
    async getFormWithQuestionsAndAnswers(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<Form> {
        return await this.formService.getFormWithQuestionsAndAnswers(id);
    }

    @Patch(':id/toggle')
    async toggleFormStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('isOpen') isOpen: boolean
    ): Promise<Form> {
        return await this.formService.toggleFormStatus(id, isOpen);
    }

    @Post()
    async createOrUpdateForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
        return await this.formService.createOrUpdateForm(createFormDto);
    }

    @Post('/question')
    async addQuestionWithAnswers(@Body() createQuestionDto: CreateQuestionWithAnswersDto): Promise<Question> {
        return await this.formService.addQuestionWithAnswers(createQuestionDto);
    }

    @Patch(':id/delete')
    async softDeleteQuestion(@Param('id', ParseIntPipe) id: number): Promise<Question> {
        return await this.formService.softDeleteQuestion(id);
    }
}
