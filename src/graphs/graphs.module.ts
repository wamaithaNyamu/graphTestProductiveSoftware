import { Module } from '@nestjs/common';

import { GraphsController } from './graphs.controller';
import { GraphsService } from './graphs.service';

@Module({

  controllers: [GraphsController, GraphsController],
  providers: [GraphsController, GraphsService],
})
export class GraphsModule {}
