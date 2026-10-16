import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  formatPrice,
  getPlan,
  publicationOptions,
  resolveConfig,
  teamOptions,
  telegramUrl,
  validateConfig,
  type SiteConfig,
  type SiteMode,
} from "../lib/config.ts";
import { legalText } from "../lib/legal.ts";

test("environment defaults preserve preview, brochure and explicit production gates", () => {
  assert.deepEqual(publicationOptions({ NODE_ENV: "development" }), {
    mode: "preview",
    indexableBrochure: false,
  });
  assert.deepEqual(publicationOptions({ NODE_ENV: "production" }), {
    mode: "brochure",
    indexableBrochure: true,
  });
  assert.deepEqual(
    publicationOptions({
      NODE_ENV: "production",
      SITE_MODE: "preview",
      SITE_INDEXABLE_BROCHURE: "",
    }),
    { mode: "preview", indexableBrochure: false },
  );
  const production = publicationOptions({
    NODE_ENV: "production",
    SITE_MODE: "production",
    SITE_INDEXABLE_BROCHURE: "",
  });
  assert.deepEqual(production, {
    mode: "production",
    indexableBrochure: false,
  });
  assert.throws(() =>
    resolveConfig(original, production.mode, production.indexableBrochure),
  );
  assert.equal(
    resolveConfig(ready, production.mode, production.indexableBrochure)
      .indexable,
    true,
  );
  assert.deepEqual(
    publicationOptions({
      NODE_ENV: "production",
      SITE_MODE: "brochure",
      SITE_INDEXABLE_BROCHURE: "false",
    }),
    { mode: "brochure", indexableBrochure: false },
  );
  assert.throws(() => publicationOptions({ SITE_INDEXABLE_BROCHURE: "yes" }));
});

const original = JSON.parse(
  readFileSync(new URL("../site.config.json", import.meta.url), "utf8").replace(
    /^\uFEFF/,
    "",
  ),
) as SiteConfig;
const ready: SiteConfig = {
  ...original,
  domain: "https://fixture-parsetting.ru",
  contactEmail: "qa@fixture-parsetting.ru",
  seller: {
    name: "Тестовая организация",
    inn: "1234567890",
    address: "Тестовый адрес",
  },
  privacyReviewed: true,
  termsReviewed: true,
  hostingPrivacyText:
    "Тестовый хостинг. Технические журналы удаляются через 7 дней.",
};

test("current config is valid for preview and brochure but cannot become production", () => {
  assert.deepEqual(validateConfig(original), []);
  assert.deepEqual(validateConfig(original, "brochure"), []);
  for (const field of [
    "seller.name",
    "seller.address",
    "seller.inn",
    "privacyReviewed / termsReviewed",
  ]) {
    assert(validateConfig(original, "production").includes(field), field);
  }
  assert.throws(() => resolveConfig(original, "production"));
  assert.deepEqual(validateConfig(ready, "production"), []);
});

test("publication mode is explicit and cannot be overridden by a config property", () => {
  assert.equal(
    resolveConfig({ ...original, mode: "production" }, "preview").mode,
    "preview",
  );
  assert.equal(resolveConfig(original, "preview").indexable, false);
  assert.equal(resolveConfig(original, "brochure").indexable, false);
  assert.equal(resolveConfig(original, "brochure", true).indexable, true);
  assert.equal(resolveConfig(ready, "production").indexable, true);
  for (const mode of ["preview", "production"] as const) {
    assert.throws(() => resolveConfig(ready, mode, true));
  }
  assert.throws(() => resolveConfig(original, "unknown" as SiteMode));
});

test("indexable brochure accepts a public HTTPS domain and rejects IP/local origins", () => {
  for (const domain of ["https://parsetting.ru", "https://parsetting.ru/"]) {
    assert.equal(
      resolveConfig({ ...original, domain }, "brochure", true).indexable,
      true,
    );
  }
  for (const domain of [
    "https://179.254.106.31",
    "https://[::1]",
    "https://localhost",
    "https://intranet.local",
    "https://intranet",
  ]) {
    assert.throws(
      () => resolveConfig({ ...original, domain }, "brochure", true),
      domain,
    );
  }
});

test("public modes reject origins with credentials, non-root paths and unapproved placeholder hosts", () => {
  const domains = [
    "http://fixture-parsetting.ru",
    "https://u:p@fixture-parsetting.ru",
    "https://fixture-parsetting.ru/?a=1",
    "https://fixture-parsetting.ru/#x",
    "https://fixture-parsetting.ru/sub",
    "https://example.com",
    "https://localhost",
    "https://fixture.test",
  ];
  for (const mode of ["brochure", "production"] as const) {
    for (const domain of domains)
      assert(
        validateConfig({ ...ready, domain }, mode).includes("domain"),
        `${mode}: ${domain}`,
      );
  }
});

test("contacts accept Telegram or email but reject injection-shaped values", () => {
  for (const contactEmail of [
    "qa@example.com\r\nBcc:other@example.com",
    "qa",
    "<script>@example.com",
  ]) {
    assert(
      validateConfig({ ...ready, contactEmail }, "production").includes(
        "contactEmail",
      ),
    );
  }
  for (const telegramUsername of [
    "other?token=x",
    "https://t.me/example",
    "<script>",
    "ab",
  ]) {
    assert(
      validateConfig({ ...ready, telegramUsername }, "brochure").includes(
        "telegramUsername",
      ),
    );
  }
  assert.deepEqual(
    validateConfig({ ...ready, contactEmail: "" }, "production"),
    [],
  );
  assert.deepEqual(
    validateConfig({ ...ready, telegramUsername: "" }, "production"),
    [],
  );
  assert(
    validateConfig(
      { ...ready, contactEmail: "", telegramUsername: "" },
      "brochure",
    ).includes("contactEmail / telegramUsername"),
  );
  assert.equal(
    telegramUrl(original),
    `https://t.me/${original.telegramUsername}`,
  );
  assert.equal(telegramUrl({ ...original, telegramUsername: "" }), undefined);
});

test("public privacy description and production owner approvals are required", () => {
  assert(
    validateConfig({ ...ready, hostingPrivacyText: "" }, "brochure").includes(
      "hostingPrivacyText",
    ),
  );
  for (const values of [
    { privacyReviewed: false },
    { termsReviewed: false },
    { privacyReviewed: "true" },
  ]) {
    assert(
      validateConfig({ ...ready, ...values }, "production").includes(
        "privacyReviewed / termsReviewed",
      ),
    );
  }
  for (const inn of ["secret", "123", "12345678901"]) {
    assert(
      validateConfig(
        { ...ready, seller: { ...ready.seller, inn } },
        "production",
      ).includes("seller.inn"),
    );
  }
  assert.deepEqual(
    validateConfig(
      { ...ready, seller: { ...ready.seller, inn: "123456789012" } },
      "production",
    ),
    [],
  );
  assert(
    validateConfig(
      { ...ready, seller: { ...ready.seller, name: "[заполнить]" } },
      "production",
    ).includes("seller.name"),
  );
});

test("trial and plan limits reject invalid values and duplicate or reversed plans", () => {
  for (const trialDays of [0, -1, 1.5, 366, "30", NaN])
    assert(validateConfig({ ...original, trialDays }).includes("trialDays"));
  assert(validateConfig({ ...original, trialSeats: 0 }).includes("trialSeats"));
  assert(
    validateConfig({
      ...original,
      plans: [...original.plans, original.plans[0]],
    }).includes("plans"),
  );
  assert(
    validateConfig({
      ...original,
      plans: [original.plans[0], original.plans[0]],
    }).includes("plans"),
  );
  assert(
    validateConfig({
      ...original,
      plans: original.plans.map((plan) => ({ ...plan, seats: 5 })),
    }).includes("plan seat order"),
  );
  assert(
    validateConfig({
      ...original,
      plans: [{ ...original.plans[0], price: 0 }, original.plans[1]],
    }).includes("plan team"),
  );
  for (const malformed of [null, [], "config"])
    assert(validateConfig(malformed).length > 0);
});

test("configured plan names, prices and derived team ranges stay consistent", () => {
  const changed: SiteConfig = {
    ...original,
    trialDays: 45,
    trialSeats: 25,
    plans: [
      { id: "team", name: "A < B", price: 3900, seats: 7 },
      { id: "department", name: "Расширенный", price: 7900, seats: 25 },
    ],
  };
  assert.deepEqual(validateConfig(changed), []);
  assert.deepEqual(teamOptions(changed), [
    "До 7 человек",
    "8–25 человек",
    "Больше 25 человек",
  ]);
  assert.equal(getPlan(changed, "team").name, "A < B");
  assert.equal(
    formatPrice(getPlan(changed, "department").price).replace(
      /[\u00a0\u202f]/g,
      " ",
    ),
    "7 900",
  );
});

test("legal text preserves preview, brochure and approved production distinctions", () => {
  const preview = resolveConfig(original, "preview");
  const brochure = resolveConfig(original, "brochure", true);
  const production = resolveConfig(ready, "production");
  assert.match(legalText("privacy", preview), /Проект для предпросмотра/);
  assert.match(legalText("terms", preview), /не готовая публичная оферта/);
  assert.match(legalText("privacy", brochure), /Это информационный сайт/);
  assert.doesNotMatch(legalText("privacy", brochure), /\[ФИО|\[ИНН\]|\[адрес/);
  assert.match(
    legalText("terms", brochure),
    /Сайт не принимает оплату и не заключает договор/,
  );
  assert(legalText("privacy", production).includes(ready.seller.name));
  assert(legalText("privacy", production).includes(ready.seller.inn));
  assert.doesNotMatch(legalText("terms", production), /Проект условий/);
  for (const config of [preview, brochure, production]) {
    assert.match(
      legalText("privacy", config),
      /не сохраняет.*cookie или localStorage/,
    );
    assert.match(
      legalText("terms", config),
      /автоматического продления и списаний нет/,
    );
    assert.match(legalText("terms", config), /Банковская карта.*не требуется/);
  }
});
