import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepository } from '../repositories/testing.repository';

@Controller('testing')
export class TestingController {
  constructor(private testingRepository: TestingRepository) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll() {
    return await this.testingRepository.clearDB();
  }
}
