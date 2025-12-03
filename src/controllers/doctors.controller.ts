import z from "zod";

import { FastifyReply, FastifyRequest } from "fastify";
import { DoctorsService } from "../services/doctors.service";

export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  createDoctor = async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      name: z.string().min(3),
      specialty: z.string().min(3),
      price: z.number().positive(),
    });

    const { name, specialty, price } = bodySchema.parse(request.body);

    const doctor = await this.doctorsService.create({ name, specialty, price });

    return reply.status(201).send(doctor);
  };
}
