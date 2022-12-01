import { Test, TestingModule } from '@nestjs/testing';
import { UserHarvestController } from './user-harvest.controller';

describe('UserHarvestController', () => {
  let controller: UserHarvestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHarvestController],
    }).compile();

    controller = module.get<UserHarvestController>(UserHarvestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
