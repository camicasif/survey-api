import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { CreateQuestionWithAnswersDto } from './dto/create-questions-with-answers.dto';
import { CreateOrUpdateFormDto } from './dto/create-update-form.dto';
import { LoggerService } from '../backoffice/logger.service';
import { ResponseHeatMapDto } from '../survey/dto/response-heat-map.dto';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        private readonly logger: LoggerService
    ) {}

    async getAllForms(): Promise<Form[]> {
        return this.formRepository.find({
            where: {
                deleted: false,
            },
            select: ['id', 'title','isOpen','description','nTimesTaken'],
            order: {
                title: 'ASC',
            },
        });
    }
    async getAllFormsOpen(): Promise<Form[]> {
        return this.formRepository.find({
            where: {
                deleted: false,
                isOpen: true,
            },
            select: ['id', 'title'],
            order: {
                title: 'ASC',
            },
        });
    }

    async getAllFormsOpenComplete(): Promise<Form[]> {
        return this.formRepository.find({
            where: {
                deleted: false,
                isOpen: true,
            },
            select: ['id', 'title', 'description'],
            order: {
                title: 'ASC',
            },
        });
    }

    async getFormWithQuestionsAndAnswers(formId: number): Promise<Form> {
        const form = await this.formRepository.createQueryBuilder('form')
          .leftJoinAndSelect('form.questions', 'question', 'question.deleted = :deleted', { deleted: false })
          .leftJoinAndSelect('question.answers', 'answer', 'answer.deleted = :deleted', { deleted: false })
          .where('form.id = :formId', { formId })
          .getOne();

        if (!form) {
            throw new NotFoundException(`Formulario con ID ${formId} no encontrado`);
        }

        return form;
    }

    async toggleFormStatus(id: number, isOpen: boolean): Promise<Form> {
        const form = await this.formRepository.findOne({ where: { id } });
        if (!form) {
            throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
        }

        form.isOpen = isOpen;
        return await this.formRepository.save(form);
    }
    async createOrUpdateForm(formDto: CreateOrUpdateFormDto): Promise<Form> {
        let form: Form;

        if (formDto.id) {
            this.logger.log(`Editando formulario con ID: ${formDto.id}`);

            // Buscar el formulario existente
            form = await this.formRepository.findOne({
                where: { id: formDto.id },
                relations: ['questions', 'questions.answers'],
            });

            if (!form) {
                this.logger.log(`Formulario con ID ${formDto.id} no encontrado.`);
                throw new Error('Formulario no encontrado');
            }

            // Registrar los valores actuales
            this.logger.log(`Formulario encontrado: ${JSON.stringify(form)}`);

            // Actualizar los campos del formulario
            form.title = formDto.title;
            form.description = formDto.description;

            this.logger.log(`Formulario actualizado: Título: ${form.title}, Descripción: ${form.description}`);

            // Manejar preguntas y respuestas
            await this.updateQuestionsAndAnswers(form, formDto.questions);

            await this.formRepository.save(form);

        } else {
            // Crear nuevo formulario
            form = this.formRepository.create({
                title: formDto.title,
                description: formDto.description,
            });

            await this.formRepository.save(form);

            // Agregar preguntas y respuestas
            await this.createQuestionsAndAnswers(form, formDto.questions);
        }

        return this.formRepository.findOne({
            where: { id: form.id },
            relations: ['questions', 'questions.answers'],
        });
    }

    private async createQuestionsAndAnswers(form: Form, questions: any[]) {
        for (const questionDto of questions) {
            const question = this.questionRepository.create({
                description: questionDto.description,
                form,
            });

            await this.questionRepository.save(question);

            for (const answerDto of questionDto.answers) {
                const answer = this.answerRepository.create({
                    description: answerDto.description,
                    question,
                });

                await this.answerRepository.save(answer);
            }
        }
    }

    private async updateQuestionsAndAnswers(form: Form, questions: any[]) {
        // Actualizar preguntas existentes o crear nuevas
        for (const questionDto of questions) {
            let question: Question;

            if (questionDto.id) {
                question = await this.questionRepository.findOne({
                    where: { id: questionDto.id },
                    relations: ['answers'],
                });

                if (!question) {
                    throw new Error('Pregunta no encontrada');
                }

                question.description = questionDto.description;

                await this.questionRepository.save(question);

                // Actualizar respuestas existentes o crear nuevas
                for (const answerDto of questionDto.answers) {
                    let answer: Answer;

                    if (answerDto.id) {
                        answer = await this.answerRepository.findOne({ where: { id: answerDto.id } });

                        if (!answer) {
                            throw new Error('Respuesta no encontrada');
                        }

                        answer.description = answerDto.description;
                        await this.answerRepository.save(answer);
                    } else {
                        // Nueva respuesta
                        const newAnswer = this.answerRepository.create({
                            description: answerDto.description,
                            question,
                        });

                        await this.answerRepository.save(newAnswer);
                    }
                }
            } else {
                // Nueva pregunta
                await this.createQuestionsAndAnswers(form, [questionDto]);
            }
        }
    }

    async getHeatMapData(formId: number): Promise<ResponseHeatMapDto> {
        // Recuperar el formulario con las relaciones necesarias
        const form = await this.formRepository.findOne({
            where: { id: formId },
            relations: [
                'questions', // Preguntas del formulario
                'questions.decisions', // Decisiones tomadas en las preguntas
                'questions.decisions.answer', // Respuestas asociadas a las decisiones
                'questions.answers', // Respuestas posibles para las preguntas
            ],
        });

        if (!form) {
            throw new NotFoundException(`Formulario con ID ${formId} no encontrado`);
        }

        // Transformar los datos a ResponseHeatMapDto
        const responseHeatMap: ResponseHeatMapDto = {
            formId: form.id,
            title: form.title,
            nTimesTaken: form.nTimesTaken,
            isOpen: form.isOpen,
            description: form.description,
            questions: form.questions.map((question) => ({
                id: question.id,
                description: question.description,
                decisions: question.decisions.map((decision) => ({
                    mouseCoordinates: decision.mouseCoordinates,
                    decisionTime: decision.decisionTime,
                    idAnswer: decision.answer?.id || null,
                })),
                answers: question.answers,
            })),
        };

        return responseHeatMap;
    }

    async softDeleteQuestion(id: number): Promise<Question> {
        // Buscar la Question por su ID y cargar las Answers relacionadas
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['answers'], // Cargar las respuestas asociadas a la pregunta
        });

        if (!question) {
            throw new NotFoundException(`Pregunta con ID ${id} no encontrada.`);
        }

        // Marcar la pregunta como eliminada
        question.deleted = true;
        await this.questionRepository.save(question);

        // Marcar todas las respuestas como eliminadas
        question.answers.forEach(answer => answer.deleted = true);
        await this.answerRepository.save(question.answers);

        return question;
    }
}
