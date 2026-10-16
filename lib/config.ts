export type SiteMode = "preview" | "brochure" | "production";
export type PlanId = "team" | "department";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  seats: number;
}

export interface SiteConfig {
  brand: string;
  mode: SiteMode;
  domain: string;
  contactEmail: string;
  telegramUsername: string;
  seller: { name: string; inn: string; address: string };
  privacyReviewed: boolean;
  termsReviewed: boolean;
  hostingPrivacyText: string;
  trialDays: number;
  trialSeats: number;
  plans: Plan[];
}

export interface PublicSiteConfig extends SiteConfig {
  indexable: boolean;
}

export function publicationOptions(environment: {
  NODE_ENV?: string;
  SITE_MODE?: string;
  SITE_INDEXABLE_BROCHURE?: string;
}): { mode: SiteMode; indexableBrochure: boolean } {
  const mode = (environment.SITE_MODE ||
    (environment.NODE_ENV === "development"
      ? "preview"
      : "brochure")) as SiteMode;
  const flag = environment.SITE_INDEXABLE_BROCHURE || undefined;
  if (flag !== undefined && flag !== "true" && flag !== "false")
    throw new Error("SITE_INDEXABLE_BROCHURE must be true or false.");
  return {
    mode,
    indexableBrochure:
      flag === undefined
        ? mode === "brochure" && environment.NODE_ENV === "production"
        : flag === "true",
  };
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function positiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function validateConfig(
  value: unknown,
  mode: SiteMode = "preview",
): string[] {
  const config = record(value);
  const errors: string[] = [];
  if (!nonempty(config.brand)) errors.push("brand");
  if (!positiveInteger(config.trialDays) || config.trialDays > 365)
    errors.push("trialDays");
  if (!positiveInteger(config.trialSeats)) errors.push("trialSeats");
  const plans = Array.isArray(config.plans) ? config.plans.map(record) : [];
  if (
    plans.length !== 2 ||
    new Set(plans.map((plan) => plan.id)).size !== 2 ||
    plans.some((plan) => !["team", "department"].includes(String(plan.id)))
  )
    errors.push("plans");
  for (const id of ["team", "department"]) {
    const plan = plans.find((item) => item.id === id);
    if (
      !plan ||
      !nonempty(plan.name) ||
      !positiveInteger(plan.price) ||
      !positiveInteger(plan.seats)
    )
      errors.push(`plan ${id}`);
  }
  const team = plans.find((plan) => plan.id === "team");
  const department = plans.find((plan) => plan.id === "department");
  if (
    typeof department?.seats === "number" &&
    typeof team?.seats === "number" &&
    department.seats <= team.seats
  )
    errors.push("plan seat order");
  if (
    config.telegramUsername &&
    (typeof config.telegramUsername !== "string" ||
      !/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(config.telegramUsername))
  )
    errors.push("telegramUsername");
  if (
    config.contactEmail &&
    (typeof config.contactEmail !== "string" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        config.contactEmail,
      ))
  )
    errors.push("contactEmail");
  if (mode === "production" || mode === "brochure") {
    if (!config.telegramUsername && !config.contactEmail)
      errors.push("contactEmail / telegramUsername");
    if (
      typeof config.hostingPrivacyText !== "string" ||
      config.hostingPrivacyText.trim().length < 30
    )
      errors.push("hostingPrivacyText");
    try {
      const url = new URL(String(config.domain));
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname !== "/" ||
        /localhost|example\.|\.test$/.test(url.hostname)
      )
        throw new Error();
    } catch {
      errors.push("domain");
    }
  }
  if (mode === "production") {
    const seller = record(config.seller);
    for (const key of ["name", "address"])
      if (!nonempty(seller[key]) || /\[|заполнить/i.test(String(seller[key])))
        errors.push(`seller.${key}`);
    if (typeof seller.inn !== "string" || !/^(\d{10}|\d{12})$/.test(seller.inn))
      errors.push("seller.inn");
    if (config.privacyReviewed !== true || config.termsReviewed !== true)
      errors.push("privacyReviewed / termsReviewed");
  }
  return errors;
}

export function resolveConfig(
  value: unknown,
  mode: SiteMode,
  indexableBrochure = false,
): PublicSiteConfig {
  if (!["preview", "brochure", "production"].includes(mode))
    throw new Error("Unknown SITE_MODE.");
  const errors = validateConfig(value, mode);
  if (errors.length)
    throw new Error(`Не заполнены настройки публикации: ${errors.join(", ")}`);
  const config = value as SiteConfig;
  if (indexableBrochure) {
    if (mode !== "brochure")
      throw new Error("SITE_INDEXABLE_BROCHURE requires SITE_MODE=brochure.");
    const host = new URL(config.domain).hostname;
    if (
      /^\d+\.\d+\.\d+\.\d+$/.test(host) ||
      host.startsWith("[") ||
      !host.includes(".") ||
      host.endsWith(".local")
    )
      throw new Error("Индексируемый сайт требует публичный DNS-домен, не IP.");
  }
  return {
    ...config,
    mode,
    indexable: mode === "production" || indexableBrochure,
  };
}

export function getPlan(config: SiteConfig, id: PlanId): Plan {
  const plan = config.plans.find((item) => item.id === id);
  if (!plan) throw new Error(`Missing plan: ${id}`);
  return plan;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function telegramUrl(config: SiteConfig): string | undefined {
  return config.telegramUsername
    ? `https://t.me/${config.telegramUsername}`
    : undefined;
}

export function teamOptions(config: SiteConfig): string[] {
  const team = getPlan(config, "team");
  const department = getPlan(config, "department");
  return [
    `До ${team.seats} человек`,
    `${team.seats + 1}–${department.seats} человек`,
    `Больше ${department.seats} человек`,
  ];
}
