# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd QR_MARKET_FE
npm install
```

## Step 2: Configure Environment

Create a `.env.local` file (already created):

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NODE_ENV=development
```

Make sure your backend is running on `http://localhost:3002`

## Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test Authentication

### Sign Up
1. Navigate to `/signup`
2. Fill in: Email, First Name, Last Name
3. Click "Create Account"

### Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign In"

### Access Dashboard
After login, you can access:
- `/dashboard/cafes` - Manage your cafes
- `/dashboard/qrcodes` - Manage QR codes
- `/dashboard/orders` - View orders
- `/dashboard/analytics` - View analytics
- `/dashboard/profile` - View profile

## Backend Integration

The frontend expects your backend running on `http://localhost:3002` with these endpoints:

### Authentication Endpoints
- `POST /user/login` - Login
  - Request: `{ email, password, platform: "WEB" }`
  - Response: `{ email, role, token, expiresIn }`

- `POST /user/signup/email` - Register
  - Request: `{ email, firstName, lastName, platform: "WEB" }`
  - Response: `{ email, role, token, expiresIn }`

## Project Structure

```
QR_MARKET_FE/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth pages
│   │   ├── dashboard/      # Protected dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/          # React components
│   ├── context/             # React Context (Auth)
│   ├── lib/                 # Utilities
│   ├── services/            # API services
│   └── types/               # TypeScript types
├── public/                  # Static files
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Common Tasks

### Add a New Page

1. Create a file in `src/app/your-page/page.tsx`:

```typescript
"use client";

import { useAuth } from "@/context/AuthContext";

export default function YourPage() {
  const { user, token } = useAuth();
  
  return (
    <div>
      <h1>Your Page</h1>
      <p>Welcome, {user?.email}</p>
    </div>
  );
}
```

### Make an API Call

Use the `apiRequest` function from `@/lib/api`:

```typescript
import apiRequest from "@/lib/api";

const data = await apiRequest("/endpoint", {
  method: "POST",
  body: JSON.stringify({ /* data */ }),
});
```

### Use Authentication

```typescript
import { useAuth } from "@/context/AuthContext";

export default function MyComponent() {
  const { user, login, signup, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <p>Hello, {user.email}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Troubleshooting

### CORS Issues
Make sure your backend has CORS enabled for `http://localhost:3000`

### Token Not Persisting
Tokens are stored in cookies. Check your browser's cookie settings.

### API Not Responding
1. Verify backend is running: `http://localhost:3002/health-check`
2. Check environment variables in `.env.local`
3. Check browser console for errors

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push to GitHub
2. Import project to Vercel
3. Set `NEXT_PUBLIC_API_URL` to your production backend URL
4. Deploy

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
