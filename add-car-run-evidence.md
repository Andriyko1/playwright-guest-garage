# Run evidence

- **Tool** — Codex extension for VS Code, Playwright Test.
- **Command** — `npx.cmd playwright test tests/add-car.spec.ts --project=chromium`
- **Timestamp** — `2026-11-19T15:38:12.077+02:00`, время начала успешного запуска по HTML-отчёту Playwright.
- **Environment** — Windows, Playwright Chromium, `https://qauto.forstudy.space/`. Команда выполнена из каталога `playwright-starter`.
- **Actual** — `1 passed (8.5s)`, код завершения `0`.

## Фактический вывод успешного запуска

```text

Running 1 test using 1 worker

(node:19176) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 1 [chromium] › tests\add-car.spec.ts:3:5 › guest can add Audi TT to Garage (7.4s)

  1 passed (8.5s)
```

## Первоначальный сетевой сбой

Первый запуск завершился с кодом `1` и итогом `1 failed`. Исходная попытка и автоматический повтор остановились на `page.goto('/')` до гостевого входа. Ошибка в обоих случаях:

```text
Error: page.goto: net::ERR_NETWORK_ACCESS_DENIED at https://qauto.forstudy.space/
```

Trace подтвердил сетевую ошибку. После предоставления сетевого доступа та же команда прошла. Код теста между запусками не менялся.

| Елемент | Джерело |
|---|---|
| setup | `playwright.config.ts` задаёт `baseURL` и проект `chromium`. Гостевой вход сверён с `tests/guest-garage.spec.ts` и подтверждён в Playwright CLI. |
| locator/action | Снимки Playwright CLI подтвердили кнопку `Add car`, списки `Brand` и `Model`, числовое поле `Mileage`, кнопку сохранения `Add` и карточку с точным текстом `Audi TT`. Данные `Audi`, `TT`, `12000` взяты из `specs/add-car.md`. |
| assertions | `specs/add-car.md` требует проверить URL Garage и появление `Audi TT`. Тест проверяет путь `/panel/garage` и увеличение числа видимых карточек `Audi TT` ровно на одну. |

- **FACTS** — Выполнялся один тест в Chromium. Успешный запуск подтвердил обе проверки.
- **ASSUMPTIONS** — Локатор карточки подтверждён в текущем UI. Сценарий с уже существующей карточкой `Audi TT` отдельно не выполнялся.
- **RISKS** — При ограничении сетевого доступа Chromium может остановиться на открытии QAuto до выполнения шагов сценария.
- **HUMAN CORRECTION** — Пользователь потребовал проверять появление новой карточки. Для подтверждения локатора он отдельно разрешил создать один автомобиль в гостевой CLI-сессии.
- **DECISION** — ACCEPT. Фактический запуск завершился успешно: 1 passed (8.5s), exit code 0.
