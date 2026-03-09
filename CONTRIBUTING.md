# Contributing to E-Commerce Frontend

## Git Flow Standards

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/\***: Individual feature branches
- **hotfix/\***: Critical production fixes
- **release/\***: Release preparation branches

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert previous commit

**Examples:**

```
feat(auth): add user authentication
fix(cart): resolve checkout calculation bug
docs(readme): update installation instructions
refactor(api): migrate to new endpoint structure
```

### Pre-commit Hooks

The following validations run automatically on commit:

1. **ESLint**: Code quality and style checks
2. **Prettier**: Code formatting
3. **Commit Message**: Conventional commit format validation

### Pre-push Hooks

Additional validations run before pushing:

1. **TypeScript Type Check**: Ensure no type errors
2. **ESLint**: Full project linting
3. **Build Verification**: Ensure production build succeeds

### Pull Request Process

1. Create feature branch from `develop`
2. Make changes following our coding standards
3. Ensure all pre-commit and pre-push hooks pass
4. Push branch and create PR to `develop`
5. Require 1 approval before merging
6. CI/CD pipeline must pass before merge

### CI/CD Pipeline

**On Pull Request:**

- Code quality checks (linting, formatting)
- TypeScript type checking
- Build verification

**On Push to develop:**

- All PR checks
- Deploy to Vercel preview environment

**On Push to main:**

- All PR checks
- Deploy to Vercel production environment

## Development Setup

```bash
# Install dependencies
npm install

# Setup husky hooks
npm run prepare

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Code Standards

- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow project ESLint configuration
- **Prettier**: Use project Prettier configuration
- **Imports**: Use path aliases (`@/components`, `@/types`, etc.)
- **Types**: Define interfaces in `/src/types/`
- **Constants**: Use constants from `/src/constants/`
- **Hooks**: Business logic goes in `/src/hooks/`
- **Services**: API calls go in `/src/services/`
