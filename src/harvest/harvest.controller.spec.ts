import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from './harvest.controller';

describe('HarvestController', () => {
  let controller: HarvestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
