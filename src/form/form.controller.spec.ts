import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { LoggerService } from '../backoffice/logger.service';
import { CreateFormDto } from './dto/create-form.dto';
import { CreateQuestionWithAnswersDto } from './dto/create-questions-with-answers.dto';

describe('FormController', () => {
  let controller: FormController;
  let formService: FormService;
  let loggerService: LoggerService;

  const mockFormService = {
    getAllFormsOpen: jest.fn(),
    getFormWithQuestionsAndAnswers: jest.fn(),
    toggleFormStatus: jest.fn(),
    createOrUpdateForm: jest.fn(),
    addQuestionWithAnswers: jest.fn(),
    softDeleteQuestion: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        { provide: FormService, useValue: mockFormService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    controller = module.get<FormController>(FormController);
    formService = module.get<FormService>(FormService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call formService.getAllFormsOpen and return forms', async () => {
    const mockForms = [{ id: 1, title: 'Test Form', isOpen: true }];
    mockFormService.getAllFormsOpen.mockResolvedValue(mockForms);

    const result = await controller.getAllFormsOpen();
    expect(result).toEqual(mockForms);
    expect(formService.getAllFormsOpen).toHaveBeenCalled();
    expect(loggerService.log).toHaveBeenCalledWith('Fetching all open forms');
  });

  it('should get a form with questions and answers by id', async () => {
    const mockForm = { id: 1, title: 'Test Form', questions: [] };
    mockFormService.getFormWithQuestionsAndAnswers.mockResolvedValue(mockForm);

    const result = await controller.getFormWithQuestionsAndAnswers(1);
    expect(result).toEqual(mockForm);
    expect(formService.getFormWithQuestionsAndAnswers).toHaveBeenCalledWith(1);
    expect(loggerService.log).toHaveBeenCalledWith('Fetching form with ID: 1');
  });

  it('should toggle form status', async () => {
    const mockForm = { id: 1, title: 'Test Form', isOpen: false };
    mockFormService.toggleFormStatus.mockResolvedValue(mockForm);

    const result = await controller.toggleFormStatus(1, true);
    expect(result).toEqual(mockForm);
    expect(formService.toggleFormStatus).toHaveBeenCalledWith(1, true);
    expect(loggerService.log).toHaveBeenCalledWith('Toggling form status with ID: 1 to isOpen: true');
  });

  it('should create or update a form', async () => {
    const createFormDto: CreateFormDto = { title: 'New Form', description: 'Test Description' };
    const mockForm = { id: 1, ...createFormDto };
    mockFormService.createOrUpdateForm.mockResolvedValue(mockForm);

    const result = await controller.createOrUpdateForm(createFormDto);
    expect(result).toEqual(mockForm);
    expect(formService.createOrUpdateForm).toHaveBeenCalledWith(createFormDto);
    expect(loggerService.log).toHaveBeenCalledWith('Creating a new form');
  });

  it('should add a question with answers', async () => {
    const createQuestionDto: CreateQuestionWithAnswersDto = {
      formId: 1,
      description: 'Sample Question',
      answers: [{ description: 'Answer 1' }, { description: 'Answer 2' }],
    };
    const mockQuestion = { id: 1, description: createQuestionDto.description, answers: createQuestionDto.answers };
    mockFormService.addQuestionWithAnswers.mockResolvedValue(mockQuestion);

    const result = await controller.addQuestionWithAnswers(createQuestionDto);
    expect(result).toEqual(mockQuestion);
    expect(formService.addQuestionWithAnswers).toHaveBeenCalledWith(createQuestionDto);
    expect(loggerService.log).toHaveBeenCalledWith('Adding question to form with ID: 1');
  });

  it('should soft delete a question by id', async () => {
    const mockQuestion = { id: 1, description: 'Test Question', deleted: true };
    mockFormService.softDeleteQuestion.mockResolvedValue(mockQuestion);

    const result = await controller.softDeleteQuestion(1);
    expect(result).toEqual(mockQuestion);
    expect(formService.softDeleteQuestion).toHaveBeenCalledWith(1);
    expect(loggerService.log).toHaveBeenCalledWith('Soft deleting question with ID: 1');
  });
});
