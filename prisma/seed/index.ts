import { prismaConnection } from "../../src/lib/database";

async function seed() {
  console.log("Starting seeding...");

  //  2 PACIENTES
  await prismaConnection.patient.create({
    data: {
      name: "João da Silva",
      email: "joao.silva@example.com",
      phone: "(11) 99999-1111",
    },
  });
  await prismaConnection.patient.create({
    data: {
      name: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      phone: "(21) 98888-2222",
    },
  });

  // 2 MÉDICOS COM AGENDA ÚNICA

  // Médico 1: Cardiologista (Segunda a Sexta, 08h as 18h)
  await prismaConnection.doctor.create({
    data: {
      name: "Dr. Roberto Coração",
      specialty: "Cardiologia",
      price: 350.0,
      schedules: {
        create: [
          {
            availableFromWeekDay: 1, // Segunda
            availableToWeekDay: 5, // Sexta
            availableFromTime: "08:00",
            availableToTime: "18:00",
          },
        ],
      },
    },
  });

  // Médico 2: Dermatologista (Terça a Sábado, 09h as 12h)
  await prismaConnection.doctor.create({
    data: {
      name: "Dra. Cláudia Pele",
      specialty: "Dermatologia",
      price: 280.0,
      schedules: {
        create: [
          {
            availableFromWeekDay: 2, // Terça
            availableToWeekDay: 6, // Sábado
            availableFromTime: "09:00",
            availableToTime: "12:00",
          },
        ],
      },
    },
  });

  // 2 MÉDICOS COM MÚLTIPLAS AGENDAS
  // Médico 3: Pediatra (Agenda quebrada: Manhã no começo da semana, Tarde no fim)
  await prismaConnection.doctor.create({
    data: {
      name: "Dr. Gregory House",
      specialty: "Diagnóstico",
      price: 500.0,
      schedules: {
        create: [
          // Agenda 1: Seg a Qua, 08h as 12h
          {
            availableFromWeekDay: 1,
            availableToWeekDay: 3,
            availableFromTime: "08:00",
            availableToTime: "12:00",
          },
          // Agenda 2: Qui e Sex, 14h as 19h
          {
            availableFromWeekDay: 4,
            availableToWeekDay: 5,
            availableFromTime: "14:00",
            availableToTime: "19:00",
          },
        ],
      },
    },
  });

  // Médico 4: Ortopedista (Plantões de fim de semana e início de semana)
  await prismaConnection.doctor.create({
    data: {
      name: "Dra. Bones",
      specialty: "Ortopedia",
      price: 400.0,
      schedules: {
        create: [
          // Agenda 1: Segunda o dia todo
          {
            availableFromWeekDay: 1,
            availableToWeekDay: 1, // Só segunda
            availableFromTime: "08:00",
            availableToTime: "20:00",
          },
          // Agenda 2: Sexta e Sábado de manhã
          {
            availableFromWeekDay: 5,
            availableToWeekDay: 6,
            availableFromTime: "07:00",
            availableToTime: "13:00",
          },
        ],
      },
    },
  });

  console.log("Database seeded");
}

seed()
  .then(async () => {
    await prismaConnection.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaConnection.$disconnect();
    process.exit(1);
  });
