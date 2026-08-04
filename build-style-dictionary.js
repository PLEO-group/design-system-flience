const fs = require('fs');
const path = require('path');
const StyleDictionary = require('style-dictionary');

const ROOT = __dirname;
const DIST_DIR = path.join(ROOT, 'dist');
const TEMP_DIR = path.join(ROOT, '.style-dictionary-tmp');

const TOKEN_SOURCES = {
  colorBase: 'tokens/Color/Core/Value.json',
  colorLight: 'tokens/Color/Semantic/Light.json',
  colorDark: 'tokens/Color/Semantic/Dark.json',
  typeBase: 'tokens/Type/Core-www/Value.json',
  typeDesktop: 'tokens/Type/Semantic-www/Desktop 1728.json',
  typeTablet: 'tokens/Type/Semantic-www/Tablet 768.json',
  typeMobile: 'tokens/Type/Semantic-www/Mobile 402.json',
};

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function normalizeTokenType(type) {
  return type || 'token';
}

function normalizeDtcg(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeDtcg);
  }

  if (!node || typeof node !== 'object') {
    return node;
  }

  const hasDtcgValue = Object.prototype.hasOwnProperty.call(node, '$value');
  const hasLegacyValue = Object.prototype.hasOwnProperty.call(node, 'value');

  if (hasDtcgValue || hasLegacyValue) {
    const value = hasDtcgValue ? node.$value : node.value;
    const type = hasDtcgValue ? node.$type : node.type;

    return {
      value,
      type: normalizeTokenType(type),
    };
  }

  return Object.entries(node).reduce((acc, [key, value]) => {
    if (!key.startsWith('$')) {
      acc[key] = normalizeDtcg(value);
    }

    return acc;
  }, {});
}

function writeNormalizedTokens(tempDir) {
  return Object.fromEntries(
    Object.entries(TOKEN_SOURCES).map(([key, source]) => {
      const targetPath = path.join(tempDir, `${key}.json`);
      fs.writeFileSync(targetPath, JSON.stringify(normalizeDtcg(readJson(source)), null, 2));
      return [key, path.relative(ROOT, targetPath).replace(/\\/g, '/')];
    })
  );
}

function toKebab(value) {
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_./]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function isColorToken(token) {
  return token.type === 'color' || token.original?.type === 'color';
}

function tokenPath(token) {
  return token.path.map(toKebab).filter(Boolean);
}

function cssVariableName(token) {
  const parts = tokenPath(token);

  if (isColorToken(token) && parts[0] !== 'color') {
    parts.unshift('color');
  }

  return `--${parts.join('-')}`;
}

function referenceToCssVariable(value, token) {
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return null;
  }

  const parts = value.slice(1, -1).split('.').map(toKebab).filter(Boolean);

  if (isColorToken(token) && parts[0] !== 'color') {
    parts.unshift('color');
  }

  return `var(--${parts.join('-')})`;
}

function needsPixelUnit(token) {
  const parts = tokenPath(token);
  const joined = parts.join('-');
  const last = parts[parts.length - 1];

  return (
    joined.startsWith('font-size') ||
    joined.startsWith('line-height') ||
    joined.startsWith('letter-spacing') ||
    last === 'size' ||
    last === 'line-height' ||
    last === 'letter-spacing'
  );
}

function formatCssValue(token, options = {}) {
  if (options.outputReferences) {
    const reference = referenceToCssVariable(token.original?.value, token);

    if (reference) {
      return reference;
    }
  }

  const value = token.value;

  if (typeof value === 'number') {
    return needsPixelUnit(token) ? `${value}px` : String(value);
  }

  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value) && needsPixelUnit(token)) {
    return `${value}px`;
  }

  if (tokenPath(token).join('-').startsWith('font-family') && typeof value === 'string' && value.includes(' ')) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  return String(value);
}

function outputBlock(lines, selector) {
  return `${selector} {
${lines.map((line) => `  ${line}`).join('\n')}
}`;
}

function sourceFileName(filePath) {
  return path.basename(filePath || '');
}

function filterSourceTokens(dictionary, sourceFiles) {
  const sourceFileNames = new Set(sourceFiles.map((filePath) => path.basename(filePath)));
  return dictionary.allProperties.filter((token) => sourceFileNames.has(sourceFileName(token.filePath)));
}

function uniqueLines(tokens, formatter) {
  const seen = new Set();
  const lines = [];

  tokens.forEach((token) => {
    const name = cssVariableName(token);

    if (seen.has(name)) {
      return;
    }

    seen.add(name);
    lines.push(formatter(token));
  });

  return lines;
}

function buildCoreCss({ dictionary, options }) {
  const lines = uniqueLines(dictionary.allProperties, (token) => {
    return `${cssVariableName(token)}: ${formatCssValue(token)};`;
  });

  return outputBlock(lines, options.selector || ':root');
}

function buildSemanticCss({ dictionary, options }) {
  const tokens = filterSourceTokens(dictionary, options.sourceFiles || []);
  const lines = uniqueLines(tokens, (token) => {
    return `${cssVariableName(token)}: ${formatCssValue(token, { outputReferences: true })};`;
  });

  return outputBlock(lines, options.selector || ':root');
}

function buildTailwindCss({ dictionary, options }) {
  const lines = uniqueLines(dictionary.allProperties, (token) => {
    const name = cssVariableName(token);
    return `${name}: var(${name});`;
  });

  return outputBlock(lines, options.selector || '@theme');
}

function buildScssVariables({ dictionary, options }) {
  const tokens = filterSourceTokens(dictionary, options.sourceFiles || []);

  return uniqueLines(tokens, (token) => {
    return `$${cssVariableName(token).slice(2)}: ${formatCssValue(token)} !default;`;
  }).join('\n');
}

function registerFormats() {
  StyleDictionary.registerFormat({
    name: 'flience/css-core-variables',
    formatter: buildCoreCss,
  });

  StyleDictionary.registerFormat({
    name: 'flience/css-semantic-variables',
    formatter: buildSemanticCss,
  });

  StyleDictionary.registerFormat({
    name: 'flience/css-tailwind-theme',
    formatter: buildTailwindCss,
  });

  StyleDictionary.registerFormat({
    name: 'flience/scss-variables',
    formatter: buildScssVariables,
  });
}

function build(config) {
  StyleDictionary.extend(config).buildAllPlatforms();
}

function cssFile(destination, format, options = {}) {
  return {
    destination,
    format,
    options,
  };
}

function getSemanticConfig({ name, include, source, selector, cssDestination, scssDestination }) {
  return {
    include,
    source,
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/css/',
        files: [
          cssFile(cssDestination, 'flience/css-semantic-variables', {
            selector,
            sourceFiles: source,
          }),
        ],
      },
      scss: {
        transformGroup: 'scss',
        buildPath: 'dist/scss/',
        files: [
          {
            destination: scssDestination || `_variables_${name}.scss`,
            format: 'flience/scss-variables',
            options: {
              sourceFiles: source,
            },
          },
        ],
      },
    },
  };
}

function cleanOutput() {
  ['css', 'scss', 'js', 'fonts', 'react'].forEach((directory) => {
    fs.rmSync(path.join(DIST_DIR, directory), { recursive: true, force: true });
  });
}

function readDistCss(fileName) {
  return fs.readFileSync(path.join(DIST_DIR, 'css', fileName), 'utf8').trim();
}

function writeDistCss(fileName, content) {
  fs.writeFileSync(path.join(DIST_DIR, 'css', fileName), `${content.trim()}\n`);
}

function indentLines(lines, spaces) {
  const padding = ' '.repeat(spaces);
  return lines.map((line) => `${padding}${line}`).join('\n');
}

function readCssDeclarationLines(fileName) {
  const css = readDistCss(fileName);
  const start = css.indexOf('{');
  const end = css.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Cannot read CSS declarations from ${fileName}`);
  }

  return css
    .slice(start + 1, end)
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function readCssSelector(fileName) {
  const css = readDistCss(fileName);
  const start = css.indexOf('{');

  if (start === -1) {
    throw new Error(`Cannot read CSS selector from ${fileName}`);
  }

  return css.slice(0, start).trim();
}

function declarationName(line) {
  return line.match(/^\s*(--[^:]+):/)?.[1];
}

function appendUniqueDeclarationLines(lines, extraLines) {
  const seen = new Set(lines.map(declarationName).filter(Boolean));
  const merged = [...lines];

  extraLines.forEach((line) => {
    const name = declarationName(line);

    if (!name || seen.has(name)) {
      return;
    }

    seen.add(name);
    merged.push(line);
  });

  return merged;
}

function resolveDtcgPathValue(root, parts) {
  const node = parts.reduce((current, part) => current?.[part], root);

  if (!node || typeof node !== 'object') {
    return node;
  }

  if (Object.prototype.hasOwnProperty.call(node, '$value')) {
    return node.$value;
  }

  if (Object.prototype.hasOwnProperty.call(node, 'value')) {
    return node.value;
  }

  return undefined;
}

function resolveDtcgValue(value, tokenRoot) {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    return resolveDtcgPathValue(tokenRoot, value.slice(1, -1).split('.'));
  }

  return value;
}

function toCssNumber(value) {
  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().replace(/px$/, '');
  return /^-?\d+(\.\d+)?$/.test(normalized) ? normalized : null;
}

function typographyNumericLines(sourcePath) {
  const typeBase = readJson(TOKEN_SOURCES.typeBase);
  const typography = readJson(sourcePath).typo || {};
  const numericProperties = ['size', 'line-height'];
  const lines = [];

  Object.entries(typography).forEach(([variant, properties]) => {
    numericProperties.forEach((property) => {
      const token = properties?.[property];

      if (!token || typeof token !== 'object') {
        return;
      }

      const rawValue = Object.prototype.hasOwnProperty.call(token, '$value') ? token.$value : token.value;
      const numberValue = toCssNumber(resolveDtcgValue(rawValue, typeBase));

      if (numberValue) {
        lines.push(`--typo-${toKebab(variant)}-${property}-n: ${numberValue};`);
      }
    });
  });

  return lines;
}

function addTypographyNumericVariables(fileName, sourcePath) {
  const selector = readCssSelector(fileName);
  const lines = appendUniqueDeclarationLines(readCssDeclarationLines(fileName), typographyNumericLines(sourcePath));

  writeDistCss(fileName, outputBlock(lines, selector));
}

function typographyVariants() {
  const tokenSets = [
    readJson(TOKEN_SOURCES.typeMobile).typo || {},
    readJson(TOKEN_SOURCES.typeTablet).typo || {},
    readJson(TOKEN_SOURCES.typeDesktop).typo || {},
  ];
  const desktop = tokenSets[2];

  return Object.keys(desktop).map((variant) => ({
    name: toKebab(variant),
    hasLineHeight: tokenSets.every((tokens) => Boolean(tokens[variant]?.['line-height'])),
  }));
}

function writeTypographyTailwindCss() {
  const mobile = readCssDeclarationLines('tokens.typography.mobile.css');
  const tablet = readCssDeclarationLines('tokens.typography.tablet.css');
  const desktop = readCssDeclarationLines('tokens.typography.desktop.css');

  writeDistCss(
    'typography.tailwind.css',
    [
      `:root {
${indentLines(mobile, 2)}

  @variant tablet {
${indentLines(tablet, 4)}
  }

  @variant desktop {
${indentLines(desktop, 4)}
  }
}`,
      outputBlock(mobile, ':root[data-type-scale="mobile"]'),
      outputBlock(tablet, ':root[data-type-scale="tablet"]'),
      outputBlock(desktop, ':root[data-type-scale="desktop"]'),
    ].join('\n\n')
  );
}

function writeTypographyUtilitiesCss() {
  const variantBlocks = typographyVariants().map(({ name, hasLineHeight }) => {
    const lineHeightLines = hasLineHeight
      ? `  --ds-text-line-height-n: var(--typo-${name}-line-height-n);
  --ds-text-line-height-vw: calc(var(--ds-text-line-height-n) * var(--ds-text-rvw));
  --ds-text-line-height-px: calc(var(--ds-text-line-height-n) * var(--ds-text-rpx));
  line-height: var(--typo-${name}-line-height, normal);
  line-height: min(var(--ds-text-line-height-vw), var(--ds-text-line-height-px));`
      : `  line-height: var(--typo-${name}-line-height, normal);`;

    return `.ds-text--${name} {
  --ds-text-size-n: var(--typo-${name}-size-n);
  --ds-text-size-vw: calc(var(--ds-text-size-n) * var(--ds-text-rvw));
  --ds-text-size-px: calc(var(--ds-text-size-n) * var(--ds-text-rpx));
  font-size: var(--typo-${name}-size);
  font-size: min(var(--ds-text-size-vw), var(--ds-text-size-px));
  font-weight: var(--typo-${name}-weight);
${lineHeightLines}
  letter-spacing: var(--typo-${name}-letter-spacing, 0);
}`;
  });

  writeDistCss(
    'typography.utilities.css',
    [
      `.ds-text {
  --ds-text-rpx: var(--rpx, 1px);
  --ds-text-rvw: var(--rvw, var(--ds-text-rpx));
  margin: 0;
  font-family: var(--ds-text-font-family, var(--font-family-museo, "Museo Sans")), Arial, sans-serif;
}`,
      `.ds-text--family-museo {
  --ds-text-font-family: var(--font-family-museo, "Museo Sans");
}`,
      `.ds-text--family-accent {
  --ds-text-font-family: var(--font-family-accent, "Love Ya Like A Sister");
}`,
      ...variantBlocks,
    ].join('\n\n')
  );
}

function writeTypographyBundleCss() {
  const variantDrivenCss = `${readDistCss('typography.tailwind.css')}\n\n${readDistCss('typography.utilities.css')}`;

  writeDistCss(
    'typography.css',
    variantDrivenCss
  );

  writeDistCss(
    'typography.tailwind.css',
    variantDrivenCss
  );
}

function bundleSemanticColorCss() {
  const coreCss = readDistCss('tokens.css');
  const lightCss = readDistCss('tokens.light.css');
  const darkCss = readDistCss('tokens.dark.css');
  const semanticCss = `${lightCss}\n\n${darkCss}`;

  writeDistCss('tokens.semantic.css', semanticCss);
  writeDistCss('tokens.css', `${coreCss}\n\n${semanticCss}`);
}

function run() {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(TEMP_DIR, { recursive: true });

  const normalized = writeNormalizedTokens(TEMP_DIR);

  try {
    cleanOutput();
    registerFormats();

    build({
      source: [normalized.colorBase, normalized.typeBase],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'dist/css/',
          files: [
            cssFile('tokens.css', 'flience/css-core-variables', {
              selector: ':root',
            }),
          ],
        },
      },
    });

    build(
      getSemanticConfig({
        name: 'light',
        include: [normalized.colorBase, normalized.typeBase],
        source: [normalized.colorLight],
        selector: ':root, :root[data-theme="light"]',
        cssDestination: 'tokens.light.css',
      })
    );

    build(
      getSemanticConfig({
        name: 'dark',
        include: [normalized.colorBase, normalized.typeBase],
        source: [normalized.colorDark],
        selector: ':root[data-theme="dark"]',
        cssDestination: 'tokens.dark.css',
      })
    );

    bundleSemanticColorCss();

    build(
      getSemanticConfig({
        name: 'typography_desktop',
        include: [normalized.typeBase],
        source: [normalized.typeDesktop],
        selector: ':root, :root[data-type-scale="desktop"]',
        cssDestination: 'tokens.typography.desktop.css',
      })
    );

    build(
      getSemanticConfig({
        name: 'typography_tablet',
        include: [normalized.typeBase],
        source: [normalized.typeTablet],
        selector: ':root[data-type-scale="tablet"]',
        cssDestination: 'tokens.typography.tablet.css',
      })
    );

    build(
      getSemanticConfig({
        name: 'typography_mobile',
        include: [normalized.typeBase],
        source: [normalized.typeMobile],
        selector: ':root[data-type-scale="mobile"]',
        cssDestination: 'tokens.typography.mobile.css',
      })
    );

    addTypographyNumericVariables('tokens.typography.mobile.css', TOKEN_SOURCES.typeMobile);
    addTypographyNumericVariables('tokens.typography.tablet.css', TOKEN_SOURCES.typeTablet);
    addTypographyNumericVariables('tokens.typography.desktop.css', TOKEN_SOURCES.typeDesktop);

    writeTypographyTailwindCss();
    writeTypographyUtilitiesCss();
    writeTypographyBundleCss();

    build({
      include: [normalized.colorBase, normalized.typeBase],
      source: [normalized.colorLight, normalized.typeDesktop],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'dist/css/',
          files: [
            cssFile('tokens.tailwind.css', 'flience/css-tailwind-theme', {
              selector: '@theme',
            }),
          ],
        },
      },
    });
  } finally {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

run();
