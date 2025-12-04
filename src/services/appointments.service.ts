import { AppError } from "../error/app.error";
import { AppointmentsRepository } from "../repositories/appointments.repository";
import { DoctorsRepository } from "../repositories/doctors.repository";
import { PatientsRepository } from "../repositories/patients.repository";

import type { Appointment } from "../generated/prisma/client";
import type { CreateAppointmentBody } from "../schemas/appointments.schema";

export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly patientsRepository: PatientsRepository,
  ) {}

  create = async ({
    patientId,
    doctorId,
    createdAt,
  }: CreateAppointmentBody): Promise<Appointment> => {
    const appointmentDate = new Date(createdAt!);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
      throw new AppError("Invalid date", 400);
    }

    const patient = await this.patientsRepository.findById(patientId);
    if (!patient) throw new AppError("Patient not found", 404);

    const doctor = await this.doctorsRepository.findById(doctorId);
    if (!doctor) throw new AppError("Doctor not found", 404);

    const dayOfWeek = appointmentDate.getDay();
    const timeString = appointmentDate.toISOString().slice(11, 16);

    const isAvailable = await this.doctorsRepository.findAvailability(
      doctorId,
      dayOfWeek,
      timeString,
    );
    console.log("isAvailable", isAvailable);
    if (!isAvailable) {
      throw new AppError("Doctor is not available at this time/day.", 400);
    }

    const doctorConflict = await this.appointmentsRepository.findDoctorConflict(
      doctorId,
      appointmentDate,
    );
    if (doctorConflict) {
      throw new AppError(
        "Doctor already has an appointment at this time.",
        409,
      );
    }

    const patientConflict =
      await this.appointmentsRepository.findPatientConflict(
        patientId,
        appointmentDate,
      );
    if (patientConflict) {
      throw new AppError(
        "Patient already has an appointment at this time.",
        409,
      );
    }

    const appointment = await this.appointmentsRepository.create({
      patientId,
      doctorId,
      createdAt: appointmentDate,
    });

    // TODO: Enviar Email

    return appointment;
  };
}
