# design-system-flience

Design token package for Flience, built with Style Dictionary and documented in Storybook.

## Scripts

- `npm run build:tokens` - generates CSS and SCSS token outputs in `dist`.
- `npm run build` - builds tokens and transforms SVG assets.
- `npm run storybook` - builds assets and starts Storybook on port 6006.
- `npm run build-storybook` - builds a static Storybook in `storybook-static`.

## Font Loading

The main `dist/css/tokens.css` file does not load fonts. It only exposes font-family token values.

For Next.js applications, prefer `next/font/local` in the app and bind the loaded fonts to the same CSS variables:

- `--font-family-museo`
- `--font-family-accent`

Storybook loads local preview fonts from `assets/fonts` through `storybook/styles/font-faces.css`. Font files are not copied into `dist`.

## Next.js + Tailwind Usage

Define the app-specific Tailwind variants in the consuming application, then import the design system tokens and typography CSS.

Example app-level `tailwind-variants.css`:

```css
@custom-variant tablet {
  @media (width >= 36rem) and (orientation: portrait) and (pointer: coarse),
         (width >= 36rem) and (orientation: portrait) and (pointer: fine) {
    @slot;
  }
}

@custom-variant desktop {
  @media (width >= 64rem) {
    @slot;
  }
}
```

Then import it before the design system typography CSS:

```css
@import "tailwindcss";
@import "./tailwind-variants.css";
@import "@pleodigital/design-system-flience/css/tokens.css";
@import "@pleodigital/design-system-flience/css/typography.css";
```

The design system CSS does not define `tablet` or `desktop` conditions. It only uses those custom variant names to switch typography token values.

Then create the app-side text component by mapping the `variant` prop to package CSS classes:

```tsx
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lead'
  | 'body'
  | 'body-sm'
  | 'label'
  | 'eyebrow'
  | 'caption'
  | 'quote'
  | 'menu-item'
  | 'price';

type TextProps<TElement extends ElementType = 'p'> = {
  as?: TElement;
  variant?: TextVariant;
  family?: 'museo' | 'accent';
  className?: string;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'className'>;

export function Text<TElement extends ElementType = 'p'>({
  as,
  variant = 'body',
  family = 'museo',
  className,
  ...props
}: TextProps<TElement>) {
  const Component = as || 'p';
  const classes = ['ds-text', `ds-text--${variant}`, `ds-text--family-${family}`, className]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes} {...props} />;
}
```

## Structure

- `tokens/` - source tokens exported from Figma/Tokens Studio.
- `assets/icons/` - source SVG icons.
- `assets/illustrations/` - source SVG illustrations.
- `assets/fonts/` - source font files for Storybook preview only.
- `storybook/` - Storybook stories, components and utilities.
- `.storybook/` - Storybook configuration.
- `dist/` - generated package output.

## CSS Output

- `dist/css/tokens.css` - core tokens plus light and dark semantic color tokens, without `@font-face`.
- `dist/css/tokens.semantic.css` - only light and dark semantic color tokens.
- `dist/css/tokens.light.css` - light semantic color tokens.
- `dist/css/tokens.dark.css` - dark semantic color tokens for `[data-theme="dark"]`.
- `dist/css/tokens.tailwind.css` - CSS `@theme` variables for Tailwind CSS.
- `dist/css/tokens.typography.mobile.css` - mobile typography token variables for `[data-type-scale="mobile"]`.
- `dist/css/tokens.typography.tablet.css` - tablet typography token variables for `[data-type-scale="tablet"]`.
- `dist/css/tokens.typography.desktop.css` - desktop typography token variables for `:root` and `[data-type-scale="desktop"]`.
- `dist/css/typography.css` - typography variables switched through app-defined Tailwind `tablet` and `desktop` custom variants, plus `.ds-text` utilities.
- `dist/css/typography.tailwind.css` - same as `typography.css`, kept as an explicit Tailwind-oriented import path.
- `dist/css/typography.utilities.css` - `.ds-text` and `.ds-text--{variant}` classes for an app-side text component.
