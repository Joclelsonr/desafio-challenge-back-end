import { PrismaConnection } from "../lib/prisma";

import type { Doctor, DoctorSchedule } from "../generated/prisma/client";
import type { DoctorCreateInput } from "../generated/prisma/models";
import type { CreateScheduleBody } from "../schemas/doctors.schema";

export interface IDoctorsRepository {
  createDoctor(data: DoctorCreateInput): Promise<Doctor>;
  createSchedule(
    doctorId: string,
    data: CreateScheduleBody,
  ): Promise<DoctorSchedule>;
  findById(id: string): Promise<Doctor | null>;
  findAvailability(
    doctorId: string,
    dayOfWeek: number,
    time: string,
  ): Promise<DoctorSchedule | null>;
}

export class DoctorsRepository implements IDoctorsRepository {
  constructor(private readonly prisma: PrismaConnection) {}

  createDoctor = async (data: DoctorCreateInput) => {
    return this.prisma.doctor.create({ data });
  };

  createSchedule = async (doctorId: string, data: CreateScheduleBody) => {
    return await this.prisma.doctorSchedule.create({
      data: { ...data, doctorId },
    });
  };

  findById = async (id: string): Promise<Doctor | null> => {
    return this.prisma.doctor.findUnique({ where: { id } });
  };

  findConflict = async (doctorId: string, data: CreateScheduleBody) => {
    return await this.prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        AND: [
          { availableFromWeekDay: { lte: data.availableToWeekDay } },
          { availableToWeekDay: { gte: data.availableFromWeekDay } },
          { availableFromTime: { lt: data.availableToTime } },
          { availableToTime: { gt: data.availableFromTime } },
        ],
      },
    });
  };

  async findAvailability(doctorId: string, dayOfWeek: number, time: string) {
    return this.prisma.doctorSchedule.findFirst({
      where: {
        doctorId,
        availableFromWeekDay: { lte: dayOfWeek },
        availableToWeekDay: { gte: dayOfWeek },
        availableFromTime: { lte: time },
        availableToTime: { gt: time },
      },
    });
  }
}
