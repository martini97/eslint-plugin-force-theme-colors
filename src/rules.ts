import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils';

import { isStyledTagname, getNodeStyles, hasHardcodedColor, getValuesFromTernary, generateDocsUrl } from './utils';

const forceThemeColors = ESLintUtils.RuleCreator(generateDocsUrl)({
  name: 'force-theme-colors',
  meta: {
    type: 'suggestion',
    schema: [],
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

        const styles = getNodeStyles(node);
        const ternaryValues = getValuesFromTernary(node);

        if (!hasHardcodedColor(styles) && !ternaryValues.some(hasHardcodedColor)) return;

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
