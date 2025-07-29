# Contributing to Bierpongregeln

Thank you for your interest in contributing to Bierpongregeln! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inspiring community for all.

## How Can I Contribute?

### Reporting Issues

We use GitHub Issues to track bugs and feature requests. Before creating an issue, please:

1. **Search existing issues** to see if your problem has already been reported
2. **Use the appropriate issue template** from our collection:

   - [Feature Request](.github/ISSUE_TEMPLATE/feature.yml) - For new features
   - [Bug Report](.github/ISSUE_TEMPLATE/bug.yml) - For bugs and problems
   - [Enhancement Request](.github/ISSUE_TEMPLATE/enhancement.yml) - For improving existing features
   - [Refactor Request](.github/ISSUE_TEMPLATE/refactor.yml) - For code improvements
   - [General Issue](.github/ISSUE_TEMPLATE/general.yml) - For other issues

3. **Provide as much detail as possible** to help us understand and reproduce the issue

### Suggesting Features

We welcome feature suggestions! When suggesting a feature:

- Explain the problem it solves
- Describe how it would work
- Consider the impact on existing functionality
- Think about the user experience

### Submitting Pull Requests

1. **Fork the repository** and create a feature branch
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Write clear commit messages** following conventional commits
5. **Submit a pull request** with a clear description of your changes

## Development Guidelines

### Code Style

- **Use the appropriate language for each part of the project:**
  - Frontend components: TypeScript/JavaScript
  - Backend services: Use the language specified for that service (e.g., Kotlin, Python, etc.)
  - Scripts and utilities: Use the most appropriate language (Bash, Python, etc.)
  - Configuration files: Use the format specified in the project
- Follow the existing code style and formatting for the language you're using
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

The scope is optional and should describe the part of the project being changed.

Examples:

- `feat(rules): add new tournament format`
- `fix(ui): resolve mobile layout issue`
- `docs(readme): update installation instructions`
- `feat: add new feature` (no scope)
- `fix: resolve bug` (no scope)

### Testing

- Write tests for new functionality
- Ensure existing tests pass
- Test on different browsers and devices when applicable

### Pull Request Process

1. **Create a descriptive title** for your PR
2. **Fill out the PR template** completely
3. **Link related issues** using keywords like "Fixes #123" or "Closes #456"
4. **Request reviews** from maintainers
5. **Address feedback** promptly

## Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Reach out to maintainers for guidance

## Recognition

Contributors will be recognized in our README and release notes. We appreciate all contributions, big and small!

Thank you for contributing to Bierpongregeln!
