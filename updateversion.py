import json
import subprocess


def get_current_version():
    with open("package.json", "r") as file:
        data = json.load(file)
    return data["version"]


def update_version(version, part):
    major, minor, patch = map(int, version.split("."))

    if part == "1":  # Major
        major += 1
        minor = 0
        patch = 0
    elif part == "2":  # Minor
        minor += 1
        patch = 0
    elif part == "3":  # Patch
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
        json.dump(data, file, indent=4)

    print(f"Version updated to {new_version} in package.json")


def run_npm_build():
    try:
        subprocess.run(["npm", "run", "build"], check=True)
        print("\nBuild completed. Version should be updated.")
    except subprocess.CalledProcessError as e:
        print(f"Error running npm build: {e}")


def main():
    current_version = get_current_version()
    print(f"Current version is {current_version}\n")

    print("Which part of the version would you like to update?")
    print("1. Major (x) - Breaking changes")
    print("2. Minor (y) - Backward-compatible features")
    print("3. Patch (z) - Bug fixes\n")

    choice = input("Enter the number (1 for Major, 2 for Minor, 3 for Patch): ")

    new_version = update_version(current_version, choice)
    if new_version:
        save_new_version(new_version)
        run_npm_build()


if __name__ == "__main__":
    main()
