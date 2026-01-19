# Contributing to Meet in the Middle

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m "Add: description of your changes"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

See the [README.md](README.md) for detailed setup instructions.

```bash
npm install
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Commit Message Guidelines

Use clear, descriptive commit messages:
- `Add: new feature or functionality`
- `Fix: bug fix`
- `Update: improvements to existing features`
- `Refactor: code restructuring without behavior changes`
- `Docs: documentation updates`
- `Style: formatting, missing semicolons, etc.`
- `Test: adding or updating tests`

## Pull Request Process

1. Update README.md if needed
2. Ensure all tests pass
3. Update documentation for new features
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Areas for Contribution

### High Priority
- Database integration (PostgreSQL/MongoDB)
- WebSocket support for real-time updates
- Google Maps API integration
- Comprehensive testing suite
- Performance optimization

### Medium Priority
- User authentication
- Saved location profiles
- Travel time optimization
- Venue filtering enhancements
- Mobile native apps

### Documentation
- API documentation
- User guides
- Deployment guides
- Architecture diagrams

## Testing

Before submitting a PR:
- Test the complete user flow
- Test on both desktop and mobile viewports
- Test with multiple participants (5+)
- Test error scenarios
- Test with slow network conditions

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Documentation improvements
- General questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
