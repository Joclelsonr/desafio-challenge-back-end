import { FastifyReply, FastifyRequest } from "fastify";

import {
  createPatientBody,
  paramsPatientSchema,
} from "../schemas/patients.schema";
import { PatientsService } from "../services/patients.service";
import { PatientsPresenter } from "../presenters/patients.presenter";

export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, phone } = createPatientBody.parse(request.body);

    const patient = await this.patientsService.create({ name, email, phone });

    return reply.status(201).send(patient);
  };

  findOne = async (
    request: FastifyRequest<{ Params: { patientId: string } }>,
    reply: FastifyReply,
  ) => {
    const { patientId } = paramsPatientSchema.parse(request.params);

    const patient = await this.patientsService.findOne(patientId);

    if (!patient) {
      return reply.status(404).send({ message: "Patient not found" });
    }

    const patientWithAppointments = PatientsPresenter.toHTTP(patient);
    console.log(patientWithAppointments);

    return reply.status(200).send(patientWithAppointments);
  };
}
