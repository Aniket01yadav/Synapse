import app from "./src/app.js";

import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`
    Server Running Successfully
    Environment : ${env.NODE_ENV}
    Port        : ${env.PORT}
      `);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();