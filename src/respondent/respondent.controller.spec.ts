import { Test, TestingModule } from '@nestjs/testing';
import { RespondantController } from './respondant.controller';

describe('RespondantController', () => {
  let controller: RespondantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RespondantController],
    }).compile();

    controller = module.get<RespondantController>(RespondantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
