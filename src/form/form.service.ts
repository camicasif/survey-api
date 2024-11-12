import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './form.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { CreateQuestionWithAnswersDto } from './dto/create-questions-with-answers.dto';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
    ) {}

    async getAllFormsOpen(): Promise<Partial<Form>[]> {
        return this.formRepository.find({
            where: {
                deleted: false,
                isOpen: true,
            },
            select: ['id', 'title', 'description'],
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
    async createOrUpdateForm(data: CreateFormDto): Promise<Form> {
        if (data.id) {
            // Verificar si el formulario existe para actualizar
            const existingForm = await this.formRepository.findOne({ where: { id: data.id } });
            if (!existingForm) {
                throw new NotFoundException(`Formulario con ID ${data.id} no encontrado.`);
            }
            // Actualizar el formulario existente con los nuevos datos
            await this.formRepository.update(data.id, data);
            return this.formRepository.findOne({ where: { id: data.id } });
        } else {
            // Crear un nuevo formulario
            const newForm = this.formRepository.create(data);
            return await this.formRepository.save(newForm);
        }
    }

    async addQuestionWithAnswers(data: CreateQuestionWithAnswersDto): Promise<Question> {
        const form = await this.formRepository.findOne({ where: { id: data.formId } });
        if (!form) {
            throw new NotFoundException(`Formulario con ID ${data.formId} no encontrado`);
        }

        // Crear la pregunta
        const question = this.questionRepository.create({
            description: data.description,
            form,
        });

        // Guardar la pregunta primero para obtener el ID
        const savedQuestion = await this.questionRepository.save(question);

        // Crear y guardar las respuestas asociadas a la pregunta
        const answers = data.answers.map(answerDto =>
          this.answerRepository.create({ description: answerDto.description, question: savedQuestion })
        );
        await this.answerRepository.save(answers);

        // Añadir las respuestas a la pregunta y retornar
        savedQuestion.answers = answers;
        return savedQuestion;
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
