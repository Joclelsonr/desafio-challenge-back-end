import fastify from "fastify";

const app = fastify();

app.get("/", async () => {
  return { message: "Medical Appointment API is running!" };
});

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("HTTP Server Running on http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
