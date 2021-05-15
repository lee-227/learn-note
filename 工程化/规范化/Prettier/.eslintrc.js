module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ["prettier"],
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
  },
};
