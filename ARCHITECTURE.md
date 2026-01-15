# Architecture Overview

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                   (localhost:3000)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Next.js Frontend Application                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React Components                                     │   │
│  │ - App (Main page)                                   │   │
│  │ - PricingModal                                      │   │
│  │ - RegionOverlay                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes (Proxy Layer)                            │   │
│  │ - POST /api/users                                   │   │
│  │ - POST /api/detect-regions                          │   │
│  │ - POST /api/extract-text                            │   │
│  │ - POST /api/users/[id]/credits                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Service Layer (geminiService.ts)                    │   │
│  │ - detectRegions()                                   │   │
│  │ - extractTextFromRegions()                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
         Environment: BACKEND_URL
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        Backend Service (Google Cloud Run)                   │
│   https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app        │
│                                                              │
│ - User Management                                           │
│ - Gemini Vision API (Region Detection)                      │
│ - Gemini OCR API (Text Extraction)                          │
│ - Credit System                                             │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. User Login Flow

```
User Input (Email)
    ↓
handleLogin() in App
    ↓
fetch('/api/users', { method: 'POST', body: { email } })
    ↓
Next.js API Route: src/app/api/users/route.ts
    ↓
Fetch Backend: ${BACKEND_URL}/api/users
    ↓
Backend Response
    ↓
Store in localStorage
```

### 2. Image Analysis Flow

```
File Upload
    ↓
FileReader → Base64 Image
    ↓
handleFileUpload()
    ↓
detectRegions(base64Image)
    ↓
fetch('/api/detect-regions', { body: { imageBase64 } })
    ↓
Next.js API Route: src/app/api/detect-regions/route.ts
    ↓
Fetch Backend: ${BACKEND_URL}/api/detect-regions
    ↓
Backend (Gemini Vision API)
    ↓
Return Regions
    ↓
Display on Canvas with RegionOverlay
```

### 3. Text Extraction Flow

```
User Clicks "Execute Pro Scan"
    ↓
handleExtractWithCredits()
    ↓
extractTextFromRegions(base64Image, regions)
    ↓
fetch('/api/extract-text', { body: { imageBase64, regions } })
    ↓
Next.js API Route: src/app/api/extract-text/route.ts
    ↓
Fetch Backend: ${BACKEND_URL}/api/extract-text
    ↓
Backend (Gemini OCR API)
    ↓
Return Extracted Text
    ↓
updateCredits(-1)
    ↓
Display Result
```

## File Structure

```
SmartLensOCRv2-fe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   ├── route.ts              # POST user creation/auth
│   │   │   │   └── [id]/
│   │   │   │       └── credits/
│   │   │   │           └── route.ts      # POST credit updates
│   │   │   ├── detect-regions/
│   │   │   │   └── route.ts              # POST region detection
│   │   │   └── extract-text/
│   │   │       └── route.ts              # POST text extraction
│   │   ├── components/
│   │   │   ├── PricingModal.tsx          # Pricing UI component
│   │   │   └── RegionOverlay.tsx         # Region visualization
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Main app page
│   │   └── globals.css                   # Global styles
│   └── lib/
│       ├── types.ts                      # TypeScript definitions
│       └── geminiService.ts              # Service layer
├── frontend.Dockerfile                  # Docker build config
├── docker-compose.yml                   # Docker compose config
├── next.config.js                       # Next.js config
├── tailwind.config.js                   # Tailwind CSS config
├── postcss.config.js                    # PostCSS config
├── tsconfig.json                        # TypeScript config
├── package.json                         # Dependencies
├── .env.local                           # Environment variables
├── .env.example                         # Environment template
├── README.md                            # Project documentation
└── DEPLOYMENT.md                        # Deployment guide
```

## Technology Stack

### Frontend Framework
- **Next.js 15** - React framework with API routes
- **React 19** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation

### Build & Runtime
- **Node.js 18** - JavaScript runtime
- **npm** - Package manager

### Deployment
- **Docker** - Containerization
- **Google Cloud Run** - Serverless platform
- **Artifact Registry** - Container registry

## API Proxy Layer

The Next.js API routes act as a transparent proxy between the frontend and backend:

### Benefits
1. **CORS Handling** - No CORS issues between frontend and backend
2. **Security** - Backend can be internal only (no public access)
3. **Flexibility** - Can add middleware (auth, logging, rate limiting)
4. **Future-proof** - Easy to add server-side logic
5. **Type Safety** - Shared TypeScript types

### How It Works

Each API route:
1. Receives request from frontend
2. Validates input
3. Forwards to backend with same structure
4. Handles error responses
5. Returns data back to frontend

Example:
```typescript
// Frontend calls
fetch('/api/detect-regions', { body: { imageBase64 } })

// Next.js API route forwards to
fetch(`${BACKEND_URL}/api/detect-regions`, { body: { imageBase64 } })

// Backend processes and responds
// Response passes through to frontend
```

## Environment Configuration

### Development
```env
BACKEND_URL=http://localhost:8000
NODE_ENV=development
```

### Staging
```env
BACKEND_URL=https://backend-staging.example.com
NODE_ENV=production
```

### Production
```env
BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
NODE_ENV=production
```

## State Management

### Application State
Uses React hooks for state management:
- `user` - Current authenticated user
- `appState` - UI state (IDLE, UPLOADING, DETECTING, etc.)
- `regions` - Detected text regions
- `image` - Current image base64
- `finalText` - Extracted text result

### Persistence
- `localStorage` - Stores user data for session persistence

## Security Considerations

1. **API Proxy** - Backend doesn't receive direct client requests
2. **Environment Variables** - Backend URL managed server-side
3. **HTTPS Only** - Production uses HTTPS
4. **No Sensitive Data in Frontend** - API keys stay server-side
5. **Error Handling** - Generic error messages in production

## Performance Optimizations

1. **Image Compression** - Uses FileReader for optimized base64
2. **Lazy Loading** - Components load on demand
3. **CSS Optimization** - Tailwind CSS purges unused styles
4. **Docker Multi-stage** - Optimized production builds
5. **Next.js Optimization** - Automatic code splitting

## Scalability

### Horizontal Scaling
- Cloud Run auto-scales based on traffic
- Stateless design allows unlimited replicas
- No shared state between instances

### Vertical Scaling
- Adjust CPU/Memory in Cloud Run
- Database connections pooled at backend

## Monitoring & Logging

### Cloud Run Built-in
- Request logs
- Error tracking
- Performance metrics
- Uptime monitoring

### Custom Logging
- Console logs captured by Cloud Run
- Search logs in Cloud Logging

## Disaster Recovery

### Backup & Recovery
1. Frontend is stateless - no data loss risk
2. User data stored in backend database
3. Images processed in real-time - not stored
4. Daily backups of backend recommended

### Failover Strategy
- Multiple backend instances recommended
- Cloud Run handles load balancing
- No session affinity required

## Future Enhancements

1. **Caching** - Add Redis for frequently accessed data
2. **Rate Limiting** - Implement per-user rate limits
3. **Analytics** - Track usage patterns
4. **Webhooks** - Support async processing
5. **WebSocket** - Real-time updates
6. **PWA** - Progressive web app support
