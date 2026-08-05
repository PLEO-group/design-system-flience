# Tokeny i Style Dictionary

Używaj tej referencji przy tworzeniu `tokens/`, `build-style-dictionary.js`, `style-dictionary.config.js` albo
wygenerowanych outputów CSS.

## Struktura źródeł

Użyj tego drzewa, chyba że użytkownik potwierdzi inną taksonomię tokenów:

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
```

Akceptuj pola DTCG `$value` i `$type`. Normalizuj je do formatu Style Dictionary `value` i `type` przed wywołaniem
`StyleDictionary.extend(config).buildAllPlatforms()`. Ignoruj klucze metadanych zaczynające się od `$`.

## Zasady skryptu budowania

Preferuj własny `build-style-dictionary.js`, jeśli projekt potrzebuje któregokolwiek z tych elementów:

- normalizacji DTCG;
- selektorów semantic light/dark;
- Tailwind `@theme`;
- dynamicznych wartości spacing opartych o dostarczane przez aplikację `--rvw` i `--rpx`;
- klas typograficznych;
- pochodnych zmiennych numerycznych dla font size, line height i weight.

Zostaw `style-dictionary.config.js` jako mały wskaźnik, jeśli cała realna logika jest w skrypcie.

## Zasady nazewnictwa

- Konwertuj ścieżki tokenów do kebab-case.
- Dodawaj prefiks `--color-` do zmiennych kolorów, gdy ścieżka źródłowa nie zaczyna się już od `color`.
- Rozwiązuj referencje tokenów typu `{foo.bar}` do zmiennych CSS w outputach semantic.
- Dodawaj `px` dla numerycznych tokenów font-size, line-height, letter-spacing, space i size.
- Cytuj wartości font-family zawierające spacje.

## Wymagane wyniki CSS

Kolor:

- `dist/css/tokens.css` - core tokens oraz semantic light/dark colors.
- `dist/css/tokens.semantic.css` - połączone semantic color tokens light/dark.
- `dist/css/tokens.light.css` - semantic color tokens dla light mode.
- `dist/css/tokens.dark.css` - semantic color tokens dla dark mode.
- `dist/css/tokens.tailwind.css` - zmienne Tailwind `@theme`.

Spacing:

- `dist/css/tokens.space.core.css` - dynamiczne core spacing variables.
- `dist/css/tokens.space.mobile.css`
- `dist/css/tokens.space.tablet.css`
- `dist/css/tokens.space.desktop.css`
- `dist/css/space.css`
- `dist/css/space.tailwind.css`

Typography:

- `dist/css/tokens.typography.mobile.css`
- `dist/css/tokens.typography.tablet.css`
- `dist/css/tokens.typography.desktop.css`
- `dist/css/typography.utilities.css`
- `dist/css/typography.css`
- `dist/css/typography.tailwind.css`

## Wartości responsywne

Design system może referencjonować `--rvw` i `--rpx`, ale aplikacja konsumująca jest właścicielem ich wartości. Nie
hardcoduj breakpointów produktowych w CSS paczki poza blokami `@variant tablet` i `@variant desktop` definiowanymi przez aplikację.

## Fonty

Nie ładuj fontów z `dist/css/tokens.css`. Eksponuj nazwy zmiennych font-family i pozwól aplikacji konsumenckiej powiązać
fonty, na przykład `--font-family-museo` i `--font-family-accent`.
