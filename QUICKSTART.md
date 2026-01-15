# Quick Start Guide

Get the SmartLens OCR frontend up and running in minutes.

## 5-Minute Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

The `.env.local` file should contain:
```env
BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: http://localhost:3000

Done! The frontend is now running and will proxy all API calls to the backend.

---

## What You Get

### Local Development (http://localhost:3000)
- Live code reloading
- Full debugging capabilities
- Next.js development optimizations

### API Proxy
- `/api/users` → Backend `/api/users`
- `/api/detect-regions` → Backend `/api/detect-regions`
- `/api/extract-text` → Backend `/api/extract-text`
- `/api/users/[id]/credits` → Backend `/api/users/[id]/credits`

### Authentication
- Login with email
- Credits system
- Pricing modal

### Features
- Image upload and analysis
- Text region detection via Gemini Vision
- Text extraction from regions via Gemini OCR
- User credit management

---

## Build & Production

### Build Optimized Production Bundle
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

The app will be available at http://localhost:3000

---

## Docker

### Build Docker Image
```bash
docker build -f frontend.Dockerfile -t smartlensocr-frontend .
```

### Run in Docker
```bash
docker run \
  -p 3000:3000 \
  -e BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app \
  smartlensocr-frontend
```

### Using Docker Compose
```bash
docker-compose up
```

---

## Deployment to Google Cloud Run

### 1. Create a GCP Project
```bash
gcloud projects create smartlens-ocr
gcloud config set project smartlens-ocr
```

### 2. Build & Push to Artifact Registry
```bash
# Create registry
gcloud artifacts repositories create smartlens \
  --repository-format=docker \
  --location=us-west1

# Build and push
gcloud builds submit \
  --tag us-west1-docker.pkg.dev/smartlens-ocr/smartlens/frontend:latest \
  -f frontend.Dockerfile
```

### 3. Deploy to Cloud Run
```bash
gcloud run deploy smartlensocr-frontend \
  --image us-west1-docker.pkg.dev/smartlens-ocr/smartlens/frontend:latest \
  --platform managed \
  --region us-west1 \
  --port 3000 \
  --memory 512Mi \
  --allow-unauthenticated \
  --set-env-vars BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

Your frontend is now live! The command output will show your service URL.

---

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Backend Connection Error
Check that:
1. `BACKEND_URL` in `.env.local` is correct
2. Backend service is running and accessible
3. No CORS issues (the proxy handles this)

### Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Rebuild
docker build -f frontend.Dockerfile -t smartlensocr-frontend .
```

### Cloud Run Deployment Issues
```bash
# Check logs
gcloud run services logs read smartlensocr-frontend --region us-west1

# Verify environment variables
gcloud run services describe smartlensocr-frontend --region us-west1
```

---

## Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `BACKEND_URL` | https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app | Backend service URL |
| `NODE_ENV` | development | Node environment mode |
| `NEXT_TELEMETRY_DISABLED` | 1 | Disable Next.js telemetry |

---

## Project Structure

```
src/
├── app/
│   ├── api/                    # API proxy routes
│   ├── components/             # React components
│   ├── page.tsx               # Main page
│   └── layout.tsx             # Root layout
└── lib/
    ├── types.ts               # TypeScript definitions
    └── geminiService.ts       # Service layer
```

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Key Features

### 1. Automatic API Proxy
- All frontend requests go through Next.js API routes
- No direct backend calls from browser
- CORS issues resolved automatically

### 2. Environment Configuration
- Configurable backend URL
- Works in development, staging, and production
- Supports different backend endpoints

### 3. Type Safety
- Full TypeScript support
- Shared types between frontend and API routes
- IDE autocomplete for all API calls

### 4. Modern Stack
- React 19 with hooks
- Next.js App Router
- Tailwind CSS for styling
- Zero-config setup

---

## Next Steps

1. **Read the Docs**
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design overview
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
   - [README.md](./README.md) - Complete documentation

2. **Customize**
   - Update branding in components
   - Modify Tailwind theme
   - Add additional API routes

3. **Deploy**
   - Test locally
   - Build Docker image
   - Deploy to Cloud Run

---

## Support

For issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review logs: `gcloud run services logs read smartlensocr-frontend`
3. Verify backend connectivity
4. Check environment variables

---

Happy coding! 🚀
