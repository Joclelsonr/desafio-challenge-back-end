import { AppError } from "../error/app.error";
import { PatientsRepository } from "../repositories/patients.repository";

import type { Patient } from "../generated/prisma/client";
import type { PatientCreateInput } from "../schemas/patients.schema";

export class PatientsService {
  constructor(private readonly patientsRepository: PatientsRepository) {}

  create = async (data: PatientCreateInput): Promise<Patient> => {
    const patientExists = await this.patientsRepository.findByEmail(data.email);

    if (patientExists) {
      throw new AppError("E-mail already exists", 409);
    }

    const patient = await this.patientsRepository.create({ ...data });

    return patient;
  };

  findOne = async (id: string): Promise<Patient | null> => {
    return this.patientsRepository.findById(id, true);
  };
}
