import { Decimal } from "@prisma/client/runtime/library";

/**
 * * Função utilitária para formatar valores numéricos como moeda brasileira (BRL).
 *
 * @param value Valor numérico ou Decimal a ser formatado
 * @returns string → Valor formatado no padrão "R$ 1.234,56"
 *
 * ? Uso comum: exibir valores monetários em interfaces de usuário.
 */
export function formatCurrency(value: number | Decimal): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

/**
 * * Função utilitária para formatar data e hora separadamente
 *
 * @param date Objeto Date que será formatado
 * @returns { date: string, time: string }
 * ! date → Data no formato "DD MMM YYYY" (ex.: "4 dez 2025")
 * ! time → Hora no formato "HHhMM" (ex.: "14h30")
 *
 * ? Uso comum: exibir data e hora em interfaces de usuário
 */
export function formatDateAndTime(date: Date) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  const formattedTime = date
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
