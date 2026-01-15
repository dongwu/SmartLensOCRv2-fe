# Verification Checklist

Use this checklist to verify your Next.js conversion is complete and working correctly.

## ✅ Pre-Flight Checks

### File Structure
- [ ] `src/app/page.tsx` exists (main page)
- [ ] `src/app/layout.tsx` exists (root layout)
- [ ] `src/app/components/PricingModal.tsx` exists
- [ ] `src/app/components/RegionOverlay.tsx` exists
- [ ] `src/lib/types.ts` exists
- [ ] `src/lib/geminiService.ts` exists
- [ ] `src/app/globals.css` exists

### API Routes
- [ ] `src/app/api/users/route.ts` exists
- [ ] `src/app/api/detect-regions/route.ts` exists
- [ ] `src/app/api/extract-text/route.ts` exists
- [ ] `src/app/api/users/[id]/credits/route.ts` exists

### Configuration Files
- [ ] `next.config.js` exists
- [ ] `tailwind.config.js` exists
- [ ] `postcss.config.js` exists
- [ ] `tsconfig.json` updated
- [ ] `.env.local` exists with `BACKEND_URL`
- [ ] `package.json` updated with Next.js dependencies

### Docker & Deployment
- [ ] `frontend.Dockerfile` updated for Next.js
- [ ] `docker-compose.yml` updated
- [ ] `.gitignore` covers Next.js files

### Documentation
- [ ] `README.md` updated
- [ ] `QUICKSTART.md` created
- [ ] `ARCHITECTURE.md` created
- [ ] `DEPLOYMENT.md` created
- [ ] `MIGRATION.md` created
- [ ] `CONVERSION_SUMMARY.md` created

## ✅ Development Environment

### Installation
```bash
npm install
```
- [ ] No errors during installation
- [ ] `node_modules/` created
- [ ] `package-lock.json` updated

### Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Shows "Local: http://localhost:3000"
- [ ] Page loads at http://localhost:3000
- [ ] No 404 errors in console

### Functionality Test
- [ ] Login form displays
- [ ] Can enter email
- [ ] Network request shows in DevTools
- [ ] API call goes to `/api/users` (not backend directly)

### Hot Reload
- [ ] Edit `src/app/page.tsx` and save
- [ ] Page reloads automatically
- [ ] Changes appear in browser

## ✅ Build & Production

### Production Build
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No errors in build output
- [ ] `.next` directory created
- [ ] `.next/static` contains built files

### Production Server
```bash
npm start
```
- [ ] Server starts on port 3000
- [ ] Page loads at http://localhost:3000
- [ ] API calls work correctly
- [ ] No console errors

### Build Size
```bash
du -sh .next/
```
- [ ] `.next` directory is reasonably sized
- [ ] No unexpected large files

## ✅ API Proxy Testing

### Test Each Endpoint

**1. User Endpoint**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```
- [ ] Returns 200 or backend error (not 404)
- [ ] Response contains expected data or error message

**2. Detect Regions Endpoint**
```bash
curl -X POST http://localhost:3000/api/detect-regions \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"test"}'
```
- [ ] Returns 200 or backend error (not 404)
- [ ] Proxied to backend correctly

**3. Extract Text Endpoint**
```bash
curl -X POST http://localhost:3000/api/extract-text \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"test","regions":[]}'
```
- [ ] Returns 200 or backend error (not 404)
- [ ] Proxied to backend correctly

**4. Credits Endpoint**
```bash
curl -X POST http://localhost:3000/api/users/test-id/credits \
  -H "Content-Type: application/json" \
  -d '{"amount":10}'
```
- [ ] Returns 200 or backend error (not 404)
- [ ] Proxied to backend correctly

## ✅ Environment Configuration

### .env.local
- [ ] File exists at project root
- [ ] Contains `BACKEND_URL`
- [ ] URL is correct for your backend
- [ ] File is in `.gitignore`

### Environment Verification
```bash
npm run build
grep -r "BACKEND_URL" .next/
```
- [ ] Backend URL is NOT in built files
- [ ] Environment variable is server-side only

## ✅ Docker Build & Run

### Build Docker Image
```bash
docker build -f frontend.Dockerfile -t smartlensocr-frontend .
```
- [ ] Build completes successfully
- [ ] No errors
- [ ] Image is created

### Run Docker Container
```bash
docker run -p 3000:3000 \
  -e BACKEND_URL=https://your-backend-url \
  smartlensocr-frontend
```
- [ ] Container starts
- [ ] Can access http://localhost:3000
- [ ] API calls work correctly
- [ ] Backend connection successful

### Docker Compose
```bash
docker-compose up
```
- [ ] Service builds successfully
- [ ] Container starts without errors
- [ ] Application accessible
- [ ] No port conflicts

## ✅ TypeScript & Imports

### Check Imports
```bash
npm run build
```
- [ ] No TypeScript errors
- [ ] `@/lib/` imports work
- [ ] `@/app/` imports work
- [ ] All paths resolve correctly

### Type Checking
```bash
npx tsc --noEmit
```
- [ ] No type errors
- [ ] All imports are correct
- [ ] Types are properly defined

## ✅ Frontend Functionality

### User Interface
- [ ] Login page displays
- [ ] Input fields work
- [ ] Buttons are clickable
- [ ] Responsive design on mobile (resize browser)

### Image Upload
- [ ] Can select image file
- [ ] File loads successfully
- [ ] Base64 encoding works

### API Integration
- [ ] Login works (network call visible)
- [ ] Region detection works
- [ ] Text extraction works
- [ ] Credit updates work

### Navigation
- [ ] Tab switching works (mobile)
- [ ] Queue management works
- [ ] Canvas display works
- [ ] No 404 errors

## ✅ Deployment Readiness

### Cloud Run Prep
- [ ] Docker image builds successfully
- [ ] Container runs and responds
- [ ] Environment variables work
- [ ] Health checks pass

### GitHub/CI
- [ ] Code is committed
- [ ] `.gitignore` excludes proper files
- [ ] No credentials in code
- [ ] Ready for CI/CD

### DNS & Domain
- [ ] Custom domain ready (if applicable)
- [ ] SSL certificate ready (if applicable)
- [ ] DNS records configured (if applicable)

## ✅ Cleanup

### Remove Old Files (Optional)
- [ ] Vite config files archived/removed
- [ ] Old `vite.config.ts` backed up
- [ ] `index.html` in root can be removed
- [ ] `index.tsx` in root can be removed

### Optimize
- [ ] Removed unused dependencies
- [ ] Cleaned up comments
- [ ] Code follows project style
- [ ] No console logs (in production code)

## ✅ Documentation

### README
- [ ] Updated with Next.js info
- [ ] Installation instructions clear
- [ ] Development server commands correct
- [ ] Build commands correct

### QUICKSTART
- [ ] Follow steps and verify they work
- [ ] Test each command
- [ ] Verify expected results

### ARCHITECTURE
- [ ] Diagrams are clear
- [ ] Flows are accurate
- [ ] File structure documented
- [ ] API endpoints listed

### DEPLOYMENT
- [ ] Follow Cloud Run steps
- [ ] Test deployment
- [ ] Verify production setup
- [ ] Document any customizations

## ✅ Performance Check

### Bundle Size
```bash
npm run build
```
- [ ] Check `.next/static/` size
- [ ] Compare to original Vite build (should be similar or smaller)

### Load Time
- [ ] Open http://localhost:3000
- [ ] Check DevTools Network tab
- [ ] First contentful paint is fast
- [ ] No blocking resources

### Runtime Performance
- [ ] Upload image - no lag
- [ ] Region detection - responsive
- [ ] Text extraction - completes
- [ ] No memory leaks

## ✅ Security Review

### No Exposed Secrets
- [ ] Backend URL not in frontend code
- [ ] No API keys in JavaScript
- [ ] `.env.local` not committed
- [ ] All secrets server-side

### Error Handling
- [ ] Generic error messages in frontend
- [ ] No stack traces exposed
- [ ] Proper logging in API routes
- [ ] No sensitive data in logs

### CORS Handling
- [ ] API routes handle CORS
- [ ] Cross-origin requests work
- [ ] No CORS errors in console

## ✅ Browser Compatibility

Test on different browsers:
- [ ] Chrome/Edge - Works
- [ ] Firefox - Works
- [ ] Safari - Works
- [ ] Mobile browsers - Works

## ✅ Final Verification

### Complete Integration Test
1. [ ] npm install succeeds
2. [ ] npm run dev works
3. [ ] App loads at localhost:3000
4. [ ] Login form appears
5. [ ] Can enter email
6. [ ] Network request shows (not CORS error)
7. [ ] Request goes to /api/users
8. [ ] npm run build succeeds
9. [ ] npm start works
10. [ ] All API endpoints respond

### Production Checklist
1. [ ] Docker image builds
2. [ ] Docker container runs
3. [ ] Environment variables set
4. [ ] App works in container
5. [ ] Backend URL correct
6. [ ] Cloud Run deployment works
7. [ ] Service URL is accessible
8. [ ] API calls succeed
9. [ ] Monitoring/logging works
10. [ ] No errors in logs

## 🎉 You're Done!

If all checkboxes are checked, your Next.js conversion is complete and ready for production!

### Next Steps
1. Deploy to production using [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Monitor with Cloud Run logging
3. Set up CI/CD for future deployments
4. Plan Phase 2: Backend internal-only configuration

---

**Need Help?**
- See [QUICKSTART.md](./QUICKSTART.md) for common issues
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment errors
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system understanding
