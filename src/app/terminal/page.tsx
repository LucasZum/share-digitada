"use client";

import { Elements } from "@stripe/react-stripe-js";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { getStripe } from "@/lib/stripe-client";
import { TerminalShell } from "@/components/terminal/TerminalShell";
import { StepAmount } from "@/components/terminal/StepAmount";
import { StepCardMethod } from "@/components/terminal/StepCardMethod";
import { StepCardDetails } from "@/components/terminal/StepCardDetails";
import { StepProcessing } from "@/components/terminal/StepProcessing";
import { StepResult } from "@/components/terminal/StepResult";

const stripePromise = getStripe();

// <Elements> montado uma vez e permanece durante todo o fluxo de card.
// NÃO passar clientSecret nas options — isso ativa o Payment Element (novo),
// que conflita com CardNumberElement/CardExpiryElement/CardCvcElement (legacy).
// O clientSecret vai diretamente no confirmCardPayment().
const ELEMENTS_OPTIONS = {
  appearance: {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#1E3A8A",
      borderRadius: "12px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
  },
};

export default function TerminalPage() {
  const flow = usePaymentFlow();

  return (
    <TerminalShell step={flow.step}>
      {flow.step === "amount" && (
        <StepAmount
          onSubmit={flow.submitAmount}
          loading={flow.loading}
          error={flow.error}
          onClearError={flow.clearError}
        />
      )}

      {flow.step === "card-method" && flow.amount && (
        <StepCardMethod amount={flow.amount} onDigitado={flow.goToDigitado} />
      )}

      {(flow.step === "card-details" || flow.step === "processing") && (
        <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
          {flow.step === "card-details" && flow.amount && (
            <StepCardDetails
              amount={flow.amount}
              onConfirm={flow.confirmPayment}
              loading={flow.loading}
            />
          )}
          {flow.step === "processing" && flow.amount && (
            <StepProcessing amount={flow.amount} />
          )}
        </Elements>
      )}

      {flow.step === "result" && flow.result && (
        <StepResult result={flow.result} onReset={flow.reset} />
      )}
    </TerminalShell>
  );
}
