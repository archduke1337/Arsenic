# Contributing to Arsenic Summit 2024

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow the project's coding standards

## Getting Started

### Fork & Clone
```bash
git clone https://github.com/yourusername/arsenic-nextjs.git
cd arsenic-nextjs
npm install
```

### Setup Development Environment
```bash
cp .env.example .env.local
# Update .env.local with your Appwrite credentials
npm run dev
```

## Development Workflow

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/change-description` - Documentation
- `refactor/area-name` - Code improvements

### Commit Messages
```
type(scope): description

feat(homepage): add dynamic stats fetching
fix(navbar): resolve animation freeze
docs(readme): update setup instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Style

### TypeScript/React
- Use functional components with hooks
- Prop typing with interfaces
- No `any` types without justification
- ESLint configuration provided

### Styling
- Tailwind CSS utilities first
- Use the design system (colors, spacing)
- Mobile-first responsive design
- Dark mode support required

### File Structure
```
components/
├── feature-name/
│   ├── FeatureName.tsx      # Main component
│   ├── FeatureName.module.css # Scoped styles (if needed)
│   └── FeatureName.test.tsx  # Tests
```

## Pull Request Process

1. Create feature branch from `main`
2. Make focused, atomic commits
3. Write clear commit messages
4. Update documentation if needed
5. Ensure all tests pass: `npm run test`
6. Lint code: `npm run lint`
7. Submit PR with description
8. Address review feedback
9. Merge once approved

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue)

## Testing
How to test these changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for clarity
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

## Testing

```bash
npm run test              # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Build & Deployment

### Local Build
```bash
npm run build
npm start
```

### Performance
- Check bundle size: `npm run analyze`
- Test performance: `npm run lighthouse`

## Common Tasks

### Add New Page
```bash
# Create app/new-page/page.tsx
mkdir -p app/new-page
cat > app/new-page/page.tsx << 'EOF'
"use client";

export default function NewPage() {
  return <div>New Page</div>;
}
EOF
```

### Add New Component
```bash
mkdir -p components/ComponentName
# Create ComponentName.tsx
# Add types and exports
```

### Update Database Schema
- Modify `lib/schema.ts`
- Update Appwrite collections
- Document changes in PR

## Issues & Bugs

### Reporting Issues
- Check existing issues first
- Include steps to reproduce
- Provide environment details
- Add screenshots if applicable

### Reporting Security Issues
Please email security concerns privately instead of using issues.

## Questions?

- Check documentation
- Review existing issues
- Join our Discord
- Create a discussion post

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Project documentation
- Release notes

Thank you for contributing! 🎉
