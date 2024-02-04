module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "plugin:@docusaurus/recommended",
        "standard-with-typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    ignorePatterns: ["build/"],
    plugins: ["react"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": 0,
        "react/jsx-indent": 0,
        "react/jsx-indent-props": 0,
        "no-plusplus": 0,
        "no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
            },
        ],
        "no-console": 0,
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                ".js": "always",
                ".jsx": "always",
                ".ts": "always",
                ".tsx": "always",
                ".png": "always",
            },
        ],
    },
};
