import { StackContext, Api, Table, NextjsSite, Config } from "sst/constructs";

export function BedtimeStack({ stack }: StackContext) {

  const CLERK_SECRET_KEY = new Config.Secret(stack, "CLERK_SECRET_KEY")
  const OPENAI_KEY = new Config.Secret(stack, "OPENAI_KEY")

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
        bind: [table, CLERK_SECRET_KEY, OPENAI_KEY],
        environment: {
          TABLE_NAME: table.tableName,
        },
        timeout: 300,
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
      NEXT_PUBLIC_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  })
}
