import { telegramUrl, type PublicSiteConfig } from "../lib/config";
import { LegalButton } from "./interaction-provider";

export function SiteFooter({ config }: { config: PublicSiteConfig }) {
  const telegram = telegramUrl(config);
  const seller =
    config.mode === "production"
      ? `© 2026 ${config.brand} · ${config.seller.name} · ИНН ${config.seller.inn}`
      : config.mode === "brochure"
        ? `© 2026 ${config.brand} · Знакомство с продуктом и подключение`
        : `© 2026 ${config.brand} · начало продаж`;
  return (
    <footer className="footer wrap">
      <div>
        <a className="brand" href="#" aria-label={`${config.brand} — главная`}>
          <span className="brand-crop">
            <img
              src="/assets/brand-reference.png"
              alt={config.brand}
              width={1280}
              height={853}
              loading="lazy"
            />
          </span>
        </a>
        <p>
          Рабочая система тендерного отдела.
          <br />
          Нижний Новгород · демонстрация и подключение онлайн.
        </p>
      </div>
      <div className="footer-links">
        {telegram && (
          <a
            id="footer-telegram"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram ↗
          </a>
        )}
        {config.contactEmail && (
          <a id="footer-contact" href={`mailto:${config.contactEmail}`}>
            {config.contactEmail}
          </a>
        )}
        <LegalButton kind="privacy">Обработка данных</LegalButton>
        <LegalButton kind="terms">Условия тестового периода</LegalButton>
      </div>
      <small id="seller-line">{seller}</small>
      <small id="preview-note" hidden={config.mode !== "preview"}>
        Предпросмотр. Заявки — через Telegram, оплата на сайте не подключена.
      </small>
    </footer>
  );
}
