"use client";

import { useEffect, useState } from "react";
import { PaymentResult } from "@/types/payment";
import { formatBRL } from "@/lib/formatters";

interface StepResultProps {
  result: PaymentResult;
  onReset: () => void;
}

export function StepResult({ result, onReset }: StepResultProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = result.status === "success";

  return (
    <div className="flex flex-col items-center py-6 space-y-5">
      {/* Icon */}
      <div
        className={`transition-all duration-500 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
      >
        {isSuccess ? (
          <div className="w-24 h-24 rounded-full bg-share-success/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-share-success"
              fill="none"
              viewBox="0 0 48 48"
              style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))" }}
            >
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
              <path
                d="M14 24l8 8 14-14"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 100,
                  animation: visible ? "check-draw 0.5s ease-out 0.2s forwards" : "none",
                  strokeDashoffset: visible ? undefined : 100,
                }}
              />
            </svg>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-share-error/10 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-share-error"
              fill="none"
              viewBox="0 0 48 48"
              style={{ filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))" }}
            >
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
              <path
                d="M17 17l14 14M31 17L17 31"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 100,
                  animation: visible ? "check-draw 0.4s ease-out 0.2s forwards" : "none",
                  strokeDashoffset: visible ? undefined : 100,
                }}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Status text */}
      <div
        className={`text-center transition-all duration-500 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      >
        <h2
          className={`text-xl font-black mb-1 ${isSuccess ? "text-share-success" : "text-share-error"}`}
        >
          {isSuccess ? "Pagamento Aprovado!" : "Pagamento Recusado"}
        </h2>
        {result.amount !== undefined && (
          <p className="text-2xl font-black text-gray-800 mt-1">{formatBRL(result.amount)}</p>
        )}
      </div>

      {/* Details card */}
      <div
        className={`w-full bg-gray-50 rounded-xl p-4 space-y-2 transition-all duration-500 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      >
        {isSuccess && result.paymentIntentId && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">ID da transação</span>
            <span className="text-xs font-mono text-gray-700 truncate max-w-36">
              {result.paymentIntentId}
            </span>
          </div>
        )}

        {!isSuccess && result.errorMessage && (
          <div className="flex gap-2 items-start">
            <svg className="w-4 h-4 text-share-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-gray-700">{result.errorMessage}</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-share-success flex-shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M8 1L2 4v4c0 3.31 2.57 6.41 6 7 3.43-.59 6-3.69 6-7V4L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-gray-500">Transação processada com segurança</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={onReset}
        className={`w-full py-3.5 px-4 font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isSuccess
            ? "bg-share-success text-white hover:bg-emerald-600"
            : "bg-share-blue text-white hover:bg-share-sky"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M2 8h12M8 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {isSuccess ? "Nova Venda" : "Tentar Novamente"}
      </button>
    </div>
  );
}
