/**
 * Converte centavos para string formatada em BRL
 * Ex: 12500 → "R$ 125,00"
 */
export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

/**
 * Converte string de input (ex: "125,00" ou "125.00") para centavos inteiros
 * Ex: "125,00" → 12500
 */
export function parseToCentavos(input: string): number {
  const normalized = input.replace(/\./g, "").replace(",", ".");
  const value = parseFloat(normalized);
  if (isNaN(value)) return 0;
  return Math.round(value * 100);
}

/**
 * Mapeia códigos de erro do Stripe para mensagens amigáveis em PT-BR
 */
export function stripeErrorToMessage(code?: string, message?: string): string {
  const map: Record<string, string> = {
    card_declined: "Cartão recusado pelo emissor.",
    insufficient_funds: "Saldo insuficiente no cartão.",
    incorrect_cvc: "CVV incorreto.",
    expired_card: "Cartão vencido.",
    incorrect_number: "Número do cartão inválido.",
    invalid_expiry_month: "Mês de validade inválido.",
    invalid_expiry_year: "Ano de validade inválido.",
    invalid_cvc: "CVV inválido.",
    processing_error: "Erro de processamento. Tente novamente.",
    do_not_honor: "Transação não autorizada pelo banco emissor.",
    lost_card: "Cartão bloqueado. Entre em contato com o banco.",
    stolen_card: "Cartão bloqueado. Entre em contato com o banco.",
    blocked: "Transação bloqueada.",
    authentication_required: "Autenticação necessária. Tente outro cartão.",
  };

  if (code && map[code]) return map[code];
  if (message) return message;
  return "Pagamento não aprovado. Tente novamente.";
}
