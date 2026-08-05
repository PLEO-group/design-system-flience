---
name: design-system-project-bootstrap
description: >
  Bootstrap nowego projektu design systemu opartego na Style Dictionary 3, tokenach DTCG z Figma/Tokens Studio,
  Storybook 8 React/Vite, SVGR, eksportach CSS/Tailwind/SCSS i publikacji jako paczka npm. Używaj ZAWSZE gdy
  zakładasz takie repo od zera, migrujesz je na ten stos albo konfigurujesz jego kluczowe części: token pipeline,
  struktura `tokens/`, Storybook, asset pipeline, package exports, CI/publish, GitHub Actions secrets, npm/Vercel
  access tokens albo spięcie repo z Tokens Studio. Nie używaj do drobnych zmian tokenów, pojedynczych stories ani
  projektów pozostających przy innym generatorze tokenów, dokumentacji albo sposobie dystrybucji.
version: 1.0.0
author: s.stawowy@pleodigital.com
scope: PROJECT
tags: [FE, Design System, Style Dictionary, Bootstrap]
---

# Design System Project Bootstrap

Skill do bootstrapowania nowych repozytoriów design systemu opartych na Style Dictionary, Storybook React/Vite,
SVGR i dystrybucji jako paczka npm z gotowymi eksportami CSS.

## Stos technologiczny (obowiązkowy)

Każdy projekt oparty na tym skillu korzysta z:

- **Style Dictionary 3.x** jako silnik generowania tokenów.
- **Tokeny DTCG** eksportowane z Figma/Tokens Studio (`$value`, `$type`, referencje `{path.to.token}`).
- **Node.js + npm package** jako forma dystrybucji design systemu.
- **CSS outputs**: core tokens, semantic color modes, Tailwind `@theme`, spacing, typography utilities.
- **Storybook 8 + React + Vite** jako dokumentacja i preview artefaktów.
- **SVGR CLI** dla komponentów React z ikon/ilustracji SVG.
- **Raw SVG copy** dla konsumentów Angular albo innych frameworków.

## Kiedy używać

- Zakładasz nowe repo design systemu od zera.
- Migrujesz istniejące tokeny na Style Dictionary i DTCG.
- Konfigurujesz strukturę `tokens/`, `assets/`, `.storybook/`, `storybook/` albo `dist/`.
- Konfigurujesz `package.json`, `exports`, `files`, `sideEffects` i publish config dla paczki design systemu.
- Dodajesz Storybook jako katalog tokenów, assetów i theme preview.
- Dodajesz pipeline SVGR i kopiowanie raw SVG.
- Ustawiasz CI dla builda tokenów, Storybook preview albo publikacji npm.
- Przygotowujesz checklistę TODO dla tokenów dostępowych, sekretów GitHub Actions, Vercel i synchronizacji Tokens Studio.

## Kiedy pominąć

Przed rozpoczęciem wczytaj:
`skills/design-system-project-bootstrap/references/when-to-skip.md`.

Pomiń skill, jeśli zadanie dotyczy wyłącznie drobnej zmiany istniejącego tokena, pojedynczej story, pojedynczego SVG,
tekstu README albo aplikacji produktowej konsumującej design system. Wyjątkiem jest jawne zlecenie naprawy lub migracji
bazowego setupu na stos opisany przez ten skill.

Jeśli użytkownik wybiera generator tokenów inny niż Style Dictionary albo dokumentację inną niż Storybook, zatrzymaj
odpowiednią część bootstrapu. Poinformuj, że skill nie zawiera instrukcji dla tego narzędzia i nie improwizuj struktury,
formatów wyjściowych ani CI bez osobnej decyzji technicznej.

## Wymagania wstępne

Przed rozpoczęciem potwierdź z użytkownikiem:

1. Nazwę paczki npm, scope i czy paczka ma być publiczna czy prywatna.
2. Docelowy registry oraz sposób publikacji (`npm publish`, GitHub Packages albo brak publikacji na tym etapie).
3. Czy tokeny źródłowe pochodzą z Figma/Tokens Studio w formacie DTCG.
4. Docelowe breakpointy/scale labels dla spacing i typography, jeśli różnią się od `Mobile 402`, `Tablet 768`, `Desktop 1728`.
5. Czy fonty mają być tylko preview-only w Storybooku, czy mają być dystrybuowane w paczce.
6. Czy Storybook preview ma być wdrażany na Vercel i czy repo ma wymagane sekrety.

Nie dodawaj `.nvmrc`, `.node-version`, konfiguracji konkretnego managera Node ani workflow publikacji bez istniejącej
konwencji repo albo jawnej decyzji użytkownika.

## Krok 1 — Wykrywanie stosu

Sprawdź `package.json` (jeśli projekt już istnieje):

- `style-dictionary` — wersja i sposób uruchamiania builda tokenów.
- `storybook`, `@storybook/react-vite`, `react`, `react-dom` — obecność dokumentacji.
- `@svgr/cli` i `cpx` — obecność asset pipeline.
- `exports`, `style`, `files`, `sideEffects`, `publishConfig` — kontrakt paczki.
- Skrypty `build:tokens`, `build`, `storybook`, `build-storybook`.

Przy wymaganiu `latest` nie polegaj wyłącznie na numerach zapisanych w referencjach. Sprawdź aktualne wersje, `engines`
i peer dependencies paczek, zainstaluj je na wspieranym Node, a potem uruchom `npm ls` oraz build. Nie omijaj konfliktów
przez `--force` ani `--legacy-peer-deps`.

## Krok 2 — Package contract

Wczytaj:
`skills/design-system-project-bootstrap/references/package-contract.md`

Dotyczy: `package.json`, skrypty npm, `exports`, `files`, `sideEffects`, `publishConfig`, minimalne devDependencies
i semantyka public/private package.

## Krok 3 — Token pipeline

Wczytaj:
`skills/design-system-project-bootstrap/references/tokens-style-dictionary.md`

Dotyczy: struktura `tokens/`, normalizacja DTCG, `build-style-dictionary.js`, semantic color modes, Tailwind `@theme`,
responsive space, typography utilities, SCSS variables i kontrakt plików w `dist/css`.

## Krok 4 — Asset pipeline

Wczytaj:
`skills/design-system-project-bootstrap/references/assets-svgr.md`

Dotyczy: `assets/icons`, `assets/illustrations`, `.svgrrc-icons.json`, `.svgrrc-illustrations.json`, komponenty React
w `dist/assets/react/**` i raw SVG w `dist/assets/angular/svg-raw`.

## Krok 5 — Storybook

Wczytaj:
`skills/design-system-project-bootstrap/references/storybook.md`

Dotyczy: `.storybook/main.js`, `.storybook/preview.jsx`, static dirs, preview fonts, stories dla Color, Theme, Space,
Typography i Assets oraz import wygenerowanych plików CSS z `dist`.

## Krok 6 — Consumer docs

Wczytaj:
`skills/design-system-project-bootstrap/references/consumer-usage.md`

Dotyczy: README dla aplikacji konsumujących paczkę, kolejność importów Tailwind/CSS, `data-theme`, `data-space-scale`,
`data-type-scale`, app-owned `--rvw`/`--rpx`, font variables i przykład komponentu `Text`.

## Krok 7 — CI i publikacja

Wczytaj:
`skills/design-system-project-bootstrap/references/ci-publish.md`

Dotyczy: GitHub Actions dla builda tokenów i Storybooka, preview deploy na Vercel, publish npm, wymagane sekrety,
warunki uruchamiania workflow i bezpieczne wersjonowanie paczki.

## Krok 8 — TODO integracji zewnętrznych

Wczytaj:
`skills/design-system-project-bootstrap/references/workflow-todo-checklist.md`

Dotyczy: checklisty działań poza kodem, które muszą być wykonane, żeby cały workflow działał: npm access token,
GitHub repository secrets/variables, Vercel token i project IDs, Tokens Studio Git sync, reguły branch/PR oraz pierwsze
testowe uruchomienie GitHub Actions.

Nie oznaczaj checklisty jako zakończonej na podstawie samego utworzenia plików w repo. Elementy wymagające UI dostawcy,
sekretów albo uprawnień oznacz jako `TODO`, dopóki użytkownik ich nie potwierdzi albo nie da dostępu do właściwego narzędzia.

## Krok 9 — Weryfikacja po bootstrapie

Nie uznawaj bootstrapu za zakończony, dopóki nie wykonasz dostępnych kontroli:

1. Odczytaj skrypty z `package.json` i uruchom istniejący build tokenów oraz build całej paczki. Nie wymyślaj nazw
   skryptów; jeśli brakuje kontroli, zgłoś to użytkownikowi.
2. Uruchom build Storybooka, jeśli Storybook został dodany albo zmieniony.
3. Sprawdź, że istnieją kluczowe outputy: `dist/css/tokens.css`, `dist/css/tokens.tailwind.css`, `dist/css/space.css`,
   `dist/css/typography.css`, React SVG outputs i raw SVG outputs.
4. Jeśli zmienił się generator tokenów, uruchom go drugi raz i sprawdź idempotencję artefaktów.
5. Jeśli repo ma lint, testy albo typecheck, uruchom odpowiadające im istniejące skrypty.
6. Zgłoś wyniki każdej kontroli. Błąd builda tokenów, builda Storybooka albo brak oczekiwanych artefaktów blokuje
   oznaczenie bootstrapu jako ukończonego.

## Ładowanie referencji (mapa)

```text
Kiedy pominąć          → skills/design-system-project-bootstrap/references/when-to-skip.md
Package contract       → skills/design-system-project-bootstrap/references/package-contract.md
Token pipeline         → skills/design-system-project-bootstrap/references/tokens-style-dictionary.md
Asset pipeline         → skills/design-system-project-bootstrap/references/assets-svgr.md
Storybook              → skills/design-system-project-bootstrap/references/storybook.md
Consumer docs          → skills/design-system-project-bootstrap/references/consumer-usage.md
CI i publikacja        → skills/design-system-project-bootstrap/references/ci-publish.md
TODO integracji        → skills/design-system-project-bootstrap/references/workflow-todo-checklist.md
```

Wczytuj tylko pliki potrzebne do bieżącego kroku — nie ładuj wszystkich naraz.

## Uwagi końcowe

- Po zakończeniu bootstrapu przypomnij o sekretach i zmiennych środowiskowych wymaganych przez publish/preview workflows.
- Sprawdź, czy `style-dictionary.config.js` nie udaje pełnej konfiguracji, jeśli właściwa logika jest w `build-style-dictionary.js`.
- Jeśli fonty są preview-only, nie kopiuj ich do `dist` i nie dodawaj `@font-face` do `dist/css/tokens.css`.
- Jeśli projekt ma być konsumowany przez Tailwind, upewnij się, że tokeny są eksportowane przez `@theme`, a nie ręcznie
  generowane klasy `.bg-*`, `.text-*` albo `.border-*`.
