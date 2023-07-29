import { SSTConfig } from "sst";
import { BedtimeStack } from "./stacks/BedtimeStack";

export default {
  config(_input) {
    return {
      name: "bedtimeai-v3",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(BedtimeStack);
  }
} satisfies SSTConfig;
