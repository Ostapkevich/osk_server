import { Module } from '@nestjs/common';
import { NewUnitsController } from './new-units.controller';
import { NewUnitsService } from './new-units.service';

@Module({
  controllers: [NewUnitsController],
  providers: [NewUnitsService]
})
export class NewUnitsModule {}
