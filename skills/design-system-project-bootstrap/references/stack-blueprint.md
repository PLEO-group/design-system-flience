# Design System Stack Blueprint

Load this reference before scaffolding or auditing a design-system package repo based on the `design-system-flience` stack.

## Package Contract

Use an npm package, not an application. The baseline package shape is:

```json
{
  "style": "dist/css/tokens.css",
  "files": ["dist"],
  "sideEffects": ["dist/css/*.css"],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

Recommended scripts:

```json
{
  "build:tokens": "node build-style-dictionary.js",
  "transform:icons": "npx @svgr/cli assets/icons --out-dir dist/assets/react/icons --jsx-runtime classic --typescript --config-file .svgrrc-icons.json",
  "transform:illustrations": "npx @svgr/cli assets/illustrations --out-dir dist/assets/react/illustrations --jsx-runtime classic --typescript --config-file .svgrrc-illustrations.json",
  "copy:angular-svg": "cpx \"assets/{icons,illustrations}/**/*.svg\" dist/assets/angular/svg-raw",
  "build": "npm run build:tokens && npm run transform:icons && npm run transform:illustrations && npm run copy:angular-svg",
  "storybook": "npm run build && storybook dev -p 6006",
  "build-storybook": "npm run build && storybook build"
}
```

Recommended devDependencies:

- `style-dictionary` `^3.9.2`
- `storybook` and `@storybook/*` `^8.0.0`
- `@storybook/react-vite`
- `react` and `react-dom` `^18.2.0`
- `@svgr/cli` `^8.1.0`
- `cpx` `^1.5.0`

## Export Map

Expose generated CSS explicitly. Adjust the package name, but preserve import paths unless the consumer contract says otherwise:

```json
{
  "exports": {
    ".": "./dist/css/tokens.css",
    "./css/tokens.css": "./dist/css/tokens.css",
    "./css/tokens.tailwind.css": "./dist/css/tokens.tailwind.css",
    "./css/tokens.semantic.css": "./dist/css/tokens.semantic.css",
    "./css/tokens.light.css": "./dist/css/tokens.light.css",
    "./css/tokens.dark.css": "./dist/css/tokens.dark.css",
    "./css/space.css": "./dist/css/space.css",
    "./css/space.tailwind.css": "./dist/css/space.tailwind.css",
    "./css/typography.css": "./dist/css/typography.css",
    "./css/typography.tailwind.css": "./dist/css/typography.tailwind.css",
    "./css/typography.utilities.css": "./dist/css/typography.utilities.css",
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  }
}
```

Include the split source outputs too when the build script emits them: `tokens.space.core.css`, `tokens.space.mobile.css`, `tokens.space.tablet.css`, `tokens.space.desktop.css`, `tokens.typography.mobile.css`, `tokens.typography.tablet.css`, `tokens.typography.desktop.css`.

## Source Tree

Baseline tree:

```text
tokens/
  Color/
    Core/Value.json
    Semantic/Light.json
    Semantic/Dark.json
  Space/
    Core-www/Value.json
    Semantic-www/Mobile 402.json
    Semantic-www/Tablet 768.json
    Semantic-www/Desktop 1728.json
  Type/
    Core-www/Value.json
    Semantic-www/Mobile 402.json
    Semantic-www/Tablet 768.json
    Semantic-www/Desktop 1728.json
assets/
  icons/
  illustrations/
  fonts/
.storybook/
storybook/
  components/
  public/
  stories/
  styles/
  utils/
dist/
```

Token JSON should accept DTCG fields `$value` and `$type`. The build script should normalize them to Style Dictionary's `value` and `type` shape before building.

## Build Script Requirements

Use `build-style-dictionary.js` for custom behavior:

- remove previous generated output under `dist/css`, `dist/scss`, `dist/js`, `dist/fonts`, and `dist/react`;
- normalize DTCG tokens and skip metadata keys starting with `$`;
- kebab-case token paths;
- prefix color variables with `--color-` when the source path does not already start with `color`;
- resolve token references like `{foo.bar}` to CSS variables in semantic outputs;
- add `px` units for numeric sizes, line heights, letter spacing, spacing and size tokens;
- quote font-family values containing spaces;
- generate SCSS variable files for token subsets when needed.

Color outputs:

- core colors and type core into `tokens.css`;
- light semantic colors under `:root, :root[data-theme="light"]`;
- dark semantic colors under `:root[data-theme="dark"]`;
- combined semantic output in `tokens.semantic.css`;
- Tailwind theme variables in `tokens.tailwind.css` under `@theme`.

Space outputs:

- dynamic core spacing variables using `--rpx` and `--rvw`;
- source-specific semantic files for mobile/tablet/desktop;
- `space.css` and `space.tailwind.css` that apply mobile by default and switch tablet/desktop through app-defined `@variant tablet` and `@variant desktop`;
- data attribute alternatives using `data-space-scale`.

Typography outputs:

- source-specific typography files for mobile/tablet/desktop;
- derived numeric variables for font size, line height and weight;
- font-style helpers when exported font weight includes italic/oblique;
- `typography.utilities.css` with `.ds-text` and `.ds-text--{variant}`;
- `typography.css` and `typography.tailwind.css` combining responsive variables and utilities;
- data attribute alternatives using `data-type-scale`.

## Storybook Requirements

Use Storybook as documentation and verification for generated artifacts.

Recommended stories:

- `Tokens/Colors`: flatten core color tokens and render swatches.
- `Tokens/Theme`: show semantic light/dark variables and toggle `data-theme`.
- `Tokens/Space`: show semantic spacing across mobile/tablet/desktop.
- `Tokens/Typography`: import preview fonts, generated token CSS and typography CSS; switch `data-type-scale`.
- `Assets`: render transformed or raw icons and illustrations.

Keep Storybook preview fonts in `assets/fonts` and `storybook/styles/font-faces.css`. Do not make `tokens.css` load fonts.

## Consumer README Checklist

Document this import order for Tailwind consumers:

```css
@import "tailwindcss";
@import "./tailwind-variants.css";
@import "./responsive-values.css";
@import "@scope/design-system/css/tokens.css";
@import "@scope/design-system/css/space.css";
@import "@scope/design-system/css/tokens.tailwind.css";
@import "@scope/design-system/css/typography.css";
```

Document app-owned custom variants:

```css
@custom-variant tablet {
  @media (width >= 36rem) {
    @slot;
  }
}

@custom-variant desktop {
  @media (width >= 64rem) {
    @slot;
  }
}
```

Document responsive values:

```css
:root {
  --rpx: 1px;
  --rvw: calc(100vw / 402);

  @variant tablet {
    --rvw: calc(100vw / 768);
  }

  @variant desktop {
    --rvw: calc(100vw / 1728);
  }
}
```

Document dark mode as app-owned state:

```ts
document.documentElement.setAttribute('data-theme', 'dark');
```

## Validation

Minimum validation before handoff:

```bash
npm install
npm run build
npm run build-storybook
```

Then check that `dist/css/tokens.css`, `dist/css/tokens.tailwind.css`, `dist/css/space.css`, `dist/css/typography.css`, React SVG outputs and raw Angular SVG outputs exist.
