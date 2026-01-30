# QR Market Frontend

Next.js + TypeScript + Tailwind CSS + React Query

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/page.tsx     # Login page
│   ├── signup/page.tsx    # Signup page
│   ├── globals.css        # Global styles
│   └── providers.tsx      # Providers wrapper
├── components/            # Reusable React components
├── context/               # React Context (Auth)
├── lib/                   # Utility functions
├── services/              # API services
├── styles/                # Global styles
└── types/                 # TypeScript types
```

## Features

- ✅ User Authentication (Login/Signup)
- ✅ JWT Token Management
- ✅ Protected Routes
- ✅ Responsive Design with Tailwind CSS
- ✅ TypeScript for Type Safety
- ✅ React Query for Data Fetching
- ✅ Server-Side Rendering (SSR) with Next.js

## API Endpoints

### Authentication

- `POST /user/login` - User login
- `POST /user/signup/email` - Email signup
- `POST /user/verify-email` - Verify email
- `POST /user/set-password` - Set password

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **Authentication**: JWT
- **HTTP Client**: Fetch API + Axios

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT
