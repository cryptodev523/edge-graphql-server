import { Module } from '@nestjs/common';
import { EdgesResolver } from './edges.resolver';
import { EdgesService } from './edges.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [PrismaModule],
  providers: [EdgesResolver, EdgesService, RabbitMQService],
})
export class EdgesModule {}
