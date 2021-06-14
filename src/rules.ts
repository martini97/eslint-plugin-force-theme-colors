import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';

import { isStyledTagname, getNodeStyles, hasHardcodedColor, getValuesFromTernary, generateDocsUrl } from './utils';

const forceThemeColors = ESLintUtils.RuleCreator(generateDocsUrl)({
  name: 'force-theme-colors',
  meta: {
    type: 'suggestion',
    schema: [{ rule: 'string', level: 'string' }],
    docs: {
      category: 'Best Practices',
      description: 'Disallow hardcoded colors for styled components.',
      recommended: 'error',
    },
    messages: {
      badColor: 'Avoid hardcoding colors, prefer to use values from the theme.',
    },
  },
  defaultOptions: [],
  create: function (context) {
    return {
      TaggedTemplateExpression(node: TSESTree.TaggedTemplateExpression) {
        if (!isStyledTagname(node)) return;

        const ignore = context.options
          .map((opt) => Object.entries(opt))
          .flat()
          .map(([rule, level]) => (level === 'ignore' ? rule : undefined))
          .filter(Boolean);
        const styles = getNodeStyles(node)
          .split(';')
          .map((s) => s.trim())
          .filter((rule) => !ignore.includes(rule.split(':')[0]));
        const ternaryValues = getValuesFromTernary(node, ignore);

        if (![...styles, ...ternaryValues].some(hasHardcodedColor)) return;

        context.report({
          node,
          messageId: 'badColor',
        });
      },
    };
  },
});

export default {
  forceThemeColors,
};
