import os
import subprocess


locale = "en"

# Define the file path
file_path = f"i18n/{locale}/docusaurus-theme-classic/footer.json"

# Step 2: Remove the file
if os.path.exists(file_path):
    os.remove(file_path)
    print(f"Removed file: {file_path}")
else:
    print(f"File does not exist: {file_path}")

# Step 3: Run the 'docusaurus write-translations' command with the locale
try:
    subprocess.run(["npx", "docusaurus", "write-translations", "--locale", locale], check=True)
    print("Executed 'docusaurus write-translations' successfully.")
except subprocess.CalledProcessError as e:
    print(f"Error running 'docusaurus write-translations': {e}")
    exit(1)


# Step 4: Replace the string in the file
def replace_string_in_file(file_path, old_string, new_string):
    if not os.path.exists(file_path):
        print(f"File not found for replacement: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    content = content.replace(old_string, new_string)

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(content)

    print(f"Replaced '{old_string}' with '{new_string}' in {file_path}")


# Replace 'Letztes Update' with 'Last Update'
replace_string_in_file(file_path, "Letztes Update", "Last Update")
