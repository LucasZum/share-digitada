"use client";

import React, { useState, useEffect } from "react";
import { FlowStep } from "@/types/payment";
import { HistoryModal } from "@/components/terminal/HistoryModal";

interface TerminalShellProps {
  step: FlowStep;
  children: React.ReactNode;
}

const STEPS: { key: FlowStep; label: string }[] = [
  { key: "amount", label: "Valor" },
  { key: "card-method", label: "Cartão" },
  { key: "processing", label: "Processando" },
  { key: "result", label: "Resultado" },
];

// card-details é sub-etapa de card-method (mesmo índice visual)
const stepIndex = (step: FlowStep) => {
  if (step === "card-details") return STEPS.findIndex((s) => s.key === "card-method");
  return STEPS.findIndex((s) => s.key === step);
};

function SessionClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono">{time}</span>;
}

export function TerminalShell({ step, children }: TerminalShellProps) {
  const currentIndex = stepIndex(step);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-share-navy flex items-center justify-center p-4">
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}
      <div className="w-full max-w-sm">

        {/* Barra de sistema interno */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-share-success animate-pulse" />
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Sessão ativa</span>
          </div>
          <span className="text-[10px] text-white/30 font-mono">
            <SessionClock />
          </span>
        </div>

        {/* Header / Logo */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-share-gold rounded-full flex items-center justify-center">
                <span className="text-share-navy font-black text-sm">S</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">Share</span>
            </div>
            <span className="text-white/40 text-xs tracking-widest uppercase">Venda Digitada</span>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
            title="Histórico de transações"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[9px] tracking-wide uppercase">Histórico</span>
          </button>
        </div>

        {/* Infos do terminal */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="text-[10px] text-white/25 uppercase tracking-wider">Terminal TRM-2047</span>
          <span className="text-white/15">·</span>
          <span className="text-[10px] text-white/25 uppercase tracking-wider">Op. ADM-01</span>
          <span className="text-white/15">·</span>
          <span className="text-[10px] text-white/25 uppercase tracking-wider">Matriz SP</span>
        </div>

        {/* Badge sistema interno */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Sistema Interno · Uso Restrito</span>
          </div>
        </div>

        {/* Terminal Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Step Indicator */}
          <div className="bg-share-navy/5 border-b border-gray-100 px-6 py-3">
            <div className="flex items-center justify-between">
              {STEPS.map((s, idx) => {
                const isCompleted = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <React.Fragment key={s.key}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-share-success text-white"
                            : isCurrent
                            ? "bg-share-blue text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium hidden sm:block ${
                          isCurrent ? "text-share-blue" : isCompleted ? "text-share-success" : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-2 transition-all duration-500 ${
                          idx < currentIndex ? "bg-share-success" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Screen Content */}
          <div className="p-6">{children}</div>
        </div>

        {/* Footer */}
        <div className="mt-4 space-y-1 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-widest">
            Acesso autorizado · Share Financial S.A.
          </p>
          <p className="text-white/15 text-[10px]">
            Esta operação é monitorada e registrada · v2.4.1
          </p>
        </div>

      </div>
    </div>
  );
}
