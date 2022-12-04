import { Module } from '@nestjs/common';
import { GraphsModule } from './graphs/graphs.module';
import { GraphsController } from './graphs/graphs.controller';
import { GraphsService } from './graphs/graphs.service';

@Module({
  imports: [GraphsModule],
  controllers: [ GraphsController],
  providers: [ GraphsService],
})
export class AppModule {}
