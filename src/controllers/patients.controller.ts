import z from "zod";

import { FastifyReply, FastifyRequest } from "fastify";
import { PatientsService } from "../services/patients.service";

export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.email(),
      phone: z.string().min(14).max(15),
    });

    const { name, email, phone } = bodySchema.parse(request.body);

    const patient = await this.patientsService.create({ name, email, phone });

    return reply.status(201).send(patient);
  };
}
