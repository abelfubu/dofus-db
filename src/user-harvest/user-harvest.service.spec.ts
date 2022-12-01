import { Test, TestingModule } from '@nestjs/testing';
import { UserHarvestService } from './user-harvest.service';

describe('UserHarvestService', () => {
  let service: UserHarvestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHarvestService],
    }).compile();

    service = module.get<UserHarvestService>(UserHarvestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
