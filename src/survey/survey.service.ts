import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './survey.entity';
import { Form } from '../form/form.entity';
import { Respondent } from '../respondent/respondent.entity';
import { Decision } from './decision.entity';
import { Question } from '../form/question.entity';
import { Answer } from '../form/answer.entity';
import { LoggerService } from '../backoffice/logger.service';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Decision)
    private readonly decisionRepository: Repository<Decision>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(Respondent)
    private readonly respondentRepository: Repository<Respondent>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly loggerService: LoggerService

  ) {}

  async createSurvey(formId: number, respondentId: number): Promise<Survey> {
    // Cargar solo el `id` y `isOpen` del formulario
    const form = await this.formRepository.findOne({
      where: { id: formId },
      select: ['id', 'isOpen', 'nTimesTaken'],
    });
    if (!form) {
      this.loggerService.logError(`El Form con ID ${formId} no existe.`, "Error al crear una encuesta");
      throw new BadRequestException(`El formulario no existe`);
    }

    if (!form.isOpen) {
      this.loggerService.logError(`El Form con ID ${formId} no está abierto para ser usado.`, "Error al crear una encuesta");
      throw new BadRequestException(`El formulario no está abierto, hablar con el administrador.`);
    }

    // Cargar solo el `id` del encuestado
    const respondent = await this.respondentRepository.findOne({
      where: { ci: respondentId },
      select: ['ci'],
    });
    if (!respondent) {
      this.loggerService.logError(`El Respondent con ID ${respondentId} no existe.`, "Error al crear una encuesta");
      throw new BadRequestException("El encuestado no existe");
    }

    // // Verificar si ya existe una encuesta con el mismo `formId` y `respondentId`
    // const existingSurvey = await this.surveyRepository.findOne({
    //   where: { form: { id: formId }, respondent: { ci: respondentId } },
    // });
    //TODO descomentar cuando haya terminado el desarrollo
    // if (existingSurvey) {
    //   this.loggerService.logError(`Ya existe una encuesta para el Form con ID ${formId} y Respondent con ID ${respondentId}.`, "Error al crear una encuesta");
    //   throw new ConflictException(`Usted ya ha respondido este formulario`);
    // }

    const newSurvey = this.surveyRepository.create({ form, respondent });
    const savedSurvey = await this.surveyRepository.save(newSurvey);

    // Incrementar `nTimesTaken` en 1
    form.nTimesTaken += 1;
    await this.formRepository.save(form);

    return savedSurvey;
  }

  async updateSurvey(id: number, responseTime: number, completed: boolean): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({ where: { id } });
    if (!survey) throw new BadRequestException(`La encuesta con ID ${id} no existe.`);

    survey.responseTime = responseTime;
    survey.completed = completed;
    return await this.surveyRepository.save(survey);
  }

  async createDecision(surveyId: number, questionId: number, answerId: number, mouseCoordinates: { x: number; y: number }[], decisionTime: number): Promise<Decision> {

    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['form', 'form.questions'], // Incluye la relación con Form y Questions
    });
    if (!survey) throw new BadRequestException(`La encuesta con ID ${surveyId} no existe.`);

    const question = survey.form.questions.find(q => q.id === questionId);
    if (!question) throw new BadRequestException(`La pregunta con ID ${questionId} no pertenece al formulario de la encuesta con ID ${surveyId}.`);

    // Verificar que el Answer pertenece a la Question
    const answer = await this.answerRepository
      .createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('answer.id = :answerId', { answerId })
      .andWhere('question.id = :questionId', { questionId })
      .getOne();

    if (!answer) {
      throw new BadRequestException(`La respuesta con ID ${answerId} no pertenece a la pregunta con ID ${questionId}.`);
    }
    // // Verificar si ya existe un Decision con el mismo Survey y Question que no esté marcado como deleted
    // const existingDecision = await this.decisionRepository.findOne({
    //   where: { survey: { id: surveyId }, question: { id: questionId }, deleted: false },
    // });
    // if (existingDecision) throw new ConflictException(`Ya existe una decisión para la encuesta con ID ${surveyId} y la pregunta con ID ${questionId}.`);

    // Crear y guardar la nueva Decision
    const newDecision = this.decisionRepository.create({
      survey,
      question,
      answer,
      mouseCoordinates,
      decisionTime,
    });
    return await this.decisionRepository.save(newDecision);
  }
  // async getSurveyById(id: number): Promise<Survey> {
  //   return await this.surveyRepository.findOne({
  //     where: { id },
  //     relations: ['form', 'respondent'],
  //     select: {
  //       id: true,
  //       responseTime: true,
  //       completed: true,
  //       form: { id: true },
  //       respondent: { ci: true },
  //     },
  //   });
  // }


  async softDeleteSurvey(id: number): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['form'],
    });

    if (!survey) {
      throw new NotFoundException(`Survey con ID ${id} no encontrado.`);
    }

    survey.deleted = true;
    await this.surveyRepository.save(survey);

    if (survey.form && survey.form.nTimesTaken > 0) {
      survey.form.nTimesTaken -= 1;
      await this.formRepository.save(survey.form);
    }

    return survey;
  }

}
