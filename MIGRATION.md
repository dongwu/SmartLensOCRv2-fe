# Migration from Vite to Next.js - What Changed

This document explains the transformation from a Vite-based React frontend to a Next.js frontend with API proxy routes.

## Overview of Changes

### Before (Vite Setup)
```
Frontend (Vite) on localhost:5173
    ↓
Direct calls to Backend on Google Cloud Run
    ↓
CORS issues, exposing backend publicly
```

### After (Next.js Setup)
```
Frontend (Next.js) on localhost:3000
    ↓
API Proxy Routes (/api/*)
    ↓
Backend on Google Cloud Run (or internal)
    ↓
More secure, no CORS issues, flexible
```

## Key Changes

### 1. Build Tool
**Before:** Vite
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

**After:** Next.js
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 2. Project Structure
**Before:**
```
├── components/
│   ├── PricingModal.tsx
│   └── RegionOverlay.tsx
├── services/
│   └── geminiService.ts
├── App.tsx
├── index.tsx
└── vite.config.ts
```

**After:**
```
├── src/
│   ├── app/
│   │   ├── api/                    # NEW - API proxy routes
│   │   ├── components/
│   │   │   ├── PricingModal.tsx
│   │   │   └── RegionOverlay.tsx
│   │   ├── page.tsx               # NEW - Main page (was App.tsx)
│   │   └── layout.tsx             # NEW - Root layout
│   └── lib/
│       ├── types.ts
│       └── geminiService.ts
├── next.config.js                 # NEW
└── tailwind.config.js             # NEW
```

### 3. API Calls
**Before:** Direct to backend
```typescript
// geminiService.ts - DIRECT to backend
const response = await fetch(`${BACKEND_URL}/api/detect-regions`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ imageBase64 })
});
```

**After:** Through proxy
```typescript
// geminiService.ts - NOW through proxy
const response = await fetch('/api/detect-regions', {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ imageBase64 })
});

// API route that proxies: src/app/api/detect-regions/route.ts
// Internally calls: ${BACKEND_URL}/api/detect-regions
```

### 4. Imports
**Before:**
```typescript
import { TextRegion } from '../types';
import { detectRegions } from '../services/geminiService';
import RegionOverlay from '../components/RegionOverlay';
```

**After:**
```typescript
import { TextRegion } from '@/lib/types';
import { detectRegions } from '@/lib/geminiService';
import RegionOverlay from './components/RegionOverlay';
```

### 5. Components
**Before:** Default export, no 'use client'
```typescript
const App: React.FC = () => { ... };
export default App;
```

**After:** 'use client' directive for client components
```typescript
'use client';

const App: React.FC = () => { ... };
export default App;
```

### 6. Configuration
**Before:** `vite.config.ts`
```typescript
export default defineConfig(({ mode }) => ({
  server: { port: 5173, host: '0.0.0.0' },
  plugins: [react()]
}));
```

**After:** `next.config.js`
```typescript
const nextConfig = {
  reactStrictMode: true,
};
export default nextConfig;
```

### 7. Styling
**Before:** Tailwind through Vite
**After:** Tailwind with PostCSS
- Added `tailwind.config.js`
- Added `postcss.config.js`
- Added Tailwind to `src/app/globals.css`

## New Features Added

### API Proxy Routes
Created four new API endpoints:

1. **POST /api/users**
   - File: `src/app/api/users/route.ts`
   - Proxies to: `${BACKEND_URL}/api/users`

2. **POST /api/detect-regions**
   - File: `src/app/api/detect-regions/route.ts`
   - Proxies to: `${BACKEND_URL}/api/detect-regions`

3. **POST /api/extract-text**
   - File: `src/app/api/extract-text/route.ts`
   - Proxies to: `${BACKEND_URL}/api/extract-text`

4. **POST /api/users/[id]/credits**
   - File: `src/app/api/users/[id]/credits/route.ts`
   - Proxies to: `${BACKEND_URL}/api/users/:id/credits`

### Root Layout
New file: `src/app/layout.tsx`
```typescript
export const metadata: Metadata = {
  title: "Smart Lens OCR",
  description: "Premium Developer-Managed OCR Service",
};
```

### Global Styles
New file: `src/app/globals.css`
- Tailwind directives
- Root element styling

## Dependencies Changes

### Removed
- `vite` (build tool)
- `@vitejs/plugin-react` (React plugin)
- `@google/genai` (no longer needed in frontend)

### Added
- `next` (framework)
- `tailwindcss` (styling)
- `postcss` & `autoprefixer` (CSS processing)

## Environment Variables

### Before (Vite)
```env
VITE_API_URL=http://localhost:8000
```

### After (Next.js)
```env
BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

Note: Environment variables are now server-side by default in Next.js, providing better security.

## Docker Changes

### Before: Vite + Nginx
```dockerfile
# Stage 1: Build with Vite
FROM node:18-alpine AS builder
RUN npm run build  # Creates /dist

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### After: Next.js
```dockerfile
# Stage 1: Build with Next.js
FROM node:18-alpine AS builder
RUN npm run build  # Creates /.next

# Stage 2: Run Next.js
FROM node:18-alpine
COPY --from=builder /app/.next ./.next
CMD ["npm", "start"]
```

**Benefits:**
- Single node runtime (no nginx needed)
- Server-side rendering support
- API routes included in deployment
- Smaller final image

## Port Changes

| Component | Before | After |
|-----------|--------|-------|
| Frontend | 5173 | 3000 |
| Docker | 80 (nginx) | 3000 (next) |
| Cloud Run | Any (mapped) | 3000 |

## Breaking Changes for Backend

**The backend REMAINS UNCHANGED.** It continues to:
- Listen on its configured port
- Serve the same API endpoints
- Process requests identically

The only difference is that clients now connect to the frontend proxy instead of directly.

## Security Improvements

1. **Backend URL Hidden**
   - Frontend users cannot see backend URL
   - Backend URL only in server environment variables

2. **API Proxy Layer**
   - Can add authentication/authorization
   - Can rate limit per user
   - Can validate inputs

3. **CORS Resolved**
   - No client-side CORS headers needed
   - Server-to-server communication

## Performance Implications

### Improved
- ✅ Smaller JavaScript bundles (Next.js optimization)
- ✅ Server-side rendering possible
- ✅ API routes co-located with frontend

### Changed
- ⚠️ Additional network hop (frontend → backend)
  - Minimal impact: same as before + minimal proxy overhead
  - Can be optimized with caching

### Same
- Network latency to backend is identical

## Testing Changes

### Unit Tests
Next.js projects should use:
- Jest for component testing
- @testing-library/react for React testing

### E2E Tests
- Playwright or Cypress
- Test full proxy flow

### API Tests
Can now test API routes independently:
```typescript
// Example: test /api/detect-regions
import { POST } from '@/app/api/detect-regions/route';
```

## Migration Checklist

- ✅ Install Next.js dependencies
- ✅ Create src/app directory structure
- ✅ Create API routes
- ✅ Migrate components to src/app/components
- ✅ Create layout.tsx and globals.css
- ✅ Update imports (use @/ alias)
- ✅ Add 'use client' to client components
- ✅ Create configuration files (tailwind, postcss)
- ✅ Update Dockerfile
- ✅ Update docker-compose.yml
- ✅ Update environment variables
- ✅ Test locally
- ✅ Deploy to Cloud Run

## Troubleshooting Common Issues

### "Module not found"
Ensure import paths use `@/` alias:
```typescript
// ❌ Wrong
import { TextRegion } from '../lib/types';

// ✅ Correct
import { TextRegion } from '@/lib/types';
```

### "fetch failed"
Check:
1. Is BACKEND_URL correct in .env.local?
2. Is backend service running?
3. Check Cloud Run logs: `gcloud run services logs read`

### "404 for /api/detect-regions"
Ensure file exists: `src/app/api/detect-regions/route.ts`

### Build fails
Clear .next directory:
```bash
rm -rf .next
npm run build
```

## FAQ

**Q: Can I run the old Vite version alongside?**
A: Not recommended. The proxy layer replaces direct backend calls, so both can't coexist without conflicts.

**Q: Will the backend need changes?**
A: No. The backend API remains the same. Only the frontend communication method changed.

**Q: Can I use environment variables for backend URL?**
A: Yes. They're loaded from `BACKEND_URL` environment variable in `.env.local` or Cloud Run settings.

**Q: How do I switch back to Vite?**
A: The old code files are preserved (if not deleted). You can revert to using them, but the proxy approach is recommended.

**Q: Is this only for Google Cloud Run?**
A: No. Works on any hosting platform (Docker, traditional servers, etc.).

## Next Steps

1. **Test locally:**
   ```bash
   npm install
   npm run dev
   ```

2. **Build and test:**
   ```bash
   npm run build
   npm start
   ```

3. **Deploy:**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)

4. **Monitor:**
   - Check [ARCHITECTURE.md](./ARCHITECTURE.md) for monitoring setup

---

For detailed information, see:
- [QUICKSTART.md](./QUICKSTART.md) - Get running in 5 minutes
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
