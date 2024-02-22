import { Module } from '@nestjs/common';

import { AppService } from 'src/app.service';

@Module({
  controllers: [],
  providers:[AppService]
})
export class ViewsModule {}
