import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Edge } from './entities/edge.entity';
import { EdgesService } from './edges.service';
import { CreateEdgeInput } from './createEdge.input';

@Resolver(() => Edge)
export class EdgesResolver {
  constructor(private readonly edgesService: EdgesService) {}

  @Query(() => [Edge])
  async getEdges(): Promise<Edge[]> {
    return this.edgesService.findAll();
  }

  @Query(() => Edge)
  async getEdge(@Args('id', { type: () => ID }) id: string): Promise<Edge> {
    return this.edgesService.findOne(id);
  }

  @Mutation(() => Edge)
  async createEdge(
    @Args('createEdgeInput') createEdgeInput: CreateEdgeInput,
  ): Promise<Edge> {
    return this.edgesService.create(createEdgeInput);
  }
}
