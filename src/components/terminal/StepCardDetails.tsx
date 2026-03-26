"use client";

import { useRef, useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeCardNumberElement } from "@stripe/stripe-js";
import { formatBRL } from "@/lib/formatters";

interface StepCardDetailsProps {
  amount: number; // centavos
  onConfirm: (stripe: NonNullable<ReturnType<typeof useStripe>>, cardElement: StripeCardNumberElement) => void;
  loading: boolean;
}

const ELEMENT_STYLE = {
  base: {
    fontSize: "16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#1f2937",
    "::placeholder": { color: "#9ca3af" },
  },
  invalid: { color: "#ef4444" },
};

export function StepCardDetails({ amount, onConfirm, loading }: StepCardDetailsProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const cardNumberRef = useRef<StripeCardNumberElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    cardNumberRef.current = cardNumber;
    setCardError(null);
    onConfirm(stripe, cardNumber);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Dados do Cartão</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Cobrança:</span>
          <span className="text-sm font-bold text-share-blue">{formatBRL(amount)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Card Number */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Número do Cartão
          </label>
          <div className="border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-share-blue transition-colors">
            <CardNumberElement
              options={{ style: ELEMENT_STYLE, showIcon: true }}
              onChange={(e) => {
                if (e.error) setCardError(e.error.message);
                else setCardError(null);
              }}
            />
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Validade</label>
            <div className="border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-share-blue transition-colors">
              <CardExpiryElement
                options={{ style: ELEMENT_STYLE }}
                onChange={(e) => {
                  if (e.error) setCardError(e.error.message);
                  else setCardError(null);
                }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">CVV</label>
            <div className="border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-share-blue transition-colors">
              <CardCvcElement
                options={{ style: ELEMENT_STYLE }}
                onChange={(e) => {
                  if (e.error) setCardError(e.error.message);
                  else setCardError(null);
                }}
              />
            </div>
          </div>
        </div>

        {cardError && (
          <p className="text-sm text-share-error font-medium">{cardError}</p>
        )}
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg">
        <svg className="w-4 h-4 text-share-success flex-shrink-0" fill="none" viewBox="0 0 16 16">
          <path d="M8 1L2 4v4c0 3.31 2.57 6.41 6 7 3.43-.59 6-3.69 6-7V4L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xs text-gray-500">Dados protegidos com criptografia SSL</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3.5 px-4 bg-share-blue text-white font-bold rounded-xl text-sm transition-all duration-200 hover:bg-share-sky disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Cobrar {formatBRL(amount)}
          </>
        )}
      </button>
    </form>
  );
}
