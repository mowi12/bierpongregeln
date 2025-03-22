import json
import subprocess


def get_current_version():
    with open("package.json", "r") as file:
        data = json.load(file)
    return data["version"]


def update_version(version, part):
    major, minor, patch = map(int, version.split("."))

    if part == "m":  # Major
        major += 1
        minor = 0
        patch = 0
    elif part == "n":  # Minor
        minor += 1
        patch = 0
    elif part == "p":  # Patch
        patch += 1
    else:
        print("Invalid input.")
        return None

    return f"{major}.{minor}.{patch}"


def save_new_version(new_version):
    with open("package.json", "r") as file:
        data = json.load(file)

    data["version"] = new_version

    with open("package.json", "w") as file:
        json.dump(data, file, indent=2)

    print(f"Version updated to {new_version} in package.json")


def main():
    current_version = get_current_version()
    print(f"Current version is {current_version}\n")

    print("Which part of the version would you like to update?")
    print("1. Major - Breaking changes")
    print("2. Minor - Backward-compatible features")
    print("3. Patch - Bug fixes\n")

    choice = input("(m) Major, (n) Minor, (p) Patch: ")

    new_version = update_version(current_version, choice)

    if new_version:
        save_new_version(new_version)


if __name__ == "__main__":
    main()
