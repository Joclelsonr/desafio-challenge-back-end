import { DoctorsRepository } from "../repositories/doctors.repository";

import type { Doctor } from "../generated/prisma/client";
import type { DoctorCreateInput } from "../generated/prisma/models";

export class DoctorsService {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  create = async (data: DoctorCreateInput): Promise<Doctor> => {
    // Aqui poderíamos verificar se já existe um médico com mesmo CRM, etc.

    const doctor = await this.doctorsRepository.create({ ...data });

    return doctor;
  };
}
