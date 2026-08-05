# Storybook

Używaj tej referencji przy tworzeniu albo naprawie Storybooka dla paczki design systemu.

## Konfiguracja

Użyj Storybook 8 z React/Vite:

```js
const config = {
  stories: [
    '../storybook/**/*.mdx',
    '../storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  staticDirs: ['../dist', '../storybook/public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

Użyj `.storybook/preview.jsx` dla wspólnych decoratorów i importuj `.storybook/preview-styles.css`.

## Drzewo Storybooka

Rekomendowana struktura:

```text
storybook/
  components/
  public/
  stories/
  styles/
  utils/
```

Rekomendowane stories:

- `Tokens/Colors` - spłaszcz bazowe tokeny kolorów i wyrenderuj próbki.
- `Tokens/Theme` - pokaż semantyczne zmienne kolorów i przełączanie `data-theme`.
- `Tokens/Space` - porównaj semantykę spacing dla mobile, tablet i desktop.
- `Tokens/Typography` - importuj wygenerowany CSS i pokaż warianty typografii.
- `Assets` - wyrenderuj źródłowe SVG i wygenerowane wyniki assetów.

## Fonty podglądu

Ładuj fonty preview przez `storybook/styles/font-faces.css`. Nie dodawaj fontów do wygenerowanego CSS dystrybucyjnego,
chyba że użytkownik jawnie wybiera dystrybucję fontów.

## Walidacja

Uruchom `npm run build-storybook` po zmianach setupu Storybooka. Jeśli build importuje wygenerowany CSS z `dist`, najpierw
uruchom build tokenów/paczki albo utrzymaj `build-storybook` jako zależne od `npm run build`.
