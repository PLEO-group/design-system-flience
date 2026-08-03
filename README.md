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

Import tokens, responsive typography variables and text utilities in the app stylesheet:

```css
@import "tailwindcss";

@import "@pleodigital/design-system-flience/css/tokens.css";
@import "@pleodigital/design-system-flience/css/typography.css";
```

Use `typography.tailwind.css` instead of `typography.responsive.css` when the consuming app defines its own Tailwind `tablet` and `desktop` custom variants:

```css
@import "tailwindcss";
@import "./tailwind-variants.css";
@import "@pleodigital/design-system-flience/css/tokens.css";
@import "@pleodigital/design-system-flience/css/typography.tailwind.css";
```

The app-level `tailwind-variants.css` can define `tablet` and `desktop` itself, or you can import the package default from `@pleodigital/design-system-flience/css/tailwind-variants.css`.

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
- `dist/css/typography.css` - responsive typography variables plus `.ds-text` utilities.
- `dist/css/typography.responsive.css` - mobile-first typography variables with built-in tablet and desktop media queries.
- `dist/css/typography.tailwind.css` - typography variables switched through Tailwind `tablet` and `desktop` custom variants, plus `.ds-text` utilities.
- `dist/css/typography.utilities.css` - `.ds-text` and `.ds-text--{variant}` classes for an app-side text component.
- `dist/css/tailwind-variants.css` - optional default `tablet` and `desktop` Tailwind custom variants.
