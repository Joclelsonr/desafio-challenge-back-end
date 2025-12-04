import { PrismaConnection } from "../lib/prisma";
import { AppointmentStatus } from "../generated/prisma/client";

import type { CreateAppointmentBody } from "../schemas/appointments.schema";
import type { IAppointmentsRepository } from "../interfaces/appointments.interface";

export class AppointmentsRepository implements IAppointmentsRepository {
  constructor(private prisma: PrismaConnection) {}

  create = async (data: CreateAppointmentBody) => {
    return this.prisma.appointment.create({ data });
  };

  findById = async (id: string) => {
    return this.prisma.appointment.findUnique({ where: { id } });
  };

  findDoctorConflict = async (doctorId: string, date: Date) => {
    return this.prisma.appointment.findFirst({
      where: {
        doctorId,
        createdAt: date,
        status: { not: AppointmentStatus.CANCELED },
      },
    });
  };

  findPatientConflict = async (patientId: string, date: Date) => {
    return this.prisma.appointment.findFirst({
      where: {
        patientId,
        createdAt: date,
        status: { not: AppointmentStatus.CANCELED },
      },
    });
  };

  cancel = async (id: string) => {
    await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELED },
    });
  };
}
