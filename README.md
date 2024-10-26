# edge-graphql-server

## Objective

- Build a GraphQL API using NestJS that does basic CRUD operations into a Postgres database and that sends events into a RabbitMQ queue.
- The same NestJS server should be listening to events from this RabbitMQ queue and handle them correctly.
- Everything should be written and well typed using Typescript.

## Prerequisites

- Node.js
- Docker and Docker Compose
- npm or yarn

## Setup and Running Instructions

1. Clone the repository:
   ```
   git clone git@github.com:cryptodev523/edge-graphql-server.git
   cd edge-graphql-server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="postgresql://dev:dev1234@localhost:5432/edge_db?schema=public"
   ```

4. Start the Postgres and RabbitMQ services using Docker Compose:
   ```
   docker-compose up -d
   ```
   This command will start both Postgres and RabbitMQ instances in Docker containers.


5. Run Prisma migrations to set up the database schema:
   ```
   npm run prisma:db:push
   ```

6. Start the NestJS server:
   ```
   npm run start:dev
   ```

The server should now be running on `http://localhost:3000/graphql`.

## Testing the GraphQL API

You can use tools like GraphQL Playground or Postman to test the API. Here are some example queries and mutations:

1. Create an Edge:
   ```graphql
   mutation {
     createEdge(createEdgeInput: {
       node1_alias: "node1",
       node2_alias: "node2"
     }) {
       id
       node1_alias
       node2_alias
       capacity
       edge_peers
     }
   }
   ```

2. Get all Edges:
   ```graphql
   query {
     getEdges {
       id
       node1_alias
       node2_alias
       capacity
       edge_peers
     }
   }
   ```

3. Get a specific Edge:
   ```graphql
   query {
     getEdge(id: "your-edge-id") {
       id
       node1_alias
       node2_alias
       capacity
       edge_peers
     }
   }
   ```

## Stopping the Services

To stop the Postgres and RabbitMQ services:
```
docker-compose down
```
