"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { screens, screenKeys, type ScreenKey } from "../lib/screens";
import { Dialog } from "./dialog";

export function ScreenGallery() {
  const [current, setCurrent] = useState<ScreenKey>("calc");
  const [playing, setPlaying] = useState(false);
  const [large, setLarge] = useState(false);
  const tabs = useRef<Partial<Record<ScreenKey, HTMLButtonElement | null>>>({});
  const screen = screens[current];
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setCurrent(
          (key) =>
            screenKeys[(screenKeys.indexOf(key) + 1) % screenKeys.length],
        ),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    const stopWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", stopWhenHidden);
  }, []);

  function select(key: ScreenKey) {
    setPlaying(false);
    setCurrent(key);
  }
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target: number;
    if (event.key === "ArrowRight") target = (index + 1) % screenKeys.length;
    else if (event.key === "ArrowLeft")
      target = (index + screenKeys.length - 1) % screenKeys.length;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = screenKeys.length - 1;
    else return;
    event.preventDefault();
    const key = screenKeys[target];
    select(key);
    tabs.current[key]?.focus();
  }

  return (
    <div className="hero-visual gallery" id="demo">
      <div className="visual-top">
        <span>ИЗ РАБОЧЕГО ПРИЛОЖЕНИЯ</span>
        <button
          type="button"
          id="demo-play"
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? "Ⅱ Остановить" : "▶ Показ экранов"}
        </button>
      </div>
      <div className="gallery-frame">
        <div
          className="gallery-tabs"
          role="tablist"
          aria-label="Экраны программы"
        >
          {screenKeys.map((key, index) => (
            <button
              key={key}
              ref={(node) => {
                tabs.current[key] = node;
              }}
              type="button"
              role="tab"
              aria-selected={current === key}
              aria-controls="demo-panel"
              id={`tab-${key}`}
              data-stage={key}
              tabIndex={current === key ? 0 : -1}
              onClick={() => select(key)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              {String(index + 1).padStart(2, "0")} ·{" "}
              {key === "overview" ? "Обзор" : screens[key].name}
            </button>
          ))}
        </div>
        <div
          id="demo-panel"
          role="tabpanel"
          aria-labelledby={`tab-${current}`}
          tabIndex={0}
        >
          <button
            type="button"
            id="screen-open"
            className="screen-open"
            aria-label={`Открыть экран «${screen.name}» крупно`}
            onClick={() => {
              setPlaying(false);
              setLarge(true);
            }}
          >
            <img
              id="screen-image"
              src={screen.file}
              alt={screen.alt}
              width={screen.width}
              height={screen.height}
            />
            <span>Открыть крупно ↗</span>
          </button>
          <div className="gallery-description">
            <p className="eyebrow">WINDOWS-ПРИЛОЖЕНИЕ · ТЕСТОВЫЕ ДАННЫЕ</p>
            <h2 id="screen-title">{screen.title}</h2>
            <p id="screen-description">{screen.description}</p>
          </div>
        </div>
      </div>
      <div className="visual-caption">
        <span className="caption-number" id="caption-number">
          {String(screenKeys.indexOf(current) + 1).padStart(2, "0")} / 06
        </span>
        <p>
          Шесть реальных экранов на демонстрационных данных. На встрече покажем
          ваш сценарий.
        </p>
      </div>
      <Dialog
        open={large}
        onClose={() => setLarge(false)}
        id="screen-dialog"
        className="screen-dialog"
        labelledBy="screen-dialog-title"
      >
        <h2 id="screen-dialog-title">{screen.name}</h2>
        <p>Реальный интерфейс Windows-приложения · тестовые данные</p>
        <div className="screen-scroll">
          <img
            id="screen-large"
            src={screen.file}
            alt={screen.alt}
            width={screen.width}
            height={screen.height}
          />
        </div>
        <a
          id="screen-original"
          href={screen.file}
          target="_blank"
          rel="noopener"
        >
          Открыть изображение в исходном размере ↗
        </a>
      </Dialog>
    </div>
  );
}
