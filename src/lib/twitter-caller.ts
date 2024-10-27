"use server";
import { Client } from "twitter-api-sdk";

export async function InvokeTwitter() {

    console.log( "Voici le bearer : " + process.env.TWITTER_BEARER_TOKEN as string);
    

  const client = new Client(process.env.TWITTER_BEARER_TOKEN as string);

  console.log("client", client.tweets);
  

  const response = await client.tweets.findTweetsById({
    "ids": [
        "1849711913262776639"
    ],
    "tweet.fields": [
        "attachments",
        "author_id",
        "context_annotations",
        "conversation_id",
        "created_at",
        "edit_controls"
    ]
  });
  
  console.log("response", JSON.stringify(response, null, 2));
}
