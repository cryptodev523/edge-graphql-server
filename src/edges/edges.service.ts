import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Edge } from './entities/edge.entity';
import { CreateEdgeInput } from './createEdge.input';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class EdgesService {
  constructor(
    private prisma: PrismaService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async findAll(): Promise<Edge[]> {
    const edges = await this.prisma.edge.findMany();
    return edges.map((edge) => new Edge(edge));
  }

  async findOne(id: string): Promise<Edge> {
    const edge = await this.prisma.edge.findUniqueOrThrow({ where: { id } });
    return new Edge(edge);
  }

  async create(createEdgeInput: CreateEdgeInput): Promise<Edge> {
    const edge = await this.prisma.edge.create({
      data: {
        ...createEdgeInput,
        capacity: Math.floor(Math.random() * (1000000 - 10000 + 1) + 10000),
      },
    });
    await this.rabbitMQService.sendMessage(new Edge(edge));
    return new Edge(edge);
  }
}
