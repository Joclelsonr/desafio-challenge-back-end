import fastify from "fastify";

import { errorHandler } from "./error/error-handler";
import { patientsRoutes } from "./routes/patients.route";
import { doctorsRoutes } from "./routes/doctors.route";

const app = fastify({
  logger: {
    transport: { target: "pino-pretty" },
  },
});

// Error handler
app.setErrorHandler(errorHandler);

// Rotas
app.register(patientsRoutes);
app.register(doctorsRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(app.printRoutes());
  app.log.info(`server listening on ${address}`);
});
