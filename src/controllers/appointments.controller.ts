import { FastifyReply, FastifyRequest } from "fastify";
import { AppointmentsService } from "../services/appointments.service";
import { createAppointmentBodySchema } from "../schemas/appointments.schema";

import type { CreateAppointmentBody } from "../schemas/appointments.schema";

export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateAppointmentBody }>,
    reply: FastifyReply,
  ) => {
    const { patientId, doctorId, createdAt } =
      createAppointmentBodySchema.parse(request.body);

    const appointment = await this.appointmentsService.create({
      patientId,
      doctorId,
      createdAt,
    });

    return reply.status(201).send(appointment);
  };
}
