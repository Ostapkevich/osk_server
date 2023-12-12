import { Module } from '@nestjs/common';
import { NewUnitsController } from './new-units.controller';
import { NewUnitsService } from './new-units.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [NewUnitsController],
  providers: [NewUnitsService, AppService]
})
export class NewUnitsModule {}
