import { AppError } from "../error/app.error";
import { DoctorsRepository } from "../repositories/doctors.repository";

import type { Doctor, DoctorSchedule } from "../generated/prisma/client";
import type {
  CreateDoctorBody,
  CreateScheduleBody,
} from "../schemas/doctors.schema";

export class DoctorsService {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  createDoctor = async (data: CreateDoctorBody): Promise<Doctor> => {
    // Aqui poderíamos verificar se já existe um médico com mesmo CRM, etc.

    const doctor = await this.doctorsRepository.createDoctor({ ...data });

    return doctor;
  };

  createSchedule = async (
    doctorId: string,
    data: CreateScheduleBody,
  ): Promise<DoctorSchedule> => {
    const doctor = await this.doctorsRepository.findById(doctorId);
    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    const hasConflict = await this.doctorsRepository.findConflict(
      doctorId,
      data,
    );
    if (hasConflict) {
      throw new AppError("This schedule conflicts with an existing one.", 409);
    }

    return await this.doctorsRepository.createSchedule(doctorId, data);
  };
}
