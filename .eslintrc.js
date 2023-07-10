module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb',
        'plugin:@docusaurus/recommended',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    ignorePatterns: [
        'build/',
    ],
    rules: {
        indent: [
            'error',
            4,
        ],
        'linebreak-style': 0,
        'react/jsx-indent': 0,
        'react/jsx-indent-props': 0,
        'import/no-unresolved': 0,
        'no-plusplus': 0,
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'no-console': 0,
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                '.js': 'always',
                '.jsx': 'always',
                '.png': 'always',
            },
        ],
    },
};
