const lwcConfig = require("@salesforce/eslint-config-lwc");
const eslintAura = require("@salesforce/eslint-plugin-aura");

module.exports = [
  {
    ignores: [
      "**/lwc/**/*.css",
      "**/lwc/**/*.html",
      "**/lwc/**/*.json",
      "**/lwc/**/*.svg",
      "**/lwc/**/*.xml",
      "**/aura/**/*.auradoc",
      "**/aura/**/*.cmp",
      "**/aura/**/*.css",
      "**/aura/**/*.design",
      "**/aura/**/*.evt",
      "**/aura/**/*.json",
      "**/aura/**/*.svg",
      "**/aura/**/*.tokens",
      "**/aura/**/*.xml",
      "**/aura/**/*.app",
      ".sfdx/**"
    ]
  },
  ...lwcConfig.configs.recommendedTs,
  ...eslintAura.configs.recommended,
  ...eslintAura.configs.locker
];
