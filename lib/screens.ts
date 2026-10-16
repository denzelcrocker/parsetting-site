export const screenKeys = [
  "calc",
  "buy",
  "tenders",
  "overview",
  "reports",
  "statistics",
] as const;
export type ScreenKey = (typeof screenKeys)[number];
export interface ScreenInfo {
  file: string;
  width: number;
  height: number;
  title: string;
  name: string;
  description: string;
  alt: string;
}
export const screens: Record<ScreenKey, ScreenInfo> = {
  calc: {
    file: "/assets/screen-calculation.png",
    width: 1366,
    height: 768,
    title: "Вся поставка складывается здесь.",
    name: "Расчёт",
    description:
      "Группируйте позиции, указывайте количество и стоимость. Расчёт остаётся рядом с тендером.",
    alt: "Экран расчёта: группы товаров, количество, цены и итоговая стоимость",
  },
  buy: {
    file: "/assets/screen-purchase.png",
    width: 1366,
    height: 768,
    title: "От расчёта — к закупке.",
    name: "Закупка",
    description:
      "Поставщики, статусы позиций, номера резерва и даты поставки — в карточке закупки.",
    alt: "Экран закупки: поставщики, статусы позиций, номера резерва и даты поставки",
  },
  tenders: {
    file: "/assets/screen-tenders.png",
    width: 900,
    height: 800,
    title: "Свои тендеры — перед глазами.",
    name: "Тендеры",
    description:
      "Рабочий список специалиста: заказчики, статусы, сроки, суммы и состояние комплектующих.",
    alt: "Рабочий список тендеров специалиста: заказчик, статус, сроки и суммы",
  },
  overview: {
    file: "/assets/screen-overview.png",
    width: 1366,
    height: 900,
    title: "Общая картина для команды.",
    name: "Обзор работы",
    description:
      "План месяца и текущие задачи: подать заявки, проверить закупку, оплату и комплектующие.",
    alt: "Обзор работы: общий план месяца и задачи, требующие внимания",
  },
  reports: {
    file: "/assets/screen-reports.png",
    width: 1060,
    height: 650,
    title: "Итоги работы по периодам.",
    name: "Отчёты",
    description:
      "Договоры, оплата, закупка и прибыль — в отчётах по выбранному периоду.",
    alt: "Отчёты по периодам: договоры, оплата, закупка и прибыль",
  },
  statistics: {
    file: "/assets/screen-statistics.png",
    width: 1060,
    height: 650,
    title: "Динамика, которую видно.",
    name: "Статистика",
    description:
      "График показывает, как меняется сумма договоров по месяцам. На снимке — демонстрационные данные.",
    alt: "Статистика приложения: динамика суммы договоров по месяцам",
  },
};
