import { Controller, Get } from '@nestjs/common';
import { FormService } from './form.service';
import { Form } from './form.entity';

@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Get()
    async getAllForms(): Promise<Partial<Form>[]> {
        return await this.formService.getAllForms();
    }
}
