import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),    // Shield protects your app from common attacks e.g. SQL injection
    detectBot({     // Create a bot detection rule
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      allow: [        // Block all bots except the following
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
    slidingWindow({
        mode: "LIVE",
        max: 100,
        interval:60
    }),
  ],
});

export default aj;