import React, { useEffect } from 'react';
import lightTokens from '../../tokens/Color/Semantic/Light.json';
import darkTokens from '../../tokens/Color/Semantic/Dark.json';
import '../../dist/css/tokens.css';
import { Section } from '../components/theme/Section';
import { flattenTokens, groupByFirstSegment, sortTokens } from '../utils';

const SECTION_MODES = {
  bg: 'background',
  text: 'text',
  accent: 'background',
  border: 'border',
  icon: 'text',
};

const wrapperStyle = {
  minHeight: '100vh',
  padding: 24,
  background: 'var(--color-bg-page)',
  color: 'var(--color-text-primary)',
};

export const Theme = ({ theme = 'light' }) => {
  const source = theme === 'dark' ? darkTokens : lightTokens;
  const groupedTokens = groupByFirstSegment(sortTokens(flattenTokens(source).filter((token) => token.type === 'color')));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <main style={wrapperStyle}>
      <h1 style={{ margin: '0 0 32px', fontSize: 32, lineHeight: '40px' }}>Theme tokens</h1>
      {Object.keys(groupedTokens)
        .sort()
        .map((groupName) => (
          <Section
            key={groupName}
            title={groupName}
            tokens={groupedTokens[groupName]}
            mode={SECTION_MODES[groupName] || 'background'}
          />
        ))}
    </main>
  );
};

export default {
  title: 'Tokens/Themes',
  component: Theme,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'inline-radio' },
    },
  },
  args: {
    theme: 'light',
  },
};
