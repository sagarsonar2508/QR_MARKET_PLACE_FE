# Troubleshooting Guide

## Common Issues & Solutions

### Installation Issues

#### npm install fails
**Problem**: Dependencies won't install
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency peer
```

**Solutions**:
```bash
# Option 1: Force installation
npm install --legacy-peer-deps

# Option 2: Clean and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Option 3: Use Node 18
nvm use 18
npm install
```

#### TypeScript errors after install
**Problem**: "Cannot find module" errors
```bash
# Solution
npm install --save-dev typescript
npm run type-check
```

#### Port already in use
**Problem**: Port 3000 already in use
```
Error: listen EADDRINUSE :::3000
```

**Solutions**:
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process on port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

---

### Authentication Issues

#### Login fails with CORS error
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Check backend is running:
   ```bash
   curl http://localhost:3002/health-check
   ```

2. Verify CORS config in backend (app.ts):
   ```typescript
   corsOptions: {
     origin: ['http://localhost:3000'],
     credentials: true
   }
   ```

3. Check environment variable:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3002
   ```

#### Token not saving
**Problem**: After login, token isn't persisted

**Solutions**:
1. Check if cookies are enabled in browser
2. Clear browser cookies: Settings → Privacy → Clear cookies
3. Check browser console for errors
4. Verify token is returned from backend

#### Stuck on login page
**Problem**: After login, stays on login page

**Solutions**:
1. Check console for errors (F12)
2. Verify token is saved: DevTools → Application → Cookies
3. Check backend returns valid token:
   ```json
   {
     "token": "eyJhbGc...",
     "expiresIn": 10800
   }
   ```

#### Logout not working
**Problem**: Logout doesn't clear session

**Solutions**:
```typescript
// In AuthContext
const logout = () => {
  removeAuthToken();      // Remove cookie
  setUser(null);         // Clear user state
  setToken(null);        // Clear token state
  router.push('/login');  // Redirect
};
```

---

### API Integration Issues

#### API returns 404
**Problem**: "Cannot POST /user/login"

**Solutions**:
1. Check backend is running on port 3002
2. Verify endpoint exists:
   ```bash
   curl -X POST http://localhost:3002/user/login
   ```
3. Check your backend routes file

#### API returns 500
**Problem**: "Internal Server Error"

**Solutions**:
1. Check backend server logs
2. Verify database is connected
3. Check environment variables on backend
4. Verify request body format

#### API returns 401 Unauthorized
**Problem**: "Not authenticated"

**Solutions**:
1. Check if token is being sent in headers
2. Verify token is valid
3. Check token hasn't expired
4. Verify Authorization header format: `Bearer {token}`

#### Network timeout
**Problem**: API requests timeout

**Solutions**:
1. Check backend is running
2. Check network connectivity
3. Increase timeout:
   ```typescript
   // In api.ts
   const response = await fetch(url, {
     ...options,
     timeout: 10000, // 10 seconds
   });
   ```

---

### Page & Routing Issues

#### 404 Page Not Found
**Problem**: Page exists but shows 404

**Solutions**:
1. Check file exists in `src/app/`
2. File must be named `page.tsx`
3. Restart dev server: `npm run dev`
4. Check page syntax

#### Protected route not working
**Problem**: Can access dashboard without login

**Solutions**:
1. Add auth check in layout:
   ```typescript
   useEffect(() => {
     if (!token) {
       router.push('/login');
     }
   }, [token, router]);
   ```

#### Infinite redirect loop
**Problem**: Keep getting redirected to login

**Solutions**:
1. Check AuthContext is working
2. Verify token is being set after login
3. Check router.push() logic
4. Add loading state to prevent premature redirects

---

### Styling Issues

#### Tailwind CSS not working
**Problem**: Styles not applying

**Solutions**:
1. Check `tailwind.config.ts` includes correct paths:
   ```typescript
   content: [
     "./src/app/**/*.{js,ts,jsx,tsx}",
     "./src/components/**/*.{js,ts,jsx,tsx}",
   ]
   ```

2. Import globals.css in layout
3. Restart dev server
4. Clear Next.js cache: `rm -rf .next`

#### Some styles missing
**Problem**: Some classes work, others don't

**Solutions**:
1. Check class names are correct
2. Verify class is in tailwind.config.ts content array
3. Check for CSS conflicts
4. Use `!important` temporarily to debug

#### Responsive design broken
**Problem**: Mobile view doesn't respond to breakpoints

**Solutions**:
1. Check meta viewport tag in layout
2. Verify Tailwind breakpoints used (sm, md, lg, xl)
3. Clear browser cache
4. Test in different browser

---

### Performance Issues

#### Slow page load
**Problem**: Pages taking > 2 seconds to load

**Solutions**:
1. Check Network tab in DevTools
2. Optimize images
3. Reduce JavaScript bundle
4. Enable production build: `npm run build && npm start`

#### High memory usage
**Problem**: Browser memory keeps increasing

**Solutions**:
1. Check for memory leaks in components
2. Cleanup subscriptions in useEffect
3. Avoid inline functions in render
4. Use React.memo for expensive components

---

### Development Environment Issues

#### Node version incompatible
**Problem**: "Node version not compatible"

**Solutions**:
```bash
# Check Node version
node --version  # Should be 18+

# Update Node
# Windows/Mac: Download from nodejs.org
# Linux: 
nvm install 18
nvm use 18
```

#### Package version conflicts
**Problem**: "Peer dependency not met"

**Solutions**:
1. Install with legacy flag
2. Or manually specify versions
3. Check package.json for conflicts

#### ESLint errors
**Problem**: "Unexpected token" or lint errors

**Solutions**:
```bash
# Fix auto-fixable errors
npm run lint -- --fix

# Or manually fix
npm run lint
```

---

### Deployment Issues

#### Build fails
**Problem**: `npm run build` fails

**Solutions**:
1. Check for TypeScript errors: `npm run type-check`
2. Check for lint errors: `npm run lint`
3. Clear .next: `rm -rf .next`
4. Retry build

#### Environment variables not working
**Problem**: Variables are undefined in production

**Solutions**:
1. Prefix with `NEXT_PUBLIC_` for client-side
2. Check .env.production exists
3. Redeploy after changing env vars
4. Verify variables are set in deployment platform

#### Docker build fails
**Problem**: Docker build errors

**Solutions**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker build -t qr-market-fe .

# Run
docker run -p 3000:3000 qr-market-fe
```

---

### Browser-Specific Issues

#### Chrome console errors
1. Open DevTools: F12
2. Check Console tab
3. Look for CORS, fetch, or parsing errors

#### Firefox not working
1. Check cookies are enabled
2. Verify HTTPS/HTTP consistency
3. Check About:Config settings

#### Safari cookies not working
1. Check privacy settings
2. May need to adjust SameSite attribute
3. Test in private window

---

### Database Connection Issues

#### Backend can't connect to database
**Problem**: Backend starts but API returns 500

**Solutions** (Backend):
1. Check database credentials
2. Verify database is running
3. Check connection string
4. Look at server logs

---

### Quick Debug Checklist

Use this when something breaks:

- [ ] Restart dev server: `npm run dev`
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Check console for errors: F12
- [ ] Verify backend is running: `curl http://localhost:3002/health-check`
- [ ] Check network requests: DevTools → Network
- [ ] Verify environment variables: Check .env.local
- [ ] Check TypeScript errors: `npm run type-check`
- [ ] Check lint errors: `npm run lint`
- [ ] Test with clean install: `rm -rf node_modules && npm install`

---

### Getting Help

If still stuck:

1. **Check Documentation**:
   - README.md
   - QUICKSTART.md
   - API_DOCUMENTATION.md

2. **Check Console Errors**:
   - Browser: F12 → Console
   - Terminal: Check npm run dev output

3. **Check Log Files**:
   - Backend server logs
   - Network tab in DevTools

4. **Reproduce Issue**:
   - Close and reopen
   - Restart server
   - Clear all caches

5. **Search Online**:
   - Error message on Google
   - Stack Overflow
   - GitHub Issues

6. **Ask for Help**:
   - Include error message
   - Include reproduction steps
   - Include environment info (Node version, OS)
   - Include console logs

---

**Last Updated**: January 2026
**Version**: 1.0.0
