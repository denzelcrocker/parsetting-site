"use client";

import { useEffect, useRef, type Dispatch } from "react";
import { teamOptions, telegramUrl, type PublicSiteConfig } from "../lib/config";
import {
  buildRequestMessage,
  isServiceTopic,
  serviceTopics,
  topicLabel,
  type RequestAction,
  type RequestState,
  type RequestTopic,
} from "../lib/request";
import { Dialog } from "./dialog";
import { LegalButton } from "./interaction-provider";

export function RequestDialog({
  config,
  state,
  dispatch,
}: {
  config: PublicSiteConfig;
  state: RequestState;
  dispatch: Dispatch<RequestAction>;
}) {
  const copyButton = useRef<HTMLButtonElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const teamField = useRef<HTMLSelectElement>(null);
  const service = isServiceTopic(state.topic);
  const telegram = telegramUrl(config);
  const hasContact = Boolean(telegram || config.contactEmail);
  useEffect(() => {
    if (state.message !== null) copyButton.current?.focus();
  }, [state.message]);
  const emailUrl =
    config.contactEmail && state.message !== null
      ? `mailto:${config.contactEmail}?subject=${encodeURIComponent((service ? "Внедрение и поддержка " : "Тестовый период ") + config.brand)}&body=${encodeURIComponent(state.message)}`
      : undefined;

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(state.message || "");
      dispatch({
        type: "status",
        status: "Текст скопирован. Отправьте его выбранным способом.",
      });
    } catch {
      messageField.current?.focus();
      messageField.current?.select();
      dispatch({
        type: "status",
        status:
          "Выделили текст. Скопируйте его сочетанием Ctrl+C или через меню телефона.",
      });
    }
  }

  return (
    <Dialog
      open={state.open}
      onClose={() => dispatch({ type: "close" })}
      id="request-dialog"
      labelledBy="request-title"
    >
      <p className="eyebrow">
        {service ? "ВНЕДРЕНИЕ И ПОДДЕРЖКА" : "ЗНАКОМСТВО С ВАШИМ ПРОЦЕССОМ"}
      </p>
      <h2 id="request-title">
        {service ? (
          "Обсудим вашу задачу."
        ) : (
          <>
            Давайте посмотрим
            <br />
            один тендер.
          </>
        )}
      </h2>
      <p className="dialog-intro">
        Подготовьте сообщение и отправьте его в Telegram. Сайт ничего не
        отправляет от вашего имени.
      </p>
      <form
        id="request-form"
        hidden={state.message !== null}
        onSubmit={(event) => {
          event.preventDefault();
          if (!event.currentTarget.reportValidity()) return;
          dispatch({
            type: "prepared",
            message: buildRequestMessage(
              config,
              state.topic,
              state.team,
              state.task,
            ),
            status: hasContact
              ? "Сообщение подготовлено, но ещё не отправлено. Скопируйте текст и отправьте его в Telegram."
              : "Сообщение подготовлено, но контакт для отправки пока не настроен.",
          });
        }}
      >
        <div className="form-row">
          <label>
            Команда
            <select
              ref={teamField}
              name="team"
              value={state.team}
              onChange={(event) =>
                dispatch({ type: "team", team: event.target.value })
              }
            >
              {teamOptions(config).map((team, index) => (
                <option
                  key={team}
                  data-team-range={["team", "department", "custom"][index]}
                >
                  {team}
                </option>
              ))}
            </select>
          </label>
          <label>
            Интересует
            <select
              name="plan"
              value={state.topic}
              onChange={(event) =>
                dispatch({
                  type: "topic",
                  topic: event.target.value as RequestTopic,
                })
              }
            >
              <option value="trial">Тестовый период</option>
              {config.plans.map((plan) => (
                <option key={plan.id} value={plan.id} data-plan-name={plan.id}>
                  {plan.name}
                </option>
              ))}
              {serviceTopics.map((topic) => (
                <option key={topic} value={topic} data-service>
                  {topicLabel(topic, config)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Что хотите наладить?
          <textarea
            name="task"
            rows={3}
            maxLength={1500}
            placeholder="Например: расчёт комплектующих и контроль резервов"
            value={state.task}
            onChange={(event) =>
              dispatch({ type: "task", task: event.target.value })
            }
          />
        </label>
        <p className="dialog-intro">
          Не добавляйте личные данные и сведения из рабочей базы. Текст остаётся
          только в вашем браузере.{" "}
          <LegalButton kind="privacy" className="inline-link">
            Как обрабатываются данные
          </LegalButton>
        </p>
        <button className="button full" type="submit">
          Подготовить сообщение <span aria-hidden="true">↗</span>
        </button>
        {telegram && (
          <a
            className="direct-contact"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Или сразу написать в Telegram ↗
          </a>
        )}
      </form>
      <div id="request-result" hidden={state.message === null}>
        <label>
          Ваше сообщение
          <textarea
            ref={messageField}
            id="message-preview"
            rows={7}
            readOnly
            value={state.message || ""}
          />
        </label>
        <div className="result-actions">
          <button
            className="button"
            type="button"
            id="copy-message"
            ref={copyButton}
            onClick={copyMessage}
          >
            Скопировать
          </button>
          {telegram && (
            <a
              className="button dark"
              id="send-telegram"
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть Telegram ↗
            </a>
          )}
          {emailUrl && (
            <a className="text-link" id="send-email" href={emailUrl}>
              Открыть почту
            </a>
          )}
        </div>
        <p id="request-status" role="status" aria-live="polite">
          {state.status}
        </p>
        <button
          className="text-link"
          type="button"
          id="edit-message"
          onClick={() => {
            dispatch({ type: "edit" });
            requestAnimationFrame(() => teamField.current?.focus());
          }}
        >
          Изменить данные
        </button>
      </div>
    </Dialog>
  );
}
