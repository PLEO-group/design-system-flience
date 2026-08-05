# Kontrakt Paczki

Używaj tej referencji przy tworzeniu albo naprawie `package.json` paczki design systemu.

## Wymagany kształt

Paczka ma być konsumowalna jako CSS-first output design systemu:

```json
{
  "style": "dist/css/tokens.css",
  "files": ["dist"],
  "sideEffects": ["dist/css/*.css"]
}
```

Dodaj `publishConfig` dopiero po potwierdzeniu registry i poziomu dostępu:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

## Skrypty

Preferuj te nazwy skryptów, chyba że repo ma już wyraźną konwencję:

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

## Zależności

Bazowe `devDependencies`:

- `style-dictionary` `^3.9.2`
- `storybook` `^8.0.0`
- `@storybook/react-vite` `^8.0.0`
- `@storybook/addon-essentials` `^8.0.0`
- `@storybook/addon-interactions` `^8.0.0`
- `@storybook/addon-links` `^8.0.0`
- `react` `^18.2.0`
- `react-dom` `^18.2.0`
- `@svgr/cli` `^8.1.0`
- `cpx` `^1.5.0`

Jeśli użytkownik prosi o najnowsze wersje, sprawdź aktualne wersje pakietów i peer dependencies przed edycją.

## Mapa eksportów

Eksponuj wygenerowane pliki jawnie:

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

Dodawaj ścieżki do split outputów tylko wtedy, gdy build script faktycznie generuje te pliki.
