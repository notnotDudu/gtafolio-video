import { config } from "@remotion/eslint-config-flat";

export default [
  ...config,
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression",
          message: "Keep imports at the top of the file.",
        },
      ],
    },
  },
];
