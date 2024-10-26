import { Injectable } from '@nestjs/common';
import { Connection, Channel, connect } from 'amqplib';
import { Edge } from '../edges/entities/edge.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  constructor(private prisma: PrismaService) {
    this.connect();
  }

  private async connect() {
    this.connection = await connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue('edge_queue');
    this.consume();
  }

  async sendMessage(edge: Edge) {
    this.channel.sendToQueue('edge_queue', Buffer.from(JSON.stringify(edge)));
  }

  private async consume() {
    this.channel.consume('edge_queue', async (msg) => {
      if (msg !== null) {
        const edge: Edge = JSON.parse(msg.content.toString());
        console.log(
          `New channel between ${edge.node1_alias} and ${edge.node2_alias} with a capacity of ${edge.capacity} has been created.`,
        );

        await this.prisma.edge.update({
          where: { id: edge.id },
          data: {
            node1_alias: `${edge.node1_alias}-updated`,
            node2_alias: `${edge.node2_alias}-updated`,
          },
        });

        this.channel.ack(msg);
      }
    });
  }
}
