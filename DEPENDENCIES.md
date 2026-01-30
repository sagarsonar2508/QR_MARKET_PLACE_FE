# Frontend Dependencies & Versions

## Core Dependencies

### Framework & Rendering
- **next@^14.0.0** - React framework with SSR/SSG
- **react@^18.2.0** - UI library
- **react-dom@^18.2.0** - React DOM rendering

### State Management & Data
- **@tanstack/react-query@^5.0.0** - Server state management
- **js-cookie@^3.0.5** - Cookie management for token storage

### HTTP Client
- **axios@^1.6.0** - Promise-based HTTP client

## Development Dependencies

### Language & Type Checking
- **typescript@^5.3.0** - TypeScript compiler
- **@types/node@^20.0.0** - Node.js type definitions
- **@types/react@^18.2.0** - React type definitions
- **@types/react-dom@^18.2.0** - React DOM type definitions
- **@types/js-cookie@^3.0.6** - js-cookie type definitions

### Styling
- **tailwindcss@^3.3.0** - Utility-first CSS framework
- **postcss@^8.4.0** - CSS transformation tool
- **autoprefixer@^10.4.0** - PostCSS plugin for vendor prefixes

### Linting & Quality
- **eslint@^8.50.0** - JavaScript linter
- **eslint-config-next@^14.0.0** - ESLint config for Next.js

## Installation Size

Total (with node_modules): ~500MB

## Upgrade Guide

### To latest Next.js
```bash
npm install next@latest react@latest react-dom@latest
npm install -D @types/react@latest @types/react-dom@latest
```

### To latest React Query
```bash
npm install @tanstack/react-query@latest
```

### To latest TypeScript
```bash
npm install -D typescript@latest
npm run type-check
```

## Compatible Versions

All versions are compatible with:
- Node.js 18+
- npm 8+
- Node v16+ (minimum)

## Package Size Breakdown

| Package | Size |
|---------|------|
| next | ~25MB |
| react | ~15MB |
| tailwindcss | ~20MB |
| typescript | ~80MB |
| Other deps | ~200MB |
| node_modules | ~500MB |

## Security Updates

To check for vulnerabilities:
```bash
npm audit
```

To fix vulnerabilities:
```bash
npm audit fix
```

## Dependency Tree

```
QR_MARKET_FE
├── next@14.0.0
│   ├── react@18.2.0
│   ├── react-dom@18.2.0
│   └── ...
├── @tanstack/react-query@5.0.0
├── axios@1.6.0
├── js-cookie@3.0.5
└── [dev dependencies...]
```

## Alternative Packages

### State Management Alternatives
- **Zustand** - Lightweight alternative to Context
- **Recoil** - Meta's state management
- **Redux** - More robust for large apps

### HTTP Client Alternatives
- **Fetch API** - Native browser API (already used)
- **Got** - For backend requests
- **node-fetch** - Node.js fetch polyfill

### Styling Alternatives
- **CSS Modules** - Scoped CSS files
- **Styled Components** - CSS-in-JS
- **Emotion** - Another CSS-in-JS option

### UI Component Library Alternatives
- **shadcn/ui** - Copy-paste React components
- **Material-UI (MUI)** - Full component library
- **Chakra UI** - Accessible component library
- **DaisyUI** - Tailwind component library

## Performance Optimization Packages

For future optimization:
- **image-optimization** - Already built into Next.js
- **next-pwa** - Progressive Web App support
- **sentry** - Error tracking
- **vercel-analytics** - Built-in with Vercel

## Monorepo Support

If planning to expand to monorepo:
- **turborepo** - Monorepo management
- **lerna** - Alternative monorepo tool
- **workspaces** - npm native workspaces

## CI/CD Integration

Recommended tools:
- **GitHub Actions** - Free CI/CD
- **Vercel** - Automatic deployment
- **GitLab CI** - Built-in CI/CD
- **CircleCI** - Docker-based CI

## License Info

All packages used are open-source:
- **MIT License** - Most packages
- **Apache 2.0** - Some packages
- **ISC License** - Some packages

Check individual packages for license details:
```bash
npm license
```

## Update Strategy

### Monthly Check
```bash
npm outdated  # Check for new versions
npm update    # Update within version range
```

### Minor Version Upgrade
```bash
npm install next@latest
npm run build  # Test build
```

### Major Version Upgrade
1. Check changelog
2. Test locally
3. Update gradually
4. Run full test suite

## Troubleshooting Installation

### If npm install fails
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### If TypeScript errors occur
```bash
npm run type-check
```

### If build fails
```bash
npm run build -- --debug
```

## Yarn Alternative

If using Yarn instead of npm:
```bash
yarn install
yarn dev
yarn build
yarn start
```
