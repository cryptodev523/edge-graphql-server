import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Edge {
  constructor(partial: Partial<Edge>) {
    Object.assign(this, partial);
  }

  @Field(() => ID)
  id: string;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field()
  capacity: number;

  @Field()
  node1_alias: string;

  @Field()
  node2_alias: string;

  @Field()
  get edge_peers(): string {
    return `${this.node1_alias}-${this.node2_alias}`;
  }
}
