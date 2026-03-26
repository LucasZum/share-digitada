export type FlowStep = "amount" | "card-method" | "card-details" | "processing" | "result";

export interface PaymentResult {
  status: "success" | "failure";
  paymentIntentId?: string;
  amount?: number; // centavos
  errorCode?: string;
  errorMessage?: string;
}
