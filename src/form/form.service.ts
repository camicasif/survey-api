import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './form.entity';

@Injectable()
export class FormService {
    constructor(
        @InjectRepository(Form)
        private readonly formRepository: Repository<Form>,
    ) {}

    async getAllForms(): Promise<Partial<Form>[]> {
        return this.formRepository.find({
            select: ['id', 'title', 'description'],
        });
    }
}
