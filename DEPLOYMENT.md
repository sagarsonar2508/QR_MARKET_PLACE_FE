# Deployment Guide

## Development

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Production

### Environment Variables

Create `.env.production` or set via deployment platform:

```env
NEXT_PUBLIC_API_URL=https://api.qrmarket.com
NODE_ENV=production
```

### Build

```bash
npm run build
npm start
```

## Deployment Options

### 1. Vercel (Recommended)

**Benefits:**
- Automatic deployment on push
- Built-in optimization for Next.js
- CDN included
- Free tier available
- Easy environment variable management

**Steps:**
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Set environment variables in project settings
4. Deploy

**Cost:** Free tier or $20+/month for production

### 2. Docker + VPS

**Benefits:**
- Full control
- Can run anywhere
- Affordable with shared hosting

**Build Docker image:**

```bash
docker build -t qr-market-fe .
```

**Run container:**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.qrmarket.com \
  qr-market-fe
```

**Using Docker Compose:**

```bash
docker-compose up -d
```

### 3. Netlify

**Benefits:**
- Free hosting for static sites
- Easy CI/CD integration
- Good performance

**Steps:**
1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy

### 4. Traditional Server (Nginx + Node)

**Setup Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name qrmarket.com www.qrmarket.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/HTTPS

### Let's Encrypt (Free)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certbot -a certbot-nginx -i nginx -d qrmarket.com -d www.qrmarket.com
```

### AWS Certificate Manager

Use if hosting on AWS

## Performance Optimization

### Build Optimization

Next.js automatically optimizes:
- Code splitting
- Image optimization
- Automatic static optimization

### CDN Setup

1. **Cloudflare** (Recommended)
   - Free plan available
   - Fast DNS
   - DDoS protection
   - HTTPS by default

2. **AWS CloudFront**
   - Integrates with AWS
   - Good for global distribution

3. **Vercel Edge Network**
   - Automatic with Vercel
   - Optimized for Next.js

### Image Optimization

Images are automatically optimized by Next.js, served via:
- WebP format when supported
- Responsive sizes
- Lazy loading

## Monitoring

### Error Tracking
- Sentry (recommended)
- Rollbar
- AWS CloudWatch

### Analytics
- Google Analytics
- Vercel Analytics
- Plausible

### Uptime Monitoring
- Uptime Robot (free)
- Pingdom
- AWS CloudWatch

## Database & Backend

Ensure your backend is deployed and accessible:
- Point `NEXT_PUBLIC_API_URL` to your backend domain
- Ensure CORS is configured correctly
- Implement rate limiting on backend

## Security

### Headers

Add security headers via `next.config.ts`:

```typescript
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};
```

### Rate Limiting

Implement on backend API endpoints

### CORS

Only allow frontend domain:

```typescript
corsOptions: {
  origin: ['https://qrmarket.com', 'https://www.qrmarket.com'],
}
```

## Backup & Recovery

1. **Git Repository**: All code backed up
2. **Database**: Implement regular backups
3. **Environment Variables**: Store securely

## Scaling

### Horizontal Scaling

- Deploy to multiple instances
- Use load balancer (AWS ALB, nginx)
- Horizontal scaling is easy with Next.js

### Vertical Scaling

- Increase server resources
- Upgrade database

## Maintenance

### Updates

```bash
npm update
npm audit fix
```

### Monitoring

- Check error logs regularly
- Monitor performance metrics
- Review analytics

### Backup

- Daily database backups
- Code versioning (Git)

## Rollback

### Vercel
- Click "Deployments" → "Rollback"

### Docker
- Tag images with version numbers
- Run previous image version

### Git
```bash
git revert <commit-hash>
git push
```

## Cost Estimation (Monthly)

- **Vercel**: $0 (free tier) - $50+ (pro)
- **Backend VPS**: $5-20
- **Database**: $5-50+
- **CDN (Cloudflare)**: $0 (free)
- **SSL Certificate**: $0 (Let's Encrypt)
- **Domain**: $10-15

**Total**: $20-100+/month depending on scale

## Support & Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
