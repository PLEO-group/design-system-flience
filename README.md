# design-system-flience

Design token package for Flience, built with Style Dictionary and documented in Storybook.

## Scripts

- `npm run build:tokens` - generates CSS, SCSS and Tailwind preset outputs in `dist`.
- `npm run build` - builds tokens and transforms SVG assets.
- `npm run storybook` - builds assets and starts Storybook on port 6006.
- `npm run build-storybook` - builds a static Storybook in `storybook-static`.

## Structure

- `tokens/` - source tokens exported from Figma/Tokens Studio.
- `assets/icons/` - source SVG icons.
- `assets/illustrations/` - source SVG illustrations.
- `storybook/` - Storybook stories, components and utilities.
- `.storybook/` - Storybook configuration.
- `dist/` - generated package output.
