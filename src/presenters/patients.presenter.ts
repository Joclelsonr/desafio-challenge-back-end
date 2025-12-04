import { Appointment, Doctor, Patient } from "../generated/prisma/client";
import { AppointmentPresenter } from "./appointments.presenter";

type PatientWithAppointments = Patient & {
  appointments?: (Appointment & { doctor: Doctor })[];
};

export class PatientsPresenter {
  static toHTTP(patient: PatientWithAppointments) {
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      appointments:
        patient.appointments?.map(AppointmentPresenter.toHTTP) || [],
    };
  }
}
