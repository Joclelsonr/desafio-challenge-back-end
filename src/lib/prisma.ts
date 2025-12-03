import { PrismaClient } from "../generated/prisma/client";

export class PrismaConnection extends PrismaClient {
  constructor() {
    super({
      log: [
        // "query",
        "error",
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
