import resolveFrom from 'resolve-from';
import { TSESLint } from '@typescript-eslint/experimental-utils';
import rules from '../../src/rules';

const ruleTester = new TSESLint.RuleTester({
  parser: resolveFrom(require.resolve('eslint'), 'espree'),
  parserOptions: { ecmaVersion: 2015 },
});

ruleTester.run('force-theme-colors', rules.forceThemeColors, {
  valid: [
    'const myStyle = css`color: ${({ theme }) => theme.colors.blue}`',
    'const Component = styled.div`color: ${({ theme }) => theme.colors.red}`',
    'const myStyle = css`color: ${theme.colors.blue}`',
    'const Component = styled.div`color: ${theme.colors.red}`',
    `const VirtualizedRow = styled(Link)\`
  \${rowCSS}
  height: \${({ size }) => \`\${size}px\`};
  left: 0;
  padding: 25px 20px;
  position: absolute;
  text-decoration: none;
  text-transform: none;
  top: 0;
  transform: \${({ start }) => \`translateY(\${start}px)\`};
  width: 100%;

  span {
    display: block;
    height: 20px;
    line-height: 20px !important;
  }

  :hover {
    background: \${({ theme }) => hexToRGBA(theme.colors.warning, 0.2)};
  }\``,
    {
      code: 'const myStyle = css`box-shadow: red;`',
      options: [{ 'box-shadow': 'ignore' }],
    },
    {
      code: 'const myStyle = css`box-shadow: red; color: red;`',
      options: [{ 'box-shadow': 'ignore', color: 'ignore' }],
    },
    {
      code: 'const myStyle = css`box-shadow: ${isRed ? "red" : "blue"};`',
      options: [{ 'box-shadow': 'ignore' }],
    },
    `const Button = styled(BaseButton)\`
  align-items: center;
  border: none;
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 0 15px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: auto;

  \${({ float }) =>
    float &&
    \`
    float: \${float};
  \`}
\`
    `,
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
    {
      code: 'const myStyle = css`box-shadow: red;`',
      options: [{ shadow: 'ignore' }],
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`background-color: red;`',
      options: [{ color: 'ignore' }],
      errors: [{ messageId: 'badColor' }],
    },
    {
      code: 'const myStyle = css`background-color: ${isRed ? "red" : "blue"};`',
      options: [{ color: 'ignore' }],
      errors: [{ messageId: 'badColor' }],
    },
  ],
});
