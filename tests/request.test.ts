import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import type { SiteConfig } from "../lib/config.ts";
import {
  buildRequestMessage,
  initialRequest,
  isServiceTopic,
  requestReducer,
  serviceLabels,
  serviceTopics,
  topicLabel,
} from "../lib/request.ts";

const config = JSON.parse(
  readFileSync(new URL("../site.config.json", import.meta.url), "utf8").replace(
    /^\uFEFF/,
    "",
  ),
) as SiteConfig;

test("demo message is prepared from local fields with trimmed task and configured trial", () => {
  const changed = { ...config, brand: "Тестовый продукт", trialDays: 45 };
  const message = buildRequestMessage(
    changed,
    "trial",
    "До 5 человек",
    "  Контроль резервов  ",
  );
  assert.match(message, /^Здравствуйте! Хочу обсудить Тестовый продукт\./);
  assert.match(message, /Команда: До 5 человек\./);
  assert.match(message, /Интересует: Тестовый период\./);
  assert.match(message, /Задача: Контроль резервов\./);
  assert.match(message, /45-дневного тестового периода/);
  assert.match(
    buildRequestMessage(config, "trial", "До 5 человек", " \n "),
    /Задача: Обсудим на встрече\./,
  );
});

test("tariff messages use configured tariff labels without treating them as services", () => {
  const changed: SiteConfig = {
    ...config,
    plans: config.plans.map((plan) => ({
      ...plan,
      name: plan.id === "team" ? "Новая команда" : "Расширенный",
    })),
  };
  for (const topic of ["team", "department"] as const) {
    assert(
      buildRequestMessage(changed, topic, "Команда клиента", "").includes(
        `Интересует: ${topicLabel(topic, changed)}.`,
      ),
    );
    assert.match(
      buildRequestMessage(changed, topic, "Команда клиента", ""),
      /тестового периода/,
    );
  }
});

test("all four service links map to the intended offer and agreement wording", () => {
  const expected = ["install", "implementation", "hourly", "support"];
  assert.deepEqual([...serviceTopics], expected);
  for (const topic of serviceTopics) {
    assert.equal(isServiceTopic(topic), true);
    const message = buildRequestMessage(
      config,
      topic,
      "6–15 человек",
      "Настроить процесс",
    );
    assert(message.includes(`Интересует: ${serviceLabels[topic]}.`));
    assert.match(
      message,
      /согласовать объём работ, сроки и стоимость до начала/,
    );
    assert.doesNotMatch(message, /-дневного тестового периода/);
  }
  for (const value of [
    null,
    "",
    "trial",
    "team",
    "unknown",
    "INSTALL",
    "<script>",
    "support?send=true",
  ]) {
    assert.equal(isServiceTopic(value), false, String(value));
  }
});

test("prepare, edit, close and reopen preserve the local draft but clear an outdated result", () => {
  let state = initialRequest(config);
  assert.equal(state.open, false);
  assert.equal(state.message, null);
  assert.equal(
    state.team,
    `До ${config.plans.find((plan) => plan.id === "team")!.seats} человек`,
  );
  state = requestReducer(state, { type: "open", topic: "team" });
  state = requestReducer(state, { type: "team", team: "6–15 человек" });
  state = requestReducer(state, { type: "task", task: "Согласовать поставку" });
  const beforePreparation = structuredClone(state);
  const message = buildRequestMessage(
    config,
    state.topic,
    state.team,
    state.task,
  );
  state = requestReducer(state, {
    type: "prepared",
    message,
    status: "Подготовлено, не отправлено",
  });
  assert.equal(state.message, message);
  assert.equal(
    beforePreparation.message,
    null,
    "Reducer does not mutate earlier state",
  );
  state = requestReducer(state, { type: "edit" });
  assert.equal(state.message, null);
  assert.equal(state.team, beforePreparation.team);
  assert.equal(state.task, beforePreparation.task);
  state = requestReducer(state, { type: "close" });
  assert.equal(state.open, false);
  state = requestReducer(state, { type: "open", topic: "support" });
  assert.equal(state.open, true);
  assert.equal(state.topic, "support");
  assert.equal(state.message, null);
  assert.equal(state.status, "");
  assert.equal(state.task, beforePreparation.task);
});

test("user punctuation and markup-shaped text remain plain message text", () => {
  const task = '<script>alert("x")</script> & стоимость 50%';
  const message = buildRequestMessage(config, "trial", "До 5 человек", task);
  assert(message.includes(task));
  assert.equal(typeof message, "string");
  assert.doesNotMatch(message, /Сообщение отправлено/);
});
