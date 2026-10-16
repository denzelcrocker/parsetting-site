import type { PublicSiteConfig } from "../lib/config";
import { formatPrice, getPlan, telegramUrl } from "../lib/config";
import { RequestButton } from "./interaction-provider";
import { ScreenGallery } from "./screen-gallery";
import { SiteFooter } from "./site-footer";

function HeroSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="line"></span>ДЛЯ КОМАНД, КОТОРЫЕ ВЕДУТ ТЕНДЕРЫ
        </p>
        <h1>
          От входящих
          <br />
          до отгрузки.
          <br />
          <em>В одной системе.</em>
        </h1>
        <p className="lead">
          Тендер проходит через несколько рук.
          <br className="desktop" /> Его детали остаются на месте.
        </p>
        <p className="hero-description">
          Ответственный разбирает входящие, расчётчик готовит состав поставки,
          менеджер и закупщик продолжают работу. Данные тендера остаются в общей
          системе.
        </p>
        <div className="hero-actions">
          <RequestButton
            className="button"
            data-request="Тестовый период"
            topic="trial"
          >
            Попробовать <span data-trial>{config.trialDays}</span> дней{" "}
            <span aria-hidden="true">↗</span>
          </RequestButton>
          <a className="text-link" href="#demo">
            Посмотреть программу <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-facts">
          <span>Windows</span>
          <span>База у вас</span>
          <span>Без банковской карты</span>
        </div>
      </div>
      <ScreenGallery />
    </section>
  );
}

function ProofLine({ config }: { config: PublicSiteConfig }) {
  return (
    <div className="proof-line wrap">
      <span>
        <i aria-hidden="true"></i> Уже используется в ежедневной работе
      </span>
      <span>Базируемся в Нижнем Новгороде</span>
      <a href="#start">Поможем подготовить базу к работе ↗</a>
    </div>
  );
}

function ProcessBand({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="process-band full-process" aria-label="Рабочий процесс">
      <ol className="wrap">
        <li>
          <small>01</small> Найти
        </li>
        <li>
          <small>02</small> Разобрать
        </li>
        <li>
          <small>03</small> Рассчитать
        </li>
        <li>
          <small>04</small> Закупить
        </li>
        <li>
          <small>05</small> Отгрузить
        </li>
      </ol>
    </section>
  );
}

function IntakeSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section
      className="intake-section"
      id="intake"
      aria-labelledby="intake-title"
    >
      <div className="wrap intake-layout">
        <div className="intake-copy reveal">
          <p className="eyebrow">С ЧЕГО НАЧИНАЕТСЯ РАБОТА</p>
          <h2 id="intake-title">
            До расчёта —<br />
            разобрать входящие.
          </h2>
          <p className="intake-lead">
            Сначала ответственный сотрудник запускает парсинг, просматривает
            закупки и передаёт подходящие на расчёт.
          </p>
          <div className="intake-assignee">
            <span className="intake-person" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="8"
                  r="3.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></circle>
                <path
                  d="M5.5 20v-2.5A5.5 5.5 0 0 1 11 12h2a5.5 5.5 0 0 1 5.5 5.5V20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
              </svg>
            </span>
            <div>
              <strong>Администратор или ответственный менеджер</strong>
              <p>Работает с входящими в пределах назначенных прав.</p>
            </div>
          </div>
          <a className="text-link intake-next" href="#workflow">
            Дальше — расчёт, закупка и отгрузка{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="intake-process reveal">
          <ol className="intake-steps">
            <li>
              <span
                className="intake-step-number intake-step-blue"
                aria-hidden="true"
              >
                01
              </span>
              <div>
                <span className="intake-step-label">ИМПОРТ</span>
                <h3>Запустить парсинг</h3>
                <p>
                  Получить входящие закупки из ЕИС или Bico. Источник и
                  параметры выбирает ответственный сотрудник.
                </p>
                <div className="intake-sources" aria-label="Источники закупок">
                  <span>ЕИС</span>
                  <span>Bico</span>
                </div>
              </div>
            </li>
            <li>
              <span
                className="intake-step-number intake-step-red"
                aria-hidden="true"
              >
                02
              </span>
              <div>
                <span className="intake-step-label">ПЕРВИЧНЫЙ ОТБОР</span>
                <h3>Проверить входящие</h3>
                <p>
                  Сделать черновой разбор: посмотреть предмет закупки, сроки и
                  условия. Решить, что подходит компании.
                </p>
              </div>
            </li>
            <li>
              <span
                className="intake-step-number intake-step-green"
                aria-hidden="true"
              >
                03
              </span>
              <div>
                <span className="intake-step-label">ПЕРЕДАЧА В РАБОТУ</span>
                <h3>Передать на расчёт</h3>
                <p>
                  Назначить расчётчика подходящему тендеру. Дальше команда
                  работает с ним в общей карточке.
                </p>
              </div>
            </li>
          </ol>
          <p className="intake-note">
            Разбор закупок — рабочая задача; настройка подключений и доступов —
            техническая. Для отбора и передачи тендеров нужны соответствующие
            рабочие права. Доступ к платным источникам, включая Bico,
            подключается отдельно.
          </p>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="section wrap" id="workflow">
      <div className="section-heading reveal">
        <p className="eyebrow">01 / ОБЩАЯ КАРТИНА</p>
        <h2>
          Работа движется.
          <br />
          <span className="subtle">Контекст остаётся.</span>
        </h2>
        <p>
          Когда расчёт превращается в закупку, а закупка — в поставку, команде
          нужны те же данные.
        </p>
      </div>
      <p className="illustration-note">
        Ниже — схемы рабочего процесса на условном примере поставки.
      </p>
      <div className="handoff-grid">
        <article className="handoff reveal">
          <div className="handoff-top">
            <span className="role-tag red">Расчётчик</span>
            <span>01</span>
          </div>
          <h3>
            Из чего складывается
            <br />
            поставка?
          </h3>
          <p>
            Группы товаров, производители, поставщики, количество и цены — рядом
            с тендером.
          </p>
          <div className="mini-sheet" aria-hidden="true">
            <div>
              <span>Системный блок</span>
              <b>12 шт.</b>
            </div>
            <div>
              <span>Монитор</span>
              <b>12 шт.</b>
            </div>
            <div>
              <span>Себестоимость</span>
              <b>684 000 ₽</b>
            </div>
          </div>
        </article>
        <article className="handoff reveal">
          <div className="handoff-top">
            <span className="role-tag blue">Закупщик</span>
            <span>02</span>
          </div>
          <h3>
            Что уже есть?
            <br />
            Чего не хватает?
          </h3>
          <p>
            Резерв и состояние комплектующих помогают увидеть, что ещё нужно для
            поставки.
          </p>
          <div className="mini-reserve" aria-hidden="true">
            <strong className="reserve-symbol" aria-hidden="true">
              ✓
            </strong>
            <div>
              <span>Резерв по позициям</span>
              <div className="mini-track">
                <i></i>
              </div>
              <small>Ожидаем мониторы</small>
            </div>
          </div>
        </article>
        <article className="handoff reveal">
          <div className="handoff-top">
            <span className="role-tag green">Менеджер</span>
            <span>03</span>
          </div>
          <h3>
            Кто отвечает?
            <br />
            Когда отгружаем?
          </h3>
          <p>
            Неделя отгрузки, ответственные и обсуждение доступны в общем рабочем
            процессе.
          </p>
          <div className="mini-week" aria-hidden="true">
            <span>План отгрузки</span>
            <strong>
              Следующая неделя <b>↗</b>
            </strong>
            <small>Ответственный · менеджер тендера</small>
          </div>
        </article>
      </div>
    </section>
  );
}

function SystemSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="system-section" id="system">
      <div className="wrap">
        <div className="system-heading reveal">
          <div>
            <p className="eyebrow">02 / ОДНА СИСТЕМА</p>
            <h2>
              Три приложения.
              <br />
              Общая работа.
            </h2>
          </div>
          <p>
            Клиент для команды, инструменты импорта и сервер для вашей базы. Это
            один комплект, а не три подписки.
          </p>
        </div>
        <div className="system-grid">
          <article className="system-product reveal">
            <div className="app-icon app-client">
              <img
                src="/assets/app-family.png"
                alt="Pc — клиент"
                width={2172}
                height={724}
                loading="lazy"
              />
            </div>
            <span className="product-code">PC / КЛИЕНТ</span>
            <h3>Там, где работает команда.</h3>
            <p>
              Расчёт, закупка, статусы, резервы, комментарии и план отгрузки.
            </p>
          </article>
          <article className="system-product reveal">
            <div className="app-icon app-parser">
              <img
                src="/assets/app-family.png"
                alt="Pp — парсер"
                width={2172}
                height={724}
                loading="lazy"
              />
            </div>
            <span className="product-code">PP / ПАРСЕР</span>
            <h3>Входящие закупки.</h3>
            <p>
              Инструменты импорта из ЕИС и Bico. Доступ к платным источникам
              подключается отдельно.
            </p>
          </article>
          <article className="system-product reveal">
            <div className="app-icon app-server">
              <img
                src="/assets/app-family.png"
                alt="Ps — сервер"
                width={2172}
                height={724}
                loading="lazy"
              />
            </div>
            <span className="product-code">PS / СЕРВЕР</span>
            <h3>База под вашим контролем.</h3>
            <p>
              PServer обслуживает общую базу на вашем сервере Windows и её
              резервное копирование.
            </p>
          </article>
        </div>
        <div className="system-note">
          <span>ВАША ИНФРАСТРУКТУРА</span>
          <p>
            Сотрудники работают в Windows-приложении. Подключение из офиса,
            удалённый доступ и общую папку проверяем при запуске тестового
            периода. Отдельные учётные записи администратора, руководителей и
            сотрудников. Доступ к действиям определяется ролью.
          </p>
        </div>
      </div>
    </section>
  );
}

function FitSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="section wrap fit-section">
      <div className="reveal">
        <p className="eyebrow">03 / КОМУ ПОДОЙДЁТ</p>
        <h2>
          Когда один тендер —<br />
          работа нескольких людей.
        </h2>
        <p className="section-lead">
          Разные товары — знакомый процесс: рассчитать поставку, согласовать
          закупку, проверить резерв и подготовить отгрузку.
        </p>
      </div>
      <div className="fit-list reveal">
        <div>
          <span>01</span>
          <p>Считаете состав поставки из нескольких позиций.</p>
        </div>
        <div>
          <span>02</span>
          <p>Передаёте расчёт менеджеру и закупщику.</p>
        </div>
        <div>
          <span>03</span>
          <p>Контролируете резервы и отгрузки по неделям.</p>
        </div>
        <p className="fit-note">
          Если нужен только поиск закупок или полноценный складской учёт,
          обсудим это до тестового периода. Parsetting не заменяет бухгалтерию.
        </p>
      </div>
    </section>
  );
}

function IndustriesSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="domains-section wrap" id="industries">
      <div className="domains-art reveal">
        <img
          src="/assets/supply-world.png"
          alt="Иллюстрация поставок из разных сфер: мебель, оборудование, материалы и расходные товары"
          width={1536}
          height={1024}
          loading="lazy"
        />
        <span className="art-label">РАЗНЫЕ ТОВАРЫ. ОБЩИЙ ПРОЦЕСС.</span>
      </div>
      <div className="domains-copy reveal">
        <p className="eyebrow">ПОД ВАШУ ПРЕДМЕТНУЮ ОБЛАСТЬ</p>
        <h2>
          Вы знаете свою сферу.
          <br />
          <em>Мы поможем собрать процесс.</em>
        </h2>
        <p>
          Мебель, строительные материалы, расходные товары, оборудование и
          другие направления. Обсудим ваши справочники, состав поставки и этапы
          работы.
        </p>
        <div className="domain-tags">
          <span>Оборудование</span>
          <span>Мебель</span>
          <span>Материалы</span>
          <span>Расходные товары</span>
          <span>Ваша сфера ↗</span>
        </div>
        <p className="domain-note">
          Особые требования отрасли и нужные доработки проверяем до подключения.
          Подберём подходящий сценарий и согласуем объём адаптации.
        </p>
        <RequestButton
          className="text-link"
          data-request="Тестовый период"
          topic="trial"
        >
          Обсудить нашу сферу ↗
        </RequestButton>
      </div>
    </section>
  );
}

function BenefitsSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section
      className="evidence-section"
      id="benefits"
      aria-labelledby="evidence-title"
    >
      <div className="wrap">
        <div className="section-heading reveal">
          <p className="eyebrow">КАК МЕНЯЕТСЯ ПОВСЕДНЕВНАЯ РАБОТА</p>
          <h2 id="evidence-title">
            Следующий этап.
            <br />
            <span className="subtle">Тот же контекст.</span>
          </h2>
          <p>
            Тендер переходит от одного сотрудника к другому. В общей карточке
            остаются состав поставки, комментарии, ответственные и сроки.
          </p>
        </div>
        <div className="process-compare">
          <article className="process-panel fragmented reveal">
            <div className="process-panel-top">
              <span>КОГДА ДАННЫЕ РАЗНЕСЕНЫ</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>
              Сначала собрать
              <br />
              картину по частям.
            </h3>
            <div className="scattered-notes" aria-hidden="true">
              <span>
                Расчёт.xlsx<small>Какая версия актуальна?</small>
              </span>
              <span>
                Переписка<small>Где договорились?</small>
              </span>
              <span>
                План поставки<small>Кто ведёт дальше?</small>
              </span>
            </div>
            <p>
              Если расчёт, резерв и договорённости хранятся отдельно, перед
              продолжением нужно найти и сопоставить нужные сведения.
            </p>
          </article>
          <article className="process-panel connected reveal">
            <div className="process-panel-top">
              <span>В PARSETTING</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h3>
              Открыть тендер.
              <br />
              Продолжить с его данными.
            </h3>
            <div className="shared-tender" aria-hidden="true">
              <div>
                <span className="shared-mark">P</span>
                <strong>Общая карточка</strong>
                <span className="shared-dot"></span>
              </div>
              <ul>
                <li>Расчёт</li>
                <li>Закупка</li>
                <li>Исполнение</li>
              </ul>
              <p>Позиции · комментарии · сроки</p>
            </div>
            <p>
              Каждый сотрудник работает со своим этапом и видит доступную ему
              часть общей истории. Состав поставки остаётся связан с тендером.
            </p>
          </article>
        </div>
        <div className="work-change reveal">
          <div className="work-change-heading">
            <p className="eyebrow">ЧТО КОНКРЕТНО МЕНЯЕТСЯ</p>
            <h3>
              Место для данных.
              <br />
              Ориентир для команды.
            </h3>
            <p>
              Покажем эти действия на демонстрации и проверим, подходят ли они
              вашему порядку работы.
            </p>
            <p className="process-scope">
              Это сравнение способов организации работы. Время и результат
              зависят от задач, наполнения базы и работы команды.
            </p>
          </div>
          <div className="work-change-table">
            <div className="work-change-head">
              <span>В разрозненном процессе</span>
              <span>В Parsetting</span>
            </div>
            <div className="work-change-row">
              <p>Найти файл с расчётом и уточнить версию.</p>
              <p>
                <b>Открыть расчёт тендера.</b> Группы, позиции, количество и
                цены связаны с карточкой.
              </p>
            </div>
            <div className="work-change-row">
              <p>Уточнить в переписке, кто ведёт следующий этап.</p>
              <p>
                <b>Посмотреть ответственного.</b> Назначения и текущий статус
                доступны в рабочем списке.
              </p>
            </div>
            <div className="work-change-row">
              <p>Сверить резерв и сроки по нескольким источникам.</p>
              <p>
                <b>Проверить закупку.</b> Статус позиции, номер резерва и дата
                поставки находятся рядом.
              </p>
            </div>
            <div className="work-change-row">
              <p>Передать договорённости следующему сотруднику отдельно.</p>
              <p>
                <b>Продолжить по общей карточке.</b> Комментарии и история
                остаются в контексте тендера.
              </p>
            </div>
          </div>
        </div>
        <div className="evidence-bottom">
          <p>Возьмём знакомую вашей команде задачу и пройдём её вместе.</p>
          <RequestButton
            className="text-link"
            data-request="Тестовый период"
            topic="trial"
          >
            Посмотреть свой сценарий ↗
          </RequestButton>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="pricing-section" id="pricing">
      <div className="wrap">
        <div className="section-heading reveal">
          <p className="eyebrow">04 / СТОИМОСТЬ</p>
          <h2>
            Сначала ваши задачи.
            <br />
            <span className="subtle">Затем подписка.</span>
          </h2>
          <p>
            Тестовый период — <span data-trial>{config.trialDays}</span> дней
            бесплатно с согласованной даты запуска. Без карты и автоматического
            продления.
          </p>
        </div>
        <div className="pricing-grid">
          <article className="price-card reveal">
            <div className="price-head">
              <span>
                ДО{" "}
                <span data-seats="team">{getPlan(config, "team").seats}</span>{" "}
                АКТИВНЫХ СОТРУДНИКОВ
              </span>
              <span className="price-symbol" aria-hidden="true">
                ↗
              </span>
            </div>
            <h3 data-plan-name="team">{getPlan(config, "team").name}</h3>
            <div className="price">
              <strong data-price="team">
                {formatPrice(getPlan(config, "team").price)}
              </strong>
              <span>₽ / месяц</span>
            </div>
            <p>
              Небольшая команда: по одному специалисту на направление, общий
              рабочий процесс.
            </p>
            <ul>
              <li>Весь комплект: клиент, парсер и PServer</li>
              <li>Импорт, расчёт, закупка, исполнение и отчёты</li>
              <li>Отдельные учётные записи и доступ по ролям</li>
              <li>Обновления и 30 минут консультаций в месяц</li>
            </ul>
            <RequestButton
              className="button outline full"
              data-request="team"
              topic="team"
            >
              Выбрать «Команду» <span aria-hidden="true">↗</span>
            </RequestButton>
          </article>
          <article className="price-card featured reveal">
            <div className="price-head">
              <span>
                ДО{" "}
                <span data-seats="department">
                  {getPlan(config, "department").seats}
                </span>{" "}
                АКТИВНЫХ СОТРУДНИКОВ
              </span>
              <span className="price-symbol" aria-hidden="true">
                ↗
              </span>
            </div>
            <h3 data-plan-name="department">
              {getPlan(config, "department").name}
            </h3>
            <div className="price">
              <strong data-price="department">
                {formatPrice(getPlan(config, "department").price)}
              </strong>
              <span>₽ / месяц</span>
            </div>
            <p>
              Несколько сотрудников в направлениях: руководители, расчётчики,
              менеджеры и закупка.
            </p>
            <ul>
              <li>Всё, что входит в тариф «Команда»</li>
              <li>Больше мест для руководителей и специалистов</li>
              <li>Общая база, ответственные и история работы</li>
              <li>Обновления и 60 минут консультаций в месяц</li>
            </ul>
            <RequestButton
              className="button full"
              data-request="department"
              topic="department"
            >
              Выбрать «Отделы» <span aria-hidden="true">↗</span>
            </RequestButton>
          </article>
        </div>
        <div className="plan-details">
          <p>
            <strong>Один комплект — одна лицензия компании.</strong> В обоих
            тарифах доступен весь рабочий процесс и существующие роли, включая
            руководителей. Тарифы отличаются количеством мест и временем
            консультаций; ограничений «один расчётчик на компанию» нет.
          </p>
          <p>
            <strong>Как считаем места.</strong> Каждая активная учётная запись
            сотрудника занимает одно место, включая администратора и
            руководителей. Сервис парсинга место не занимает. Неактивные
            сотрудники остаются в истории и в лимит не входят.
          </p>
          <p>
            <strong>Проверить всей командой.</strong> Бесплатный тестовый период
            — <span data-trial>{config.trialDays}</span> дней, до{" "}
            <span data-trial-seats>{config.trialSeats}</span> активных
            сотрудников. До запуска поможем подобрать роли и согласовать дату
            начала.
          </p>
        </div>
        <div className="license-steps" aria-label="Как получить лицензию">
          <article>
            <span>01 / ЗНАКОМСТВО</span>
            <h3>Проверяем ваш процесс</h3>
            <p>
              Показываем программу, обсуждаем команду и подготовку базы. Затем
              выдаём тестовую лицензию.
            </p>
          </article>
          <article>
            <span>02 / ПОДКЛЮЧЕНИЕ</span>
            <h3>Подтверждаем подключение</h3>
            <p>
              Поможем активировать лицензию компании для её PServer. Доступны
              общий тестовый период и выбранный тариф; сотрудникам не нужны
              отдельные ключи.
            </p>
          </article>
          <article>
            <span>03 / ПРОДОЛЖЕНИЕ</span>
            <h3>Продлеваете по решению</h3>
            <p>
              После тестового периода — счёт и лицензия на согласованный срок.
              Без привязки карты и автоматических списаний.
            </p>
          </article>
        </div>
        <p className="pricing-footnote">
          Для первых трёх тестовых подключений стандартный запуск включён. В
          остальных случаях установка и обучение —{" "}
          <strong>4 900 ₽ однократно</strong>, до двух часов на подготовленном
          сервере. Сервер и платные источники данных оплачиваются отдельно.{" "}
          <a className="inline-link" href="#implementation">
            Выбрать помощь с внедрением и поддержкой ↓
          </a>
        </p>
      </div>
    </section>
  );
}

function ImplementationSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section
      className="section wrap implementation-section"
      id="implementation"
      aria-labelledby="implementation-title"
    >
      <div className="section-heading reveal">
        <p className="eyebrow">ВНЕДРЕНИЕ И ПОДДЕРЖКА</p>
        <h2 id="implementation-title">
          Поможем начать.
          <br />
          <span className="subtle">И продолжить уверенно.</span>
        </h2>
        <p>
          От установки на готовый сервер до подготовки базы под вашу команду.
          Согласуем задачи и стоимость до начала работ.
        </p>
      </div>
      <div className="service-grid">
        <article className="service-card reveal">
          <div className="service-top">
            <span className="service-number" aria-hidden="true">
              01
            </span>
            <span>РАЗОВЫЙ ЗАПУСК</span>
          </div>
          <h3>Стандартная установка</h3>
          <div className="service-price">
            <strong>4 900 ₽</strong>
            <span>однократно · до 2 часов</span>
          </div>
          <p>
            Когда сервер подготовлен и нужно подключить команду к Parsetting.
          </p>
          <ul>
            <li>Установка и подключение компонентов системы</li>
            <li>Проверка запуска и короткое обучение</li>
            <li>Согласованный объём на подготовленном сервере</li>
          </ul>
          <RequestButton
            className="button outline full"
            data-request="install"
            topic="install"
          >
            Обсудить установку <span aria-hidden="true">↗</span>
          </RequestButton>
        </article>
        <article className="service-card service-card-featured reveal">
          <div className="service-top">
            <span className="service-number" aria-hidden="true">
              02
            </span>
            <span>ПОД ВАШ ПРОЦЕСС</span>
          </div>
          <h3>Подготовка к работе</h3>
          <div className="service-price">
            <strong>
              <small>от</small> 14 900 ₽
            </strong>
            <span>базовый объём · до 6 часов</span>
          </div>
          <p>
            Полный запуск в согласованном объёме: установка, перенос данных и
            подготовка базы под сотрудников.
          </p>
          <ul>
            <li>Стандартная установка уже включена в стоимость</li>
            <li>Подготовка базы и согласованный перенос данных</li>
            <li>Настройка ролей и нужных справочников</li>
            <li>Обучение команды работе с вашим сценарием</li>
          </ul>
          <RequestButton
            className="button full"
            data-request="implementation"
            topic="implementation"
          >
            Обсудить внедрение <span aria-hidden="true">↗</span>
          </RequestButton>
        </article>
        <article className="service-card reveal">
          <div className="service-top">
            <span className="service-number" aria-hidden="true">
              03
            </span>
            <span>КОГДА НУЖНА ПОМОЩЬ</span>
          </div>
          <h3>Дополнительная помощь</h3>
          <div className="service-price">
            <strong>2 500 ₽</strong>
            <span>за час согласованных работ</span>
          </div>
          <p>
            Разовая задача сверх времени консультаций, включённого в подписку.
          </p>
          <ul>
            <li>Консультации по работе в системе</li>
            <li>Помощь с настройками и обучение сотрудников</li>
            <li>Оценка времени до начала задачи</li>
          </ul>
          <RequestButton
            className="button outline full"
            data-request="hourly"
            topic="hourly"
          >
            Обсудить задачу <span aria-hidden="true">↗</span>
          </RequestButton>
        </article>
        <article className="service-card reveal">
          <div className="service-top">
            <span className="service-number" aria-hidden="true">
              04
            </span>
            <span>РЕГУЛЯРНАЯ ПОМОЩЬ</span>
          </div>
          <h3>Расширенная поддержка</h3>
          <div className="service-price">
            <strong>11 900 ₽</strong>
            <span>5 дополнительных часов · на 30 дней</span>
          </div>
          <p>
            Когда команде регулярно нужны консультации, настройки и обучение.
          </p>
          <ul>
            <li>Пять часов дополнительно к консультациям в тарифе</li>
            <li>30 дней; дату начала согласуем до оплаты</li>
            <li>Неиспользованные часы не переносятся</li>
            <li>Отдельно от лицензии, без автопродления</li>
          </ul>
          <RequestButton
            className="button outline full"
            data-request="support"
            topic="support"
          >
            Выбрать поддержку <span aria-hidden="true">↗</span>
          </RequestButton>
        </article>
      </div>
      <div className="service-included reveal">
        <div>
          <p className="eyebrow">УЖЕ В ВАШЕЙ ПОДПИСКЕ</p>
          <h3>
            30 или 60 минут
            <br />
            консультаций каждый месяц.
          </h3>
        </div>
        <p>
          В «Команде» — 30 минут, в «Отделах» — 60. Разбор и исправление ошибок
          самой программы не расходуют это время и не требуют покупки
          дополнительных часов.
        </p>
      </div>
      <div className="service-conditions">
        <p>
          <strong>Сначала оценка, потом работы.</strong> Объём переноса,
          состояние данных, сроки и итоговую стоимость согласуем заранее.
          Базовое внедрение рассчитано на объём до шести часов; более крупную
          задачу оценим отдельно.
        </p>
        <p>
          <strong>Понятные границы помощи.</strong> Подготовка сервера с нуля,
          настройка VPN, сложная очистка данных и индивидуальные доработки
          оцениваются отдельно. Поддержка — в рабочие дни; целевой первый ответ
          — следующий рабочий день.
        </p>
      </div>
    </section>
  );
}

function PilotSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="section wrap pilot-section" id="start">
      <div className="reveal">
        <p className="eyebrow">05 / ПОМОЖЕМ НАЧАТЬ</p>
        <h2>
          Один тендер.
          <br />
          <span data-trial>{config.trialDays}</span> дней.
          <br />
          <em>Ваше решение.</em>
        </h2>
        <RequestButton
          className="button dark"
          data-request="Тестовый период"
          topic="trial"
        >
          Договориться о демо <span aria-hidden="true">↗</span>
        </RequestButton>
      </div>
      <ol className="pilot-steps">
        <li className="reveal">
          <span>01</span>
          <div>
            <h3>Показываем ваш сценарий</h3>
            <p>
              На короткой встрече разбираем, как вы считаете, закупаете и
              отгружаете. Показываем подходящие действия в программе.
            </p>
          </div>
        </li>
        <li className="reveal">
          <span>02</span>
          <div>
            <h3>Готовим базу и тестовый период</h3>
            <p>
              Поможем перенести данные в Parsetting, заполнить все нужные
              справочники и списки, подготовить базу к работе. Настроим учётные
              записи и проверим резервную копию. Объём, сроки и стоимость
              подготовки согласуем после оценки данных.
            </p>
          </div>
        </li>
        <li className="reveal">
          <span>03</span>
          <div>
            <h3>Оцениваем результат вместе</h3>
            <p>
              Берём ваши тендеры и сравниваем время работы, количество
              исправлений и удобство передачи между сотрудниками. Обсуждаем
              предложения команды. Продолжение — по вашему решению.
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}

function TogetherSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="innovation wrap" id="together">
      <div className="reveal">
        <p className="eyebrow">РАЗВИВАЕМ СИСТЕМУ ВМЕСТЕ С ВАМИ</p>
        <h2>
          Хорошая идея может
          <br />
          начаться с вашей задачи.
        </h2>
        <p>
          Parsetting уже используется в ежедневной работе. Мы слышим обратную
          связь пользователей и открыты предложениям, которые делают работу
          удобнее.
        </p>
      </div>
      <div className="innovation-detail reveal">
        <h3>У вас сложнее устроена команда?</h3>
        <p>
          Несколько отделов, филиалы, особые роли или цепочки согласования —
          готовы рассмотреть вашу структуру. Покажите процесс: обсудим
          возможности текущей версии, необходимые изменения, сроки и стоимость.
        </p>
        <RequestButton
          className="text-link"
          data-request="Тестовый период"
          topic="trial"
        >
          Предложить идею или обсудить задачу ↗
        </RequestButton>
      </div>
    </section>
  );
}

function AuthorSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section
      className="author-section"
      id="author"
      aria-labelledby="author-title"
    >
      <div className="wrap author-layout">
        <div className="author-heading reveal">
          <p className="eyebrow">ОТ АВТОРА</p>
          <h2 id="author-title">
            Я написал инструмент,
            <br />
            которого мне
            <br />
            <em>не хватало в работе.</em>
          </h2>
          <div className="author-origin">
            <span className="author-origin-mark" aria-hidden="true">
              ↗
            </span>
            <div>
              <strong>Программист · 22 года</strong>
              <span>Нижний Новгород</span>
            </div>
          </div>
        </div>
        <div className="author-story reveal">
          <p className="author-opening">
            Когда я работал на предприятии, которое занимается тендерами, я
            увидел, что команде не хватает удобного инструмента для повседневной
            работы.
          </p>
          <p>
            Из этой задачи вырос Parsetting. Я развил идею и реализовал
            программу, которая помогает структурно вести тендеры и сохранять
            важные данные по ходу работы.
          </p>
          <p>
            Сейчас программой уже пользуются. Я продолжаю её развивать и хочу
            слышать тех, кто работает с тендерами каждый день: что удобно, где
            приходится делать лишние шаги и чего пока не хватает.
          </p>
          <div className="author-invitation">
            <p>
              Есть задача, которую ваша команда решает вручную? Расскажите, как
              это устроено у вас.
            </p>
            <a
              className="text-link"
              href={telegramUrl(config)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать автору в Telegram, откроется новая вкладка"
            >
              Написать автору в Telegram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="section wrap faq-section" id="questions">
      <div className="reveal">
        <p className="eyebrow">ЕЩЁ ПАРА ДЕТАЛЕЙ</p>
        <h2>Перед стартом.</h2>
      </div>
      <div className="faq reveal">
        <details>
          <summary>Это программа для поиска тендеров?</summary>
          <p>
            Основной сценарий — работа команды с расчётом, закупкой и
            исполнением. Импорт помогает получать закупки, но подписки на
            сторонние базы в тариф не входят. Для Bico нужен собственный
            разрешённый доступ.
          </p>
        </details>
        <details>
          <summary>Можно работать из дома?</summary>
          <p>
            После настройки безопасного соединения с вашим PServer. Доступ к
            общей папке документов настраивается отдельно. Проверим оба сценария
            на вашей конфигурации во время тестового периода.
          </p>
        </details>
        <details>
          <summary>Где хранятся наши данные?</summary>
          <p>
            В базе вашей организации на сервере с PServer. Папка документов и
            резервные копии также находятся в согласованной инфраструктуре. Во
            время тестового периода проверяем доступ и восстановление тестовой
            копии. Доработку инфраструктуры и нестандартную настройку согласуем
            отдельно.
          </p>
        </details>
        <details>
          <summary>Есть версия для браузера или телефона?</summary>
          <p>
            Рабочий клиент сейчас предназначен для Windows. На сайте
            представлены снимки реального интерфейса на тестовых данных. Полную
            работу покажем на демонстрации.
          </p>
        </details>
        <details>
          <summary>У администратора будет своя учётная запись?</summary>
          <p>
            Да. У администратора, руководителей и сотрудников отдельные учётные
            записи. Права определяются ролью; состав пользователей и доступов
            обсуждаем при настройке.
          </p>
        </details>
        <details>
          <summary>Поможете перенести данные и заполнить списки?</summary>
          <p>
            Да, можем помочь с переносом данных, заполнением справочников
            товаров, поставщиков и других нужных списков, подготовкой базы к
            работе. Сначала оценим исходные файлы и объём. Сроки, стоимость и
            проверку результата согласуем до переноса.
          </p>
        </details>
        <details>
          <summary>Можно предложить доработку или сложную структуру?</summary>
          <p>
            Мы открыты предложениям и новым идеям. По запросу рассмотрим
            несколько отделов, филиалы, дополнительные роли и особые этапы
            согласования. Вместе определим, что подходит в текущей версии, а что
            потребует разработки, и обсудим сроки и стоимость.
          </p>
        </details>
        <details>
          <summary>Что произойдёт после окончания лицензии?</summary>
          <p>
            База и накопленная история остаются у вас. Сохраняются просмотр в
            пределах прав сотрудника и резервное копирование; новые записи,
            изменения и импорт приостанавливаются до продления. Дата окончания
            видна администратору. После активации продления работа продолжается
            в той же базе.
          </p>
        </details>
        <details>
          <summary>Нужен отдельный ключ каждому сотруднику?</summary>
          <p>
            Нет. Лицензия выдаётся организации для её PServer. Проверка
            выполняется на вашем сервере и не требует постоянного соединения с
            сервером лицензирования. Администратор управляет активными
            сотрудниками в пределах тарифа; учётная запись у каждого своя.
          </p>
        </details>
        <details>
          <summary>Можно вырасти из маленькой команды в отделы?</summary>
          <p>
            Да. При увеличении команды можно согласовать тариф с большим числом
            мест и обновить лицензию в том же PServer, без переноса истории в
            новую базу. Иерархию филиалов, особые роли и дополнительные
            согласования обсуждаем отдельно — это не автоматическая возможность
            тарифа.
          </p>
        </details>
        <details>
          <summary>Как устроены оплата и поддержка?</summary>
          <p>
            После тестового периода — оплата согласованного периода по счёту,
            без автосписаний. Вопросы принимаем в рабочие дни; целевой первый
            ответ — следующий рабочий день. Время решения зависит от проблемы.
            Обновления и разбор ошибок входят в сопровождение; индивидуальные
            доработки согласуем отдельно.
          </p>
        </details>
        <details>
          <summary>Нужно переносить всю рабочую базу?</summary>
          <p>
            Нет. Сначала небольшой согласованный набор данных. Полный перенос
            обсуждаем отдельно и выполняем после резервного копирования и
            проверки восстановления.
          </p>
        </details>
      </div>
    </section>
  );
}

function ClosingSection({ config }: { config: PublicSiteConfig }) {
  return (
    <section className="closing">
      <div className="wrap">
        <p className="eyebrow">ПОСМОТРИМ НА ВАШУ РАБОТУ</p>
        <h2>
          Следующий тендер
          <br />
          можем вести <em>вместе.</em>
        </h2>
        <div>
          <p>
            Расскажите о вашей сфере и команде.
            <br />
            Мы открыты предложениям и новым идеям.
          </p>
          <RequestButton
            className="button light"
            data-request="Тестовый период"
            topic="trial"
          >
            Запросить демонстрацию <span aria-hidden="true">↗</span>
          </RequestButton>
        </div>
      </div>
    </section>
  );
}

export function HomeContent({ config }: { config: PublicSiteConfig }) {
  return (
    <>
      <a className="skip" href="#main">
        К содержанию
      </a>
      <header className="header wrap">
        <a className="brand" href="#" aria-label="Parsetting — главная">
          <span className="brand-crop">
            <img
              src="/assets/brand-reference.png"
              alt="Parsetting"
              width={1280}
              height={853}
            />
          </span>
        </a>
        <nav aria-label="Главное меню">
          <a href="#demo">Экраны</a>
          <a href="#intake">Как работает</a>
          <a href="#pricing">Стоимость</a>
          <a href="#author">Об авторе</a>
        </nav>
        <RequestButton
          className="button compact dark"
          data-request="Тестовый период"
          topic="trial"
        >
          Запросить демо <span aria-hidden="true">↗</span>
        </RequestButton>
      </header>
      <main id="main">
        <HeroSection config={config} />
        <ProofLine config={config} />
        <ProcessBand config={config} />
        <IntakeSection config={config} />
        <WorkflowSection config={config} />
        <SystemSection config={config} />
        <FitSection config={config} />
        <IndustriesSection config={config} />
        <BenefitsSection config={config} />
        <PricingSection config={config} />
        <ImplementationSection config={config} />
        <PilotSection config={config} />
        <TogetherSection config={config} />
        <AuthorSection config={config} />
        <FaqSection config={config} />
        <ClosingSection config={config} />
      </main>
      <SiteFooter config={config} />
    </>
  );
}
