import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './form.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { FormService } from './form.service';
import { FormController } from './form.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Form, Question, Answer])
  ],
  providers: [FormService],
  controllers: [FormController],
  exports: [TypeOrmModule],
})
export class FormModule {}
