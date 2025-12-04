import nodemailer from "nodemailer";
import "dotenv/config";

export interface ISendMailData {
  to: string;
  subject: string;
  body: string;
}

export interface IMailService {
  send(data: ISendMailData): Promise<void>;
}

export class MailService implements IMailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp",
      port: Number(process.env.MAIL_PORT) || 1025,
      secure: false,
    });
  }

  send = async ({ to, subject, body }: ISendMailData): Promise<void> => {
    await this.transporter.sendMail({
      from: "Medical Clinic <no-reply@medical.com>",
      to,
      subject,
      html: body,
    });
  };

  sendEmailAppointmentsConfirmation = async (
    email: string,
    name: string,
    specialty: string,
    date: Date,
    price: number,
  ): Promise<void> => {
    const formattedDate = date.toLocaleDateString("pt-BR");
    const formattedTime = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

    await this.send({
      to: email,
      subject: "Confirmação de Agendamento - Medical Clinic",
      body: `
        <div style="font-family: sans-serif; font-size: 16px; color: #333;">
          <h2>Olá, ${name}!</h2>
          <p>Sua consulta foi agendada com sucesso.</p>
          <hr />
          <p><strong>Médico:</strong> ${name}</p>
          <p><strong>Especialidade:</strong> ${specialty}</p>
          <p><strong>Data:</strong> ${formattedDate} às ${formattedTime}</p>
          <p><strong>Valor da Consulta:</strong> ${formattedPrice}</p>
          <hr />
          <p>Por favor, chegue com 15 minutos de antecedência.</p>
        </div>
      `,
    });

    console.log(`📧 Email sent to ${email}, check in: http://localhost:8025`);
  };
}
