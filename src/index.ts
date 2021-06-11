import rules from './rules';

module.exports = {
  rules: {
    'force-theme-colors': rules.forceThemeColors,
  },
  configs: {
    recommended: {
      rules: {
        'force-theme-colors/force-theme-colors': 2,
      },
    },
  },
};
