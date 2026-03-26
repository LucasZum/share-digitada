"use client";

import { formatBRL } from "@/lib/formatters";

interface StepProcessingProps {
  amount: number; // centavos
}

export function StepProcessing({ amount }: StepProcessingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-5">
      {/* Animated spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-share-blue/10" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-share-blue"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-share-blue" fill="none" viewBox="0 0 32 32">
            <rect x="2" y="7" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M2 13h28" stroke="currentColor" strokeWidth="2" />
            <path d="M7 20h4M14 20h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-gray-800">Processando Pagamento</h2>
        <p className="text-sm text-gray-500">Aguarde, comunicando com o banco...</p>
      </div>

      <div className="bg-gray-50 rounded-xl px-6 py-3 text-center">
        <p className="text-xs text-gray-400 mb-1">Valor</p>
        <p className="text-2xl font-black text-share-blue">{formatBRL(amount)}</p>
      </div>

      <p className="text-xs text-gray-400 text-center max-w-48">
        Não feche ou atualize esta página durante o processamento.
      </p>
    </div>
  );
}
