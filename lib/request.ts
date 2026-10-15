import { getPlan, teamOptions, type SiteConfig } from "./config.ts";

export const serviceTopics = [
  "install",
  "implementation",
  "hourly",
  "support",
] as const;
export type ServiceTopic = (typeof serviceTopics)[number];
export type RequestTopic = "trial" | "team" | "department" | ServiceTopic;

export const serviceLabels: Record<ServiceTopic, string> = {
  install: "Стандартная установка — 4 900 ₽",
  implementation: "Подготовка к работе — от 14 900 ₽",
  hourly: "Дополнительная помощь — 2 500 ₽/час",
  support: "Расширенная поддержка — 11 900 ₽ / 5 часов",
};

export function isServiceTopic(value: string | null): value is ServiceTopic {
  return serviceTopics.some((topic) => topic === value);
}

export function topicLabel(topic: RequestTopic, config: SiteConfig): string {
  if (isServiceTopic(topic)) return serviceLabels[topic];
  return topic === "trial" ? "Тестовый период" : getPlan(config, topic).name;
}

export function buildRequestMessage(
  config: SiteConfig,
  topic: RequestTopic,
  team: string,
  task: string,
): string {
  const nextStep = isServiceTopic(topic)
    ? "Хочу согласовать объём работ, сроки и стоимость до начала."
    : `Удобно начать с короткой демонстрации и ${config.trialDays}-дневного тестового периода.`;
  return `Здравствуйте! Хочу обсудить ${config.brand}.\nКоманда: ${team}.\nИнтересует: ${topicLabel(topic, config)}.\nЗадача: ${task.trim() || "Обсудим на встрече"}.\n${nextStep}`;
}

export interface RequestState {
  open: boolean;
  topic: RequestTopic;
  team: string;
  task: string;
  message: string | null;
  status: string;
}

export type RequestAction =
  | { type: "open"; topic: RequestTopic }
  | { type: "close" }
  | { type: "topic"; topic: RequestTopic }
  | { type: "team"; team: string }
  | { type: "task"; task: string }
  | { type: "prepared"; message: string; status: string }
  | { type: "status"; status: string }
  | { type: "edit" };

export function initialRequest(config: SiteConfig): RequestState {
  return {
    open: false,
    topic: "trial",
    team: teamOptions(config)[0],
    task: "",
    message: null,
    status: "",
  };
}

export function requestReducer(
  state: RequestState,
  action: RequestAction,
): RequestState {
  switch (action.type) {
    case "open":
      return {
        ...state,
        open: true,
        topic: action.topic,
        message: null,
        status: "",
      };
    case "close":
      return { ...state, open: false };
    case "topic":
      return { ...state, topic: action.topic };
    case "team":
      return { ...state, team: action.team };
    case "task":
      return { ...state, task: action.task };
    case "prepared":
      return { ...state, message: action.message, status: action.status };
    case "status":
      return { ...state, status: action.status };
    case "edit":
      return { ...state, message: null, status: "" };
  }
}
