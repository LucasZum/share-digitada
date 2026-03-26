"use client";

import { useState, useRef, useEffect } from "react";
import { parseToCentavos } from "@/lib/formatters";

interface StepAmountProps {
  onSubmit: (amountInCentavos: number) => void;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function StepAmount({ onSubmit, loading, error, onClearError }: StepAmountProps) {
  const [rawValue, setRawValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function formatInputAsBRL(digits: string): string {
    const nums = digits.replace(/\D/g, "");
    if (!nums) return "";
    const centavos = parseInt(nums, 10);
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(centavos / 100);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onClearError();
    setValidationError(null);
    const digits = e.target.value.replace(/\D/g, "");
    setRawValue(digits);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const centavos = parseToCentavos(formatInputAsBRL(rawValue));
    if (centavos < 100) {
      setValidationError("Valor mínimo é R$ 1,00");
      return;
    }
    onSubmit(centavos);
  }

  const displayValue = formatInputAsBRL(rawValue);
  const centavos = parseToCentavos(displayValue);
  const isValid = centavos >= 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-share-blue bg-share-blue/10 px-2 py-0.5 rounded-full">
            Nova Transação
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Informe o Valor</h2>
        <p className="text-sm text-gray-400">Digite o valor total a debitar no cartão do cliente.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none">
            R$
          </span>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder="0,00"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-xl font-bold text-gray-800 text-right focus:outline-none focus:border-share-blue transition-colors placeholder:text-gray-300"
            disabled={loading}
          />
        </div>

        {(validationError || error) && (
          <p className="text-sm text-share-error font-medium">
            {validationError ?? error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-3.5 px-4 bg-share-blue text-white font-bold rounded-xl text-sm transition-all duration-200 hover:bg-share-sky disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Aguarde...
          </>
        ) : (
          <>
            Continuar
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
