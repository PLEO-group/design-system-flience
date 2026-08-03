import React, { useEffect } from 'react';
import desktopTokens from '../../tokens/Type/Semantic-www/Desktop 1728.json';
import tabletTokens from '../../tokens/Type/Semantic-www/Tablet 768.json';
import mobileTokens from '../../tokens/Type/Semantic-www/Mobile 402.json';
import '../../dist/css/tokens.css';
import '../../dist/css/tokens.typography.desktop.css';
import '../../dist/css/tokens.typography.tablet.css';
import '../../dist/css/tokens.typography.mobile.css';
import { cssVarName } from '../utils';

const TOKEN_SETS = {
  desktop: desktopTokens,
  tablet: tabletTokens,
  mobile: mobileTokens,
};

function tokenCssVar(path) {
  return `var(${cssVarName(path)})`;
}

function getTextStyle(name, data) {
  return {
    margin: 0,
    fontFamily: 'var(--font-family-museo), Arial, sans-serif',
    fontSize: tokenCssVar(['typo', name, 'size']),
    fontWeight: tokenCssVar(['typo', name, 'weight']),
    lineHeight: data['line-height'] ? tokenCssVar(['typo', name, 'line-height']) : 1.2,
    letterSpacing: data['letter-spacing'] ? tokenCssVar(['typo', name, 'letter-spacing']) : 0,
  };
}

export const Typography = ({ scale = 'desktop' }) => {
  const tokens = TOKEN_SETS[scale].typo;

  useEffect(() => {
    document.documentElement.setAttribute('data-type-scale', scale);
  }, [scale]);

  return (
    <main style={{ minHeight: '100vh', padding: 24, color: '#101828', background: '#ffffff' }}>
      <h1 style={{ margin: '0 0 32px', fontSize: 32, lineHeight: '40px' }}>Typography tokens</h1>
      <div style={{ display: 'grid', gap: 18 }}>
        {Object.entries(tokens).map(([name, data]) => (
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
                --typo-{name}-size / weight
              </p>
            </div>
            <p style={getTextStyle(name, data)}>Flience design tokens preview</p>
          </section>
        ))}
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
