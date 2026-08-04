---
name: design-system-project-bootstrap
description: Bootstrapuje nowe repo paczki design systemu w stacku podobnym do design-system-flience: Style Dictionary 3, tokeny DTCG z Figma/Tokens Studio, eksport CSS/Tailwind/SCSS, transformacje SVG przez SVGR, Storybook 8 React/Vite, npm package exports oraz CI/publish workflow. Używaj przy jawnej prośbie o inicjalizację, scaffold albo naprawę bazowej struktury repo design systemu, a nie przy bootstrapie aplikacji produktowej.
version: 1.0.0
author: s.stawowy@pleodigital.com
scope: PROJECT
tags: [design-system, style-dictionary, storybook, tokens]
---
# Design System Project Bootstrap

## Cel

Inicjalizuj repo jako paczkę design systemu, nie jako aplikację. Domyślny stack to npm package z tokenami Style Dictionary, dokumentacją Storybook React/Vite, transformacją SVG do komponentów React i raw SVG dla Angulara oraz eksportami CSS gotowymi do użycia w aplikacjach Tailwind.

Jeśli użytkownik wspomina `website-project-bootstrap`, traktuj go wyłącznie jako analogię workflow. Ten skill ma prowadzić do repo biblioteki design systemu, bez Next.js scaffoldingu i bez runtime aplikacji.

## Workflow

1. Ustal brakujące decyzje tylko wtedy, gdy wpływają na kontrakt paczki: `package.json` name/scope, public/private publish, docelowy registry, czy fonty mają być tylko preview-only, oraz czy Vercel preview Storybooka jest wymagany.
2. Sprawdź stan katalogu docelowego: `git status --short`, istniejący `package.json`, obecne `tokens/`, `assets/`, `.storybook/`, `storybook/` i workflowy. Nie nadpisuj ręcznych zmian bez jasnego powodu.
3. Scaffold bazowy z paczką npm:
   - `package.json` z `style: "dist/css/tokens.css"`, `files: ["dist"]`, `sideEffects: ["dist/css/*.css"]`,
   - skrypty `build:tokens`, `transform:icons`, `transform:illustrations`, `copy:angular-svg`, `build`, `storybook`, `build-storybook`,
   - devDependencies: Style Dictionary 3, Storybook 8 React/Vite, React 18, SVGR CLI i `cpx`.
4. Utwórz strukturę źródeł:
   - `tokens/Color/Core/Value.json`,
   - `tokens/Color/Semantic/Light.json` i `Dark.json`,
   - `tokens/Space/Core-www/Value.json`,
   - `tokens/Space/Semantic-www/Mobile 402.json`, `Tablet 768.json`, `Desktop 1728.json`,
   - `tokens/Type/Core-www/Value.json`,
   - `tokens/Type/Semantic-www/Mobile 402.json`, `Tablet 768.json`, `Desktop 1728.json`,
   - `assets/icons/`, `assets/illustrations/`, opcjonalnie `assets/fonts/` dla preview Storybooka.
5. Zaimplementuj build tokenów jako własny Node script wokół Style Dictionary. Nie polegaj na pustym `style-dictionary.config.js`, jeśli potrzebna jest normalizacja DTCG, semantic modes, Tailwind `@theme`, responsive space albo typography utilities.
6. Utrzymaj kontrakt wyjścia:
   - `dist/css/tokens.css` zawiera core tokens oraz light/dark semantic color tokens,
   - `dist/css/tokens.tailwind.css` rejestruje tokeny w `@theme`,
   - `dist/css/space.css` i `space.tailwind.css` używają `--rvw`, `--rpx` oraz app-defined `@variant tablet` i `@variant desktop`,
   - `dist/css/typography.css` zawiera zmienne typografii i klasy `.ds-text` / `.ds-text--{variant}`,
   - fonty nie są ładowane przez `dist/css/tokens.css`; aplikacja konsumencka wiąże własne fonty pod `--font-family-*`.
7. Skonfiguruj asset pipeline:
   - `.svgrrc-icons.json` i `.svgrrc-illustrations.json`,
   - `@svgr/cli assets/icons --out-dir dist/assets/react/icons`,
   - `@svgr/cli assets/illustrations --out-dir dist/assets/react/illustrations`,
   - `cpx "assets/{icons,illustrations}/**/*.svg" dist/assets/angular/svg-raw`.
8. Skonfiguruj Storybook:
   - `.storybook/main.js` z `@storybook/react-vite`, addonami essentials/links/interactions i `staticDirs: ["../dist", "../storybook/public"]`,
   - `.storybook/preview.jsx` z lekkim shellem i importem `preview-styles.css`,
   - story dla Color, Theme, Space, Typography i Assets, które importują źródłowe tokeny oraz wygenerowane CSS z `dist`.
9. Udokumentuj konsumpcję w README:
   - import order Tailwind/custom variants/responsive values/design-system CSS,
   - ustawianie `data-theme="light|dark"`,
   - mapowanie tokenów kolorów na utility classes,
   - app-side komponent `Text` mapujący `variant` na `.ds-text--{variant}`,
   - informację, że design system nie definiuje app-specific breakpoints ani nie ładuje fontów w dystrybucji.
10. Dodaj CI tylko po dopasowaniu do repo:
   - Node 22, `npm install`, `npm run build`, `npm run build-storybook`,
   - preview Storybooka przez Vercel tylko gdy repo ma sekrety `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`,
   - publish npm z `NPM_TOKEN`, najlepiej po merge do `main` albo ręcznym `workflow_dispatch`.
11. Zweryfikuj wynik poleceniami `npm install`, `npm run build` i `npm run build-storybook`. Przy zmianie samego skilla waliduj strukturę folderu i brak placeholderów.

## Szczegóły

Przed implementacją nowego repo albo audytem scaffoldingu przeczytaj [stack-blueprint.md](references/stack-blueprint.md). Trzymaj szczegóły stacku w tej referencji, a w `SKILL.md` utrzymuj tylko workflow i decyzje operacyjne.

## Zasady

- Preferuj strukturę i nazewnictwo z `design-system-flience`, dopiero potem dopasowuj brand/package name do nowego projektu.
- Nie dodawaj frameworka aplikacyjnego, routingu, Next.js ani UI app shell, jeśli użytkownik prosi o design system package.
- Nie generuj ręcznie klas `.bg-*`, `.text-*` ani `.border-*`; kolorowe utility classes mają wynikać z Tailwind `@theme`.
- Nie kopiuj fontów do `dist`, chyba że użytkownik jawnie chce dystrybuować font assets.
- Jeśli repo już istnieje, naprawiaj minimalnie: najpierw build scripts i output contract, potem Storybook, na końcu CI/publish.
