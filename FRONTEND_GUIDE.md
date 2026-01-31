# QR Market - Frontend Quick Start Guide

## Overview

This is a Next.js 14 application for the QR Code T-Shirt Store. It provides a complete user interface for browsing, customizing, and purchasing t-shirts with custom QR codes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:3002`

## Installation

1. **Navigate to Frontend Directory**
```bash
cd QR_MARKET_FE
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Install QR Code Library** (if not included)
```bash
npm install qrcode
```

## Configuration

### Environment Variables

Create `.env.local` file in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3002

# App Configuration
NEXT_PUBLIC_APP_NAME=QR Market
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page with shirt gallery
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── providers.tsx            # Context providers
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── payment/
│   │   └── page.tsx            # Payment page
│   ├── order-confirmation/
│   │   └── page.tsx            # Order confirmation page
│   ├── shop/
│   │   └── customize/
│   │       └── page.tsx        # Shirt customization page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   └── page.tsx            # Sign up page
│   ├── dashboard/
│   │   └── ...                 # Dashboard pages
│   ├── qr/
│   │   └── ...                 # QR code pages
│   └── api/                    # API routes (if needed)
├── components/                  # Reusable React components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── modals/
├── context/                     # React context
│   └── AuthContext.tsx         # Authentication context
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── services/                    # API service functions
└── types/                       # TypeScript type definitions
```

## Key Pages & Features

### 1. Home Page (`/`)
**Features:**
- Product gallery with shirt designs
- Color indicators for each product
- Price display
- Filter and search (optional)
- Sign up/Login prompts
- "Customize & Design QR" button for each product

**User Flow:**
```
Browse products → No auth required
Select shirt → Navigate to customize page
```

### 2. Customize Page (`/shop/customize`)
**Features:**
- Product image preview
- Color selection
- Size selection (XS to XXL)
- QR code type selection (URL/Text)
- QR code text input
- Real-time QR code generation
- Live preview on shirt mockup
- Proceed to checkout button

**User Flow:**
```
Select color and size → Enter QR code text/URL
Generate QR code → Preview on shirt
Proceed to checkout → Redirect to login if needed
```

### 3. Checkout Page (`/checkout`)
**Features:**
- Order summary with preview
- Full shipping address form
- All fields required validation
- Creates QR code in database
- Creates order with Printify details
- Automatic redirect to payment

**User Flow:**
```
Fill shipping address → Validate form
Create QR code and order → Redirect to payment
```

### 4. Payment Page (`/payment`)
**Features:**
- Order summary
- Card payment form
- Payment processing
- Success redirect to confirmation

**User Flow:**
```
Enter payment details → Process payment
Payment confirmation → Redirect to order confirmation
```

### 5. Order Confirmation Page (`/order-confirmation`)
**Features:**
- Order success message
- Order details and status
- Shipping address display
- Tracking information (if available)
- Next steps guide
- Links to dashboard and shop

**User Flow:**
```
Order placed successfully → View order details
Track order → Continue shopping or view dashboard
```

## API Integration

### Authentication
All API requests use bearer token authentication in the header:
```typescript
{
  "Authorization": "Bearer {token}"
}
```

### Key API Endpoints

**Products** (Public)
- `GET /products` - Get all products
- `GET /products/:id` - Get product details

**QR Codes** (Protected)
- `POST /qrcodes` - Create QR code
- `GET /qrcodes` - Get user's QR codes

**Orders** (Protected)
- `POST /orders` - Create order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details

**Payment** (Protected)
- `POST /payments/initiate` - Initiate payment

## Authentication Context

The app uses AuthContext for global authentication state:

```typescript
const { user, token, login, logout, isLoading } = useAuth();
```

### Features:
- Automatic token persistence
- Login/Logout functionality
- User profile management
- Protected routes
- Auto-logout on token expiry

## Common Tasks

### Add a New Page
1. Create directory in `src/app/`
2. Add `page.tsx` file
3. Implement component with "use client" directive
4. Add navigation links

### Create a New Component
1. Create file in `src/components/`
2. Export React component
3. Import and use in pages

### Add API Integration
1. Create service in `src/services/`
2. Export async functions
3. Handle errors and loading states
4. Call from component with useEffect

### Add Custom Hook
1. Create file in `src/hooks/`
2. Export custom hook function
3. Use `useState`, `useEffect`, `useContext` as needed
4. Import and use in components

## Styling

### Tailwind CSS
The project uses Tailwind CSS for styling. Utility classes are applied directly to JSX:

```jsx
<div className="flex items-center justify-between px-4 py-2 bg-indigo-600 text-white rounded-lg">
  Content
</div>
```

### Global Styles
Global styles are in `src/app/globals.css`

## Debugging

### Browser DevTools
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Check Application → Cookies for auth tokens

### Common Issues

**API Connection Failed**
- Ensure backend is running on `http://localhost:3002`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache

**Authentication Not Working**
- Check localStorage for auth token
- Verify token format in Authorization header
- Check backend JWT secret matches

**QR Code Not Generating**
- Verify `qrcode` npm package is installed
- Check text/URL input is not empty
- Check browser console for errors

**Checkout Not Working**
- Verify user is authenticated
- Check session storage: `sessionStorage.getItem('shirtCustomization')`
- Clear session and try again

## Performance Optimization

### Image Optimization
Images are optimized using Next.js Image component:
```jsx
<Image
  src={imageUrl}
  alt="description"
  width={300}
  height={300}
  priority={false}
/>
```

### Code Splitting
Pages are automatically code-split by Next.js. Dynamic imports available:
```typescript
const Component = dynamic(() => import('...'), {
  loading: () => <p>Loading...</p>
});
```

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms

**Environment Variables Required:**
- `NEXT_PUBLIC_API_URL` - Production API URL

## Environment-Specific Configurations

### Development
```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Staging
```
NEXT_PUBLIC_API_URL=https://staging-api.example.com
```

### Production
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting Commands

### Clear Cache and Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Check Node Version
```bash
node --version  # Should be 18+
npm --version
```

### View Build Output
```bash
npm run build
```

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

## Support Files

- `README.md` - Main project README
- `IMPLEMENTATION_GUIDE.md` - Complete implementation guide
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Next Steps

1. **Install & Run**: `npm install && npm run dev`
2. **Create Sample Products**: Add products via backend API
3. **Test Flow**: Go through complete purchase flow
4. **Configure Payment**: Set up Stripe/PayPal
5. **Deploy**: Push to production environment

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Last Updated**: January 31, 2026
**Version**: 2.0.0
