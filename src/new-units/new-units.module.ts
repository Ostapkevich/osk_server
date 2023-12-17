import { Module } from '@nestjs/common';
import { NewUnitsController } from './new-units.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [NewUnitsController],
  providers: [AppService]
})
export class NewUnitsModule {}
