import { FastifyReply, FastifyRequest } from "fastify";
import { DoctorsService } from "../services/doctors.service";
import {
  createDoctorSchema,
  paramsScheduleSchema,
  createScheduleBodySchema,
} from "../schemas/doctors.schema";

import type {
  DoctorCreateInput,
  CreateScheduleBody,
} from "../schemas/doctors.schema";

export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  createDoctor = async (
    request: FastifyRequest<{ Body: DoctorCreateInput }>,
    reply: FastifyReply,
  ) => {
    const { name, specialty, price } = createDoctorSchema.parse(request.body);

    const doctor = await this.doctorsService.createDoctor({
      name,
      specialty,
      price,
    });

    return reply.status(201).send(doctor);
  };

  createSchedule = async (
    request: FastifyRequest<{
      Params: { doctorId: string };
      Body: CreateScheduleBody;
    }>,
    reply: FastifyReply,
  ) => {
    const { doctorId } = paramsScheduleSchema.parse(request.params);
    const {
      availableFromWeekDay,
      availableToWeekDay,
      availableFromTime,
      availableToTime,
    } = createScheduleBodySchema.parse(request.body);

    const schedule = await this.doctorsService.createSchedule(doctorId, {
      availableFromWeekDay,
      availableToWeekDay,
      availableFromTime,
      availableToTime,
    });

    return reply.status(201).send(schedule);
  };
}
