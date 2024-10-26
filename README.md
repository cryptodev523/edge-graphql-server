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

## Exercise

### Database Entity

The database should store “Edge” entities. An edge is an object with the following attributes:
- `id`: primary generated uuid column.
- `created_at`: field with the date when the entity is created.
- `updated_at`: field with the date when the entity was last updated.
- `capacity`: a random number between 10,000 and 1,000,000.
- `node1_alias`: a string field.
- `node2_alias`: a string field.

### GraphQL API

- Query: getEdges
    - Get an array of all the edges stored in the database.
- Query: getEdge
    - Get one edge based on the id. The query needs an id argument.
- Mutation: createEdge
    - Create a new edge in the database. The mutation needs the node1_alias and node2_alias as arguments.
    - After the new edge is saved in the database, send the object to a RabbitMQ queue.

### GraphQL Schema

`EdgeObject`
- `id`: primary generated uuid column.
- `created_at`: string field with the date in ISO string format.
- `updated_at`: string field with the date in ISO string format.
- `capacity`: a string field.
- `node1_alias`: a string field.
- `node2_alias`: a string field.
- `edge_peers`: a string field with this format “[node1_alias]-[node2_alias]”

Note, `getEdge` and `createEdge` return an EdgeObject but `getEdges` returns an array of EdgeObjects.

### RabbitMQ Handler

Inside the same NestJS server there should be a handler that takes care of processing the events sent to the RabbitMQ queue.
The handler should:
- Console logs the following string: “New channel between [node1_alias]-[node2_alias] with a capacity of [capacity] has been created.”
- Update the aliases and save them in the database.
    - node1_alias = “[node1_alias]-updated”
    - node2_alias = “[node2_alias]-updated”
