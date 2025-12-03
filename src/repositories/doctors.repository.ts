import { PrismaConnection } from "../lib/prisma";

import type { Doctor } from "../generated/prisma/client";
import type { DoctorCreateInput } from "../generated/prisma/models";

export interface IDoctorsRepository {
  create(data: DoctorCreateInput): Promise<Doctor>;
  findById(id: string): Promise<Doctor | null>;
}

export class DoctorsRepository implements IDoctorsRepository {
  constructor(private readonly prisma: PrismaConnection) {}

  create = async (data: DoctorCreateInput): Promise<Doctor> => {
    return this.prisma.doctor.create({ data });
  };

  findById = async (id: string): Promise<Doctor | null> => {
    return this.prisma.doctor.findUnique({ where: { id } });
  };
}
