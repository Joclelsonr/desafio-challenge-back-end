import type { Patient } from "../generated/prisma/client";
import type { PatientCreateBody } from "../schemas/patients.schema";

export interface IPatientsRepository {
  create(data: PatientCreateBody): Promise<Patient>;
  findByEmail(email: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
}
