import { Doctor, DoctorSchedule } from "../generated/prisma/client";
import {
  CreateDoctorBody,
  CreateScheduleBody,
} from "../schemas/doctors.schema";

export interface IDoctorsRepository {
  createDoctor(data: CreateDoctorBody): Promise<Doctor>;
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
