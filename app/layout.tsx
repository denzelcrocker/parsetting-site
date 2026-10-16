import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getSiteConfig } from "../lib/site-config";
import { InteractionProvider } from "../components/interaction-provider";
import "./globals.css";

export function generateMetadata(): Metadata {
  const config = getSiteConfig();
  const live = config.mode !== "preview";
  return {
    title: `${config.brand} — от расчёта тендера до отгрузки`,
    description: `Рабочая система для поставщиков в разных отраслях: расчёт комплектующих, закупка, резервы и план отгрузки. Одна карточка для всей команды. Запросите ${config.trialDays}-дневный тестовый период.`,
    robots: { index: config.indexable, follow: config.indexable },
    ...(live
      ? { metadataBase: new URL(config.domain), alternates: { canonical: "/" } }
      : {}),
    openGraph: {
      title: `${config.brand} — от входящих тендеров до отгрузки`,
      description: `Расчёт, закупка, исполнение и общая история тендера. ${config.trialDays} дней тестового периода для вашей команды.`,
      type: "website",
      ...(live ? { url: new URL(config.domain).origin + "/" } : {}),
    },
    icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  };
}

export const viewport: Viewport = { themeColor: "#cf342f" };

export default function RootLayout({ children }: { children: ReactNode }) {
  const config = getSiteConfig();
  return (
    <html lang="ru">
      <body>
        <InteractionProvider config={config}>{children}</InteractionProvider>
      </body>
    </html>
  );
}
