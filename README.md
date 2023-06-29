# Bierpongregeln / Beer pong rules

This is a collection of rulesets for beer pong that is served with GitHub Pages.

## How to run locally

1. Install [Docsify-CLI](https://github.com/docsifyjs/docsify-cli#installation)
2. Run `docsify serve docs` in the root directory of this repository.

## Developing the leadboard plugin

1. Run `npm install` to install the dependencies.
2. Use the [VSCode ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to get linting errors in the editor.
3. Run `npm run lint` to lint the code.
4. Run `npm run validate` to validate the tournament data against the schema.

## Developing the spellchecker

1. Run `pip install -r pages_spellchecker/requirements.txt` to install the dependencies.
2. Run `python pages_spellchecker/pages_spellchecker.py` to check the spelling of the pages.
