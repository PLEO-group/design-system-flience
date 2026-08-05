# Przetwarzanie Assetów

Używaj tej referencji przy konfiguracji ikon, ilustracji albo wygenerowanych outputów assetów.

## Struktura źródeł

Użyj:

```text
assets/
  icons/
  illustrations/
  fonts/
```

Zostaw pliki `.gitkeep` w pustych katalogach ikon albo ilustracji.

## Wyniki React

Generuj komponenty React przez SVGR:

```bash
npx @svgr/cli assets/icons --out-dir dist/assets/react/icons --jsx-runtime classic --typescript --config-file .svgrrc-icons.json
npx @svgr/cli assets/illustrations --out-dir dist/assets/react/illustrations --jsx-runtime classic --typescript --config-file .svgrrc-illustrations.json
```

Utrzymuj osobne `.svgrrc-icons.json` i `.svgrrc-illustrations.json`, gdy ikony i ilustracje wymagają różnych ustawień
SVGO, wymiarów, obsługi kolorów albo zachowania propsów.

## Surowe SVG

Kopiuj surowe pliki SVG dla Angulara i konsumentów niezależnych od frameworka:

```bash
cpx "assets/{icons,illustrations}/**/*.svg" dist/assets/angular/svg-raw
```

## Walidacja

Po `npm run build` sprawdź:

- `dist/assets/react/icons` istnieje, gdy `assets/icons` zawiera pliki SVG;
- `dist/assets/react/illustrations` istnieje, gdy `assets/illustrations` zawiera pliki SVG;
- `dist/assets/angular/svg-raw` zawiera surowe źródłowe SVG;
- puste katalogi źródłowe nie psują builda.
