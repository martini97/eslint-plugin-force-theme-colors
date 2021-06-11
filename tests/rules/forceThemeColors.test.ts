import resolveFrom from 'resolve-from';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rules from '../../src/rules';

const ruleTester = new TSESLint.RuleTester({
  parser: resolveFrom(require.resolve('eslint'), 'espree'),
  parserOptions: {
    ecmaVersion: 2015,
  },
});

ruleTester.run('force-theme-colors', rules.forceThemeColors, {
  valid: [
    'const myStyle = css`color: ${({ theme }) => theme.colors.blue}`',
    'const Component = styled.div`color: ${({ theme }) => theme.colors.red}`',
    'const myStyle = css`color: ${theme.colors.blue}`',
    'const Component = styled.div`color: ${theme.colors.red}`',
  ],
  invalid: [
    {
      code: 'const myStyle = css`color: blue;`',
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`color: #0000ff;`',
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`color: rgb(0, 0, 255);`',
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`color: rgba(0, 0, 255, 0);`',
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`color: ${isBlue ? "blue" : "red"};`',
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: `const Text = styled.p\`
  margin-top: 20px;
  text-align: left;

  a {
    color: black;
  }
\``,
      errors: [{ messageId: 'badColor' }],
    },
  ],
});
