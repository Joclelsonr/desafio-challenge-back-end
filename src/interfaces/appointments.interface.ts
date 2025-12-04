import type { Appointment } from "../generated/prisma/client";
import type { CreateAppointmentBody } from "../schemas/appointments.schema";

export interface IAppointmentsRepository {
  create(data: CreateAppointmentBody): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findDoctorConflict(doctorId: string, date: Date): Promise<Appointment | null>;
  findPatientConflict(
    patientId: string,
    date: Date,
  ): Promise<Appointment | null>;
  cancel(id: string): Promise<void>;
}
