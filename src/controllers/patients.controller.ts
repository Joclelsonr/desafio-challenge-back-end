import { FastifyReply, FastifyRequest } from "fastify";
import { PatientsService } from "../services/patients.service";
import { createPatientSchema } from "../schemas/patients.schema";

export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, phone } = createPatientSchema.parse(request.body);

    const patient = await this.patientsService.create({ name, email, phone });

    return reply.status(201).send(patient);
  };
}
