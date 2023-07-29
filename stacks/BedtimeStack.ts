import { StackContext, Api, Table, NextjsSite } from "sst/constructs";

export function BedtimeStack({ stack }: StackContext) {

  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
  })
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    },
    routes: {
      "POST /story": "packages/functions/src/story.handler",
    },

  });

  const site = new NextjsSite(stack, "site", {
    path: "packages/web",
    bind: [api],
    environment: {
      NEXT_PUBLIC_API_ENDPOINT: api.url,
    },
  });
}
