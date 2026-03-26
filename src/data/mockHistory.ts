export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  amount: number; // centavos
  cardLast4: string;
  cardBrand: string;
  status: "approved" | "declined";
  authCode?: string;
  declineReason?: string;
}

export const MOCK_HISTORY: HistoryEntry[] = [
  {
    id: "pi_3QxA2B",
    date: "2026-03-26T14:32:00",
    amount: 1289000,
    cardLast4: "5502",
    cardBrand: "Mastercard",
    status: "approved",
    authCode: "482731",
  },
  {
    id: "pi_3Qx9KL",
    date: "2026-03-26T11:08:00",
    amount: 549000,
    cardLast4: "4193",
    cardBrand: "Visa",
    status: "approved",
    authCode: "193847",
  },
  {
    id: "pi_3Qx7NR",
    date: "2026-03-25T17:55:00",
    amount: 3200000,
    cardLast4: "0871",
    cardBrand: "Mastercard",
    status: "approved",
    authCode: "827461",
  },
  {
    id: "pi_3Qx5VZ",
    date: "2026-03-25T15:21:00",
    amount: 750000,
    cardLast4: "2244",
    cardBrand: "Visa",
    status: "declined",
    declineReason: "Saldo insuficiente",
  },
  {
    id: "pi_3Qx3TW",
    date: "2026-03-25T10:44:00",
    amount: 4875000,
    cardLast4: "6630",
    cardBrand: "Mastercard",
    status: "approved",
    authCode: "554019",
  },
  {
    id: "pi_3Qx1GH",
    date: "2026-03-24T18:30:00",
    amount: 980000,
    cardLast4: "3318",
    cardBrand: "Elo",
    status: "approved",
    authCode: "301847",
  },
  {
    id: "pi_3Qwz9F",
    date: "2026-03-24T14:12:00",
    amount: 2100000,
    cardLast4: "7751",
    cardBrand: "Visa",
    status: "declined",
    declineReason: "Cartão recusado pelo emissor",
  },
  {
    id: "pi_3QwxLM",
    date: "2026-03-24T09:05:00",
    amount: 6500000,
    cardLast4: "9923",
    cardBrand: "Mastercard",
    status: "approved",
    authCode: "762310",
  },
  {
    id: "pi_3QwvBK",
    date: "2026-03-23T16:48:00",
    amount: 1450000,
    cardLast4: "1187",
    cardBrand: "Visa",
    status: "approved",
    authCode: "091234",
  },
  {
    id: "pi_3QwtAP",
    date: "2026-03-23T11:22:00",
    amount: 890000,
    cardLast4: "4456",
    cardBrand: "Elo",
    status: "approved",
    authCode: "445678",
  },
];
