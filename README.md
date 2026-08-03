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
