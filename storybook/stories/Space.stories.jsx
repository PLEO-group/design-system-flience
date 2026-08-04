import React, { useEffect } from 'react';
import coreTokens from '../../tokens/Space/Core-www/Value.json';
import desktopTokens from '../../tokens/Space/Semantic-www/Desktop 1728.json';
import tabletTokens from '../../tokens/Space/Semantic-www/Tablet 768.json';
import mobileTokens from '../../tokens/Space/Semantic-www/Mobile 402.json';
import '../../dist/css/tokens.css';
import '../../dist/css/space.css';
import { flattenTokens, sortTokens } from '../utils';

const TOKEN_SETS = {
  desktop: desktopTokens,
  tablet: tabletTokens,
  mobile: mobileTokens,
};

const pageStyle = {
  minHeight: '100vh',
  padding: 24,
  color: '#101828',
  background: '#ffffff',
};

const gridStyle = {
  display: 'grid',
  gap: 16,
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(180px, 260px) 1fr',
  gap: 24,
  alignItems: 'center',
  paddingBottom: 16,
  borderBottom: '1px solid #e4e7ec',
};

const labelStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: '20px',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

const helperStyle = {
  margin: '4px 0 0',
  color: '#667085',
  fontSize: 13,
  lineHeight: '18px',
};

function utilityExamples(tokenName) {
  const suffix = tokenName.slice(2);

  return [`h-${suffix}`, `p-${suffix}`, `gap-${suffix}`].join(' / ');
}

function SpaceRow({ token }) {
  const color = token.path.length > 2 ? '#76b0b6' : '#98d0d0';

  return (
    <section style={rowStyle}>
      <div>
        <p style={labelStyle}>{token.name}</p>
        <p style={helperStyle}>{utilityExamples(token.name)}</p>
      </div>
      <div
        style={{
          width: `var(${token.name})`,
          height: 28,
          minWidth: 2,
          borderRadius: 6,
          background: color,
        }}
      />
    </section>
  );
}

export const Space = ({ scale = 'desktop' }) => {
  const core = sortTokens(flattenTokens(coreTokens).filter((token) => token.path[0] === 'space'));
  const semantic = sortTokens(flattenTokens(TOKEN_SETS[scale]).filter((token) => token.path[0] === 'space'));

  useEffect(() => {
    document.documentElement.setAttribute('data-space-scale', scale);
    document.documentElement.setAttribute('data-type-scale', scale);

    return () => {
      document.documentElement.removeAttribute('data-space-scale');
      document.documentElement.removeAttribute('data-type-scale');
    };
  }, [scale]);

  return (
    <main style={pageStyle}>
      <h1 style={{ margin: '0 0 32px', fontSize: 32, lineHeight: '40px' }}>Space tokens</h1>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 20, lineHeight: '28px' }}>Core</h2>
        <div style={gridStyle}>
          {core.map((token) => (
            <SpaceRow key={token.name} token={token} />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 16px', fontSize: 20, lineHeight: '28px' }}>Semantic</h2>
        <div style={gridStyle}>
          {semantic.map((token) => (
            <SpaceRow key={token.name} token={token} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default {
  title: 'Tokens/Space',
  component: Space,
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
