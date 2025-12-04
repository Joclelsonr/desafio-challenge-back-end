import { PrismaConnection } from "../lib/prisma";

import type { Appointment } from "../generated/prisma/client";
import type { AppointmentUncheckedCreateInput } from "../generated/prisma/models";

export interface IAppointmentsRepository {
  create(data: AppointmentUncheckedCreateInput): Promise<Appointment>;
  findDoctorConflict(doctorId: string, date: Date): Promise<Appointment | null>;
  findPatientConflict(
    patientId: string,
    date: Date,
  ): Promise<Appointment | null>;
}

export class AppointmentsRepository implements IAppointmentsRepository {
  constructor(private prisma: PrismaConnection) {}

  async create(data: AppointmentUncheckedCreateInput) {
    return this.prisma.appointment.create({ data });
  }

  async findDoctorConflict(doctorId: string, date: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        doctorId,
        createdAt: date,
        status: { not: "CANCELED" },
      },
    });
  }

  async findPatientConflict(patientId: string, date: Date) {
    return this.prisma.appointment.findFirst({
      where: {
        patientId,
        createdAt: date,
        status: { not: "CANCELED" },
      },
    });
  }
}
