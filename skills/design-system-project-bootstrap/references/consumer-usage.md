# Dokumentacja użycia przez konsumenta

Używaj tej referencji przy pisaniu README dla aplikacji konsumujących paczkę design systemu.

## Kolejność importów Tailwind

Udokumentuj setup aplikacji przed CSS design systemu:

```css
@import "tailwindcss";
@import "./tailwind-variants.css";
@import "./responsive-values.css";
@import "@scope/design-system/css/tokens.css";
@import "@scope/design-system/css/space.css";
@import "@scope/design-system/css/tokens.tailwind.css";
@import "@scope/design-system/css/typography.css";
```

Zastąp `@scope/design-system` realną nazwą paczki.

## Warianty niestandardowe

Aplikacja konsumująca jest właścicielem wariantów `tablet` i `desktop`:

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

## Wartości responsywne

Aplikacja konsumująca jest właścicielem `--rvw` i `--rpx`:

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

## Stan motywu

Udokumentuj dark mode jako stan dokumentu zarządzany przez aplikację:

```ts
document.documentElement.setAttribute('data-theme', 'dark');
```

Udokumentuj opcjonalne nadpisania skali:

```ts
document.documentElement.setAttribute('data-space-scale', 'mobile');
document.documentElement.setAttribute('data-type-scale', 'desktop');
```

## Wzorzec komponentu Text

Rekomenduj app-side komponent `Text`, który mapuje prop `variant` na klasy `.ds-text` i `.ds-text--{variant}`.
Nie przenoś produktowych komponentów React do paczki design systemu, chyba że zakres paczki jawnie obejmuje komponenty
prymitywne.
