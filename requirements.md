## Requirements

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
