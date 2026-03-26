"use client";

import { formatBRL } from "@/lib/formatters";

interface StepCardMethodProps {
  amount: number;
  onDigitado: () => void;
}

export function StepCardMethod({ amount, onDigitado }: StepCardMethodProps) {
  return (
    <div className="flex flex-col items-center py-2">
      {/* Valor da cobrança */}
      <div className="w-full bg-share-navy/5 rounded-2xl px-4 py-3 mb-8 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Cobrança</p>
        <p className="text-3xl font-black text-share-navy tracking-tight">{formatBRL(amount)}</p>
      </div>

      {/* Ícone NFC animado */}
      <div className="relative flex items-center justify-center mb-6" style={{ width: 160, height: 160 }}>
        {/* Ondas de pulso */}
        <span
          className="absolute rounded-full border-2 border-share-blue/20 animate-ping"
          style={{ width: 160, height: 160, animationDuration: "2s" }}
        />
        <span
          className="absolute rounded-full border-2 border-share-blue/30 animate-ping"
          style={{ width: 120, height: 120, animationDuration: "2s", animationDelay: "0.4s" }}
        />
        <span
          className="absolute rounded-full border-2 border-share-blue/40 animate-ping"
          style={{ width: 80, height: 80, animationDuration: "2s", animationDelay: "0.8s" }}
        />

        {/* Círculo central */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-share-blue flex items-center justify-center shadow-lg shadow-share-blue/30">
          {/* Ícone de aproximação (NFC) */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-10 h-10 text-white"
          >
            {/* Cartão */}
            <rect x="6" y="18" width="22" height="15" rx="2.5" stroke="currentColor" strokeWidth="2.2" fill="none" />
            <path d="M6 23h22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            {/* Ondas NFC */}
            <path
              d="M33 19.5a9 9 0 0 1 0 9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M37 16.5a14 14 0 0 1 0 15"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M41 14a18.5 18.5 0 0 1 0 20"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Instrução */}
      <p className="text-lg font-bold text-gray-800 text-center leading-snug mb-1">
        Aproxime o cartão
      </p>
      <p className="text-sm text-gray-400 text-center mb-8">
        ou insira no leitor
      </p>

      {/* Divisor */}
      <div className="w-full flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Botão Venda Digitada */}
      <button
        onClick={onDigitado}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-share-blue hover:text-share-blue hover:bg-share-blue/5 transition-all duration-200 active:scale-95"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M6 17h.01M10 17h4.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Venda Digitada
      </button>
    </div>
  );
}
