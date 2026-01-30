# QR Market Frontend - Project Overview

## Project Summary

A modern Next.js frontend for QR Market, featuring:
- ✅ User authentication (signup/login)
- ✅ Protected routes & dashboard
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ React Query for data management
- ✅ JWT token management
- ✅ Responsive design

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with SSR
- **React 18** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS
- **PostCSS** - CSS processing

### State Management & Data
- **React Context** - Auth state
- **React Query** - Server state management
- **Cookies** - Token storage

### HTTP Client
- **Fetch API** - Built-in HTTP client
- **Axios** - Optional alternative

## Project Structure

```
QR_MARKET_FE/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Auth group
│   │   │   ├── login/page.tsx       # Login page
│   │   │   └── signup/page.tsx      # Signup page
│   │   ├── dashboard/               # Protected routes
│   │   │   ├── layout.tsx           # Dashboard layout
│   │   │   ├── cafes/page.tsx       # Cafes management
│   │   │   ├── qrcodes/page.tsx     # QR codes management
│   │   │   ├── orders/page.tsx      # Orders view
│   │   │   ├── analytics/page.tsx   # Analytics dashboard
│   │   │   └── profile/page.tsx     # User profile
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   ├── globals.css              # Global styles
│   │   └── providers.tsx            # Providers wrapper
│   ├── components/                  # React components
│   │   ├── Input.tsx                # Input component
│   │   ├── Button.tsx               # Button component
│   │   ├── Card.tsx                 # Card component
│   │   └── index.ts                 # Barrel exports
│   ├── context/                     # React Context
│   │   └── AuthContext.tsx          # Auth context & provider
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API request utility
│   │   └── validations.ts           # Validation functions
│   ├── services/                    # API services
│   │   └── auth.service.ts          # Authentication service
│   └── types/                       # TypeScript types
│       └── index.ts                 # Type definitions
├── public/                          # Static assets
├── .eslintrc.json                   # ESLint config
├── .gitignore
├── .env.example                     # Environment template
├── .env.local                       # Local environment (created)
├── docker-compose.yml               # Docker Compose config
├── Dockerfile                       # Docker image
├── next.config.ts                   # Next.js config
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── API_DOCUMENTATION.md             # API docs
├── DEPLOYMENT.md                    # Deployment guide
├── QUICKSTART.md                    # Quick start guide
└── README.md                        # Main readme
```

## Features Implemented

### Authentication
- [x] User signup with email
- [x] User login with email/password
- [x] JWT token management
- [x] Token persistence (cookies)
- [x] Logout functionality
- [x] Auth context for state management

### Pages
- [x] Landing page (/)
- [x] Login page (/login)
- [x] Signup page (/signup)
- [x] Dashboard layout (/dashboard)
- [x] Cafes page (/dashboard/cafes)
- [x] QR Codes page (/dashboard/qrcodes)
- [x] Orders page (/dashboard/orders)
- [x] Analytics page (/dashboard/analytics)
- [x] Profile page (/dashboard/profile)

### Components
- [x] Input component with validation
- [x] Button component with variants
- [x] Card component
- [x] Navigation bar

### Utilities
- [x] API request handler
- [x] Token management
- [x] Validation functions
- [x] Error handling

### Documentation
- [x] README.md
- [x] QUICKSTART.md
- [x] API_DOCUMENTATION.md
- [x] DEPLOYMENT.md

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   cd QR_MARKET_FE
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Already created .env.local with:
   NEXT_PUBLIC_API_URL=http://localhost:3002
   NODE_ENV=development
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

## API Integration

### Backend Requirements
Your backend should be running on `http://localhost:3002` with these endpoints:

- `POST /user/login` - User login
- `POST /user/signup/email` - Email signup
- `POST /user/verify-email` - Verify email
- `POST /user/set-password` - Set password

### Response Format
Backend should return:
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "role": "cafe_owner",
    "token": "jwt-token",
    "expiresIn": 10800
  },
  "message": "Success message"
}
```

## Usage Examples

### Using Authentication

```typescript
import { useAuth } from "@/context/AuthContext";

export default function MyComponent() {
  const { user, login, logout } = useAuth();

  const handleLogin = async () => {
    await login("user@example.com", "password");
  };

  return (
    <div>
      {user ? (
        <p>Hello {user.email}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Making API Calls

```typescript
import apiRequest from "@/lib/api";

const response = await apiRequest("/endpoint", {
  method: "POST",
  body: JSON.stringify({ data }),
});
```

### Using Components

```typescript
import { Input, Button, Card } from "@/components";

export default function MyForm() {
  return (
    <Card>
      <Input label="Email" type="email" />
      <Button variant="primary" fullWidth>
        Submit
      </Button>
    </Card>
  );
}
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Type check with TypeScript
```

## Configuration Files

### next.config.ts
- Next.js configuration
- Environment variables setup
- API URL configuration

### tailwind.config.ts
- Tailwind CSS configuration
- Custom colors and theme

### tsconfig.json
- TypeScript configuration
- Path aliases (@/*)

### postcss.config.js
- PostCSS plugins (Tailwind, Autoprefixer)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## Security Features

- ✅ HTTPS ready (production)
- ✅ httpOnly cookies for token storage
- ✅ CSRF protection ready
- ✅ XSS protection via React
- ✅ Content Security Policy ready

## Future Features

- [ ] Email verification flow
- [ ] Password reset
- [ ] Google OAuth
- [ ] QR code generation
- [ ] Analytics charts
- [ ] Cafe management
- [ ] Order management
- [ ] User notifications
- [ ] Dark mode
- [ ] Multi-language support

## Troubleshooting

### CORS Errors
- Ensure backend is running
- Check CORS configuration in backend
- Verify API URL in .env.local

### Token Not Persisting
- Check browser cookie settings
- Verify httpOnly cookie is set
- Check browser console for errors

### 404 Errors on Pages
- Ensure you're accessing correct routes
- Check page files exist in src/app/
- Restart development server

## Support & Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)

## License

MIT

## Contact

For issues or questions, please open an issue in the repository.

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Ready for development
