import { app } from "./app";
import { env } from "./config/env";

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(app.printRoutes());
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
