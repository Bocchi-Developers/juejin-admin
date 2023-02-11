module.exports = {
  extends: require.resolve('@umijs/max/stylelint'),
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'screen',
          'variants',
          'responsive',
        ],
      },
    ],
  },
}
