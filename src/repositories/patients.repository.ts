import { PrismaConnection } from "../lib/prisma";

import type { Patient } from "../generated/prisma/client";
import type { PatientCreateInput } from "../schemas/patients.schema";

export interface IPatientsRepository {
  create(data: PatientCreateInput): Promise<Patient>;
  findByEmail(email: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
}

export class PatientsRepository implements IPatientsRepository {
  constructor(private readonly prisma: PrismaConnection) {}

  create = async (data: PatientCreateInput) => {
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
