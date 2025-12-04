import { formatCurrency, formatDateAndTime } from "../utils/formatters";

import type { Appointment, Doctor } from "../generated/prisma/client";

type AppointmentWithDoctor = Appointment & { doctor: Doctor };

export class AppointmentPresenter {
  static toHTTP(appointment: AppointmentWithDoctor) {
    const { date, time } = formatDateAndTime(appointment.createdAt);

    return {
      id: appointment.id,
      status: appointment.status,
      date: date,
      hour: time,
      value: formatCurrency(appointment.doctor.price),
      doctor: {
        id: appointment.doctor.id,
        name: appointment.doctor.name,
        specialty: appointment.doctor.specialty,
      },
    };
  }
}
