import { ApiHandler } from "sst/node/api";
import { Configuration, OpenAIApi } from "openai";
import { Config } from "sst/node/config";
import { Stories } from "@bedtimeai-v3/core/stories"
// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: Config.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export const handler = ApiHandler(async (evt) => {
  const req = JSON.parse(evt.body as string);
  const userId = req.userId;
  const name = req.name;
  const theme = req.theme;

  // if (!userId) {
  //   return { statusCode: 401 };
  // }

  // if (!configuration.apiKey) {
  //   return { statusCode: 500 };
  // }

  // if (!name && !theme) {
  //   return { statusCode: 400 };
  // }

  // const freeTrial = await checkApiLimit();
  // const isPro = await checkSubscription();

  // if (!freeTrial && !isPro) {
  //   return { status: 403 };
  // }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "system", "content": "You are an imaginative bedtime story teller that uses names and themes to create stories." }, { "role": "user", "content": `Create a bedtime story about ${name} and with a theme of ${theme}.` }],
  });

  // await Stories.create({
  //   userId,
  //   story: response.data.choices[0].message?.content as string,
  // });

  // if (!isPro) {
  //   await incrementApiLimit();
  // }

  return { body: response.data.choices[0].message?.content as string };


});



