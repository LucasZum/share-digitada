import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Share — Venda Digitada",
  description: "Terminal de pagamento MOTO · Share Bank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
