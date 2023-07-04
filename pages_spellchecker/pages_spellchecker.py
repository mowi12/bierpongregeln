import glob
import os
import re
import json
import sys
from spellchecker import SpellChecker

spell_de = SpellChecker(language="de")
spell_en = SpellChecker(language="en")

# Add words to the dictionary
with open(
    "pages_spellchecker/custom_dictionary.json", "r", encoding="utf-8"
) as json_file:
    spell_de.word_frequency.load_words(json.load(json_file))


def check_markdown_file(file) -> int:
    text = file.read()

    # First the textual content of each markdown file needs to extracted

    # Remove front matter
    text = re.sub(r"^---(.|\s)*?---", "", text, flags=re.MULTILINE)
    # Remove markdown comments e.g. <!-- comment -->
    text = re.sub(r"<!--(.|\s)*?-->", "", text, flags=re.MULTILINE)
    # Remove mdx comments e.g. {/* comment */}
    text = re.sub(r"{/\*(.|\s)*?\*/}", "", text, flags=re.MULTILINE)
    # Remove plugin tags e.g. {{rating}}
    text = re.sub(r"{{(.+?)}}", "", text, flags=re.MULTILINE)
    # Remove html tags e.g. <span> or </span>
    text = re.sub(r"<(.*?)>", "", text, flags=re.DOTALL)
    # Replace markdown links e.g. [link](https://www.example.com) with their link text
    text = re.sub(r"(?<!\!)\[(.+?)\]\((.+?)\)", r"\1", text)
    # Remove markdown images e.g. ![alt text](https://www.example.com/image.png)
    text = re.sub(r"\!\[(.+?)\]\((.+?)\)", "", text)
    # Remove markdown header tags e.g. # or ##
    text = re.sub(r"^(#+\s+)", "", text, flags=re.MULTILINE)
    # Remove markdown bullet tags e.g. * or -
    text = re.sub(r"^(\*|-\s+)", "", text, flags=re.MULTILINE)
    # Remove markdown enumeration tags e.g. 1. or 2.)
    text = re.sub(r"^(\d+\.\s+)", "", text, flags=re.MULTILINE)
    # Remove html entities e.g. &nbsp;
    text = re.sub(r"&(.+);", "", text)
    # Replace hyphen with space
    text = re.sub(r"-", r" ", text)
    # Replace punctuation and other special characters with space
    text = re.sub(r"[^\w\s]", " ", text)

    # Save extracted text to temporary file
    temporary_directory = os.path.join("pages_spellchecker", "tmp", *file.name.split(os.sep)[1:-1])
    extracted_file_name = os.path.join(temporary_directory, file.name.split(os.sep)[-1])
    if not os.path.exists(temporary_directory):
        os.makedirs(temporary_directory)
    with open(extracted_file_name, "w", encoding="utf-8") as extracted_file:
        extracted_file.write(text)

    # Check for misspelled words first in german then in english
    misspelled = spell_de.unknown(text.split())
    misspelled = spell_en.unknown(misspelled)

    misspelled_words_count = len(misspelled)

    if misspelled_words_count > 0:
        print(f"{misspelled_words_count} Misspelled words in {file.name}:")
        print(misspelled)
        print()

    return misspelled_words_count


def main():
    misspelled_words_count = 0
    for file_type in ["md", "mdx"]:
        for markdown_file in glob.glob(f"docs/**/*.{file_type}", recursive=True):
            with open(markdown_file, "r", encoding="utf-8") as file:
                misspelled_words_count += check_markdown_file(file)
    if misspelled_words_count > 0:
        print(f"{misspelled_words_count} Misspelled words in total!")
        sys.exit(1)
    else:
        print("No misspelled words found!")
        sys.exit(0)


if __name__ == "__main__":
    main()
