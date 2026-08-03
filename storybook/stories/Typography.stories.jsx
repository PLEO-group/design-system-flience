import React, { useEffect } from 'react';
import desktopTokens from '../../tokens/Type/Semantic-www/Desktop 1728.json';
import tabletTokens from '../../tokens/Type/Semantic-www/Tablet 768.json';
import mobileTokens from '../../tokens/Type/Semantic-www/Mobile 402.json';
import '../styles/font-faces.css';
import '../../dist/css/tokens.css';
import '../../dist/css/typography.css';

const TOKEN_SETS = {
  desktop: desktopTokens,
  tablet: tabletTokens,
  mobile: mobileTokens,
};

export const Typography = ({ scale = 'desktop', fontFamily = 'museo' }) => {
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
        {Object.keys(tokens).map((name) => (
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
            <p className={`ds-text ds-text--${name} ds-text--family-${fontFamily}`}>
              Flience design tokens preview
            </p>
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
    fontFamily: {
      options: ['museo', 'accent'],
      control: {
        type: 'inline-radio',
        labels: {
          museo: 'Museo Sans',
          accent: 'Love Ya Like A Sister',
        },
      },
    },
  },
  args: {
    scale: 'desktop',
    fontFamily: 'museo',
  },
};
