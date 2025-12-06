import { PrismaConnection } from "../lib/prisma";

import type { PatientCreateBody } from "../schemas/patients.schema";
import type { IPatientsRepository } from "../interfaces/patients.interface";

export class PatientsRepository implements IPatientsRepository {
  constructor(private readonly prisma: PrismaConnection) {}

  create = async (data: PatientCreateBody) => {
    return this.prisma.patient.create({ data });
  };

  findByEmail = async (email: string) => {
    return this.prisma.patient.findUnique({ where: { email } });
  };

  findById = async (id: string, IsAppointments = false) => {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: IsAppointments
          ? {
              include: { doctor: true },
              orderBy: { createdAt: "asc" },
            }
          : undefined,
      },
    });
  };
}
