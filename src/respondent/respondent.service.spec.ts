import { Test, TestingModule } from '@nestjs/testing';
import { RespondantService } from './respondant.service';

describe('RespondantService', () => {
  let service: RespondantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespondantService],
    }).compile();

    service = module.get<RespondantService>(RespondantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
