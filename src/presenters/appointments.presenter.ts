import { formatCurrency, formatDateAndTime } from "../utils/formatters";
import { AppointmentStatus } from "../generated/prisma/client";

import type { Appointment, Doctor } from "../generated/prisma/client";

type AppointmentWithDoctor = Appointment & { doctor: Doctor };

export class AppointmentPresenter {
  static toHTTP(appointment: AppointmentWithDoctor) {
    const { date, time } = formatDateAndTime(appointment.createdAt);

    const statusLabels: Record<AppointmentStatus, string> = {
      [AppointmentStatus.SCHEDULED]: "Agendado",
      [AppointmentStatus.ONGOING]: "Em consulta",
      [AppointmentStatus.FINISHED]: "Finalizado",
      [AppointmentStatus.CANCELED]: "Cancelado",
    };

    return {
      id: appointment.id,
      status: statusLabels[appointment.status],
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
