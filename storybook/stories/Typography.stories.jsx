import React, { useEffect } from 'react';
import desktopTokens from '../../tokens/Type/Semantic-www/Desktop 1728.json';
import tabletTokens from '../../tokens/Type/Semantic-www/Tablet 768.json';
import mobileTokens from '../../tokens/Type/Semantic-www/Mobile 402.json';
import typeCoreTokens from '../../tokens/Type/Core-www/Value.json';
import '../styles/font-faces.css';
import '../../dist/css/tokens.css';
import '../../dist/css/typography.css';

const TOKEN_SETS = {
  desktop: desktopTokens,
  tablet: tabletTokens,
  mobile: mobileTokens,
};

const resolveTokenValue = (token) => {
  const value = token?.$value ?? token?.value;

  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }

  const resolved = value
    .slice(1, -1)
    .split('.')
    .reduce((current, part) => current?.[part], typeCoreTokens);

  return resolved?.$value ?? resolved?.value ?? value;
};

export const Typography = ({ scale = 'desktop' }) => {
  const tokens = TOKEN_SETS[scale].typo;

  useEffect(() => {
    document.documentElement.setAttribute('data-type-scale', scale);

    return () => {
      document.documentElement.removeAttribute('data-type-scale');
    };
  }, [scale]);

  return (
    <main style={{ minHeight: '100vh', padding: 24, color: '#101828', background: '#ffffff' }}>
      <h1 style={{ margin: '0 0 32px', fontSize: 32, lineHeight: '40px' }}>Typography tokens</h1>
      <div style={{ display: 'grid', gap: 18 }}>
        {Object.keys(tokens).map((name) => {
          const family = resolveTokenValue(tokens[name].family);

          return (
            <section
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(160px, 240px) 1fr',
                gap: 24,
                alignItems: 'baseline',
                paddingBottom: 18,
                borderBottom: '1px solid #e4e7ec',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 16, lineHeight: '24px' }}>{name}</h2>
                <p style={{ margin: '4px 0 0', color: '#667085', fontSize: 13 }}>
                  {family} / --typo-{name}-size / weight
                </p>
              </div>
              <p className={`ds-text ds-text--${name}`}>Flience design tokens preview</p>
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default {
  title: 'Tokens/Typography',
  component: Typography,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    scale: {
      options: ['desktop', 'tablet', 'mobile'],
      control: { type: 'inline-radio' },
    },
  },
  args: {
    scale: 'desktop',
  },
};
