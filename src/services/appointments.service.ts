import { AppError } from "../error/app.error";
import { AppointmentsRepository } from "../repositories/appointments.repository";
import { DoctorsRepository } from "../repositories/doctors.repository";
import { PatientsRepository } from "../repositories/patients.repository";
import { MailService } from "./mail.service";
import { AppointmentStatus } from "../generated/prisma/client";

import type { Appointment } from "../generated/prisma/client";
import type { CreateAppointmentBody } from "../schemas/appointments.schema";

export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly patientsRepository: PatientsRepository,
    private readonly mailService: MailService,
  ) {}

  create = async ({
    patientId,
    doctorId,
    createdAt,
  }: CreateAppointmentBody): Promise<Appointment> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(createdAt!);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < today) {
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

    // TODO: Send Email
    await this.mailService.sendEmailAppointmentsConfirmation(
      patient.email,
      patient.name,
      doctor.specialty,
      appointmentDate,
      Number(doctor.price),
    );

    return appointment;
  };

  cancel = async (appointmentId: string): Promise<void> => {
    const appointment =
      await this.appointmentsRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (appointment.status === AppointmentStatus.CANCELED) {
      throw new AppError("Appointment is already canceled", 400);
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.createdAt);
    const differenceInMs = appointmentDate.getTime() - now.getTime();
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    if (differenceInHours < 2) {
      throw new AppError(
        "You can only cancel appointments at least 2 hours in advance.",
        400,
      );
    }

    await this.appointmentsRepository.cancel(appointmentId);
  };
}
