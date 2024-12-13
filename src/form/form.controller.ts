import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post, UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { Form } from './form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateQuestionWithAnswersDto } from './dto/create-questions-with-answers.dto';
import { Question } from './question.entity';
import { LoggerService } from '../backoffice/logger.service';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateOrUpdateFormDto } from './dto/create-update-form.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../backoffice/jwt.auth.guard';
import { ResponseHeatMapDto } from '../survey/dto/response-heat-map.dto';

@Controller('form')
export class FormController {
    constructor(
      private readonly formService: FormService,
      private readonly logger: LoggerService
    ) {}

    @Get()
    async getAllForms(): Promise<Form[]> {
        this.logger.log('Obteniendo todos los formularios abiertos');
        return await this.formService.getAllForms();
    }
    @Get("/open")
    async getAllFormsOpen(): Promise<Form[]> {
        this.logger.log('Obteniendo todos los formularios abiertos');
        return await this.formService.getAllFormsOpen();
    }

    @Get('/complete')
    async getAllFormsOpenComplete(): Promise<Form[]> {
        this.logger.log('Obteniendo todos los formularios completos');
        return await this.formService.getAllFormsOpenComplete();
    }

    @Get(':id')
    async getFormWithQuestionsAndAnswers(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<Form> {
        this.logger.log(`Obteniendo formulario con ID ${id} y sus preguntas y respuestas`);
        return await this.formService.getFormWithQuestionsAndAnswers(id);
    }

    @Patch(':id/toggle')
    @UseGuards(JwtAuthGuard)
    async toggleFormStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('isOpen') isOpen: boolean
    ): Promise<Form> {
        this.logger.log(`Cambiando estado del formulario con ID ${id} a ${isOpen}`);
        return await this.formService.toggleFormStatus(id, isOpen);
    }

    // @Post()
    // async createOrUpdateForm(@Body() createFormDto: CreateFormDto): Promise<Form> {
    //     if (createFormDto.id) {
    //         this.logger.log(`Actualizando formulario con ID ${createFormDto.id}`);
    //     } else {
    //         this.logger.log('Creando nuevo formulario');
    //     }
    //     return await this.formService.createOrUpdateForm(createFormDto);
    // }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Crear o actualizar un formulario' })
    @ApiBody({ type: CreateOrUpdateFormDto })
    async createOrUpdateForm(@Body() formDto: CreateOrUpdateFormDto) {
        this.logger.log(`Crear o editar formulario`);
        return this.formService.createOrUpdateForm(formDto);
    }

    // @Post('/question')
    // async addQuestionWithAnswers(@Body() createQuestionDto: CreateQuestionWithAnswersDto): Promise<Question> {
    //     this.logger.log(`Agregando pregunta al formulario con ID ${createQuestionDto.formId}`);
    //     return await this.formService.addQuestionWithAnswers(createQuestionDto);
    // }

    @Patch(':id/delete')
    @UseGuards(JwtAuthGuard)
    async softDeleteQuestion(@Param('id', ParseIntPipe) id: number): Promise<Question> {
        this.logger.log(`Marcando pregunta con ID ${id} como eliminada`);
        return await this.formService.softDeleteQuestion(id);
    }


    @Get(':id/heatmap')
    @ApiOperation({ summary: 'Obtener datos para el mapa de calor de un formulario' })
    @ApiParam({ name: 'id', description: 'ID del formulario', example: 1 })
    async getHeatMapData(@Param('id', ParseIntPipe) id: number): Promise<ResponseHeatMapDto> {
        return this.formService.getHeatMapData(id);
    }
}
