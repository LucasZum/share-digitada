"use client";

import { useEffect } from "react";
import { MOCK_HISTORY, HistoryEntry } from "@/data/mockHistory";
import { formatBRL } from "@/lib/formatters";

interface HistoryModalProps {
  onClose: () => void;
}

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function CardBrandIcon({ brand }: { brand: string }) {
  const colors: Record<string, string> = {
    Visa: "bg-blue-600",
    Mastercard: "bg-red-500",
    Elo: "bg-yellow-500",
  };
  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-white text-[9px] font-bold tracking-wide ${
        colors[brand] ?? "bg-gray-500"
      }`}
    >
      {brand.toUpperCase()}
    </span>
  );
}

function HistoryRow({ entry }: { entry: HistoryEntry }) {
  const { date, time } = formatDateTime(entry.date);
  const isApproved = entry.status === "approved";

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Status icon */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isApproved ? "bg-share-success/10" : "bg-share-error/10"
        }`}
      >
        {isApproved ? (
          <svg className="w-4 h-4 text-share-success" fill="none" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-share-error" fill="none" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CardBrandIcon brand={entry.cardBrand} />
          <span className="text-xs text-gray-500 font-mono">•••• {entry.cardLast4}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{date} · {time}</span>
          {isApproved && entry.authCode && (
            <span className="text-[10px] text-gray-300">Aut: {entry.authCode}</span>
          )}
          {!isApproved && entry.declineReason && (
            <span className="text-[10px] text-share-error/70 truncate">{entry.declineReason}</span>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${isApproved ? "text-gray-800" : "text-gray-400 line-through"}`}>
          {formatBRL(entry.amount)}
        </p>
        <p className={`text-[10px] font-semibold ${isApproved ? "text-share-success" : "text-share-error"}`}>
          {isApproved ? "APROVADO" : "RECUSADO"}
        </p>
      </div>
    </div>
  );
}

export function HistoryModal({ onClose }: HistoryModalProps) {
  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const approved = MOCK_HISTORY.filter((e) => e.status === "approved");
  const totalApproved = approved.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-share-navy px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-base">Histórico</h2>
            <p className="text-white/40 text-xs">Últimas transações</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Summary bar */}
        <div className="bg-share-navy/5 border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-shrink-0">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total aprovado</p>
            <p className="text-sm font-bold text-share-success">{formatBRL(totalApproved)}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Transações</p>
            <p className="text-sm font-bold text-gray-700">{MOCK_HISTORY.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Aprovadas</p>
            <p className="text-sm font-bold text-gray-700">{approved.length}</p>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {MOCK_HISTORY.map((entry) => (
            <HistoryRow key={entry.id} entry={entry} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
          <p className="text-center text-gray-300 text-[10px]">Dados demonstrativos · Share Bank</p>
        </div>
      </div>
    </div>
  );
}
