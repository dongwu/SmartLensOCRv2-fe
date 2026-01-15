# SmartLens OCR - Next.js Frontend with API Proxy

A modern Next.js frontend application that serves as a proxy to the SmartLens OCR backend service. The frontend runs API routes that proxy requests to the backend, eliminating the need for direct client-to-backend communication.

## Architecture

```
User Browser
    ↓
Next.js Frontend Server (Port 3000)
    ├─ /api/users → proxies to backend /api/users
    ├─ /api/detect-regions → proxies to backend /api/detect-regions
    ├─ /api/extract-text → proxies to backend /api/extract-text
    └─ /api/users/[id]/credits → proxies to backend /api/users/:id/credits
    ↓
Backend (Google Cloud Run)
```

## Features

- **React 19** with Next.js App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **API Proxy Routes** - All backend calls go through Next.js API routes
- **Environment-based Configuration** - Backend URL configurable via `.env.local`
- **Production Ready** - Optimized Docker build with multi-stage compilation

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with your backend URL:
```bash
BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

Or for local backend development:
```bash
BACKEND_URL=http://localhost:8000
```

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Docker Deployment

Build and run with Docker:
```bash
docker build -f frontend.Dockerfile -t smartlensocr-frontend .
docker run -p 3000:3000 -e BACKEND_URL=https://your-backend-url smartlensocr-frontend
```

### Docker Compose

Run with docker-compose:
```bash
docker-compose up
```

### Google Cloud Run

1. Build the image:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/smartlensocr-frontend
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy smartlensocr-frontend \
  --image gcr.io/YOUR_PROJECT/smartlensocr-frontend \
  --platform managed \
  --port 3000 \
  --set-env-vars BACKEND_URL=https://your-backend-url
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API proxy routes
│   │   ├── detect-regions/
│   │   ├── extract-text/
│   │   ├── users/
│   │   │   └── [id]/credentials/
│   ├── components/       # React components
│   │   ├── PricingModal.tsx
│   │   └── RegionOverlay.tsx
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── lib/
│   ├── types.ts          # TypeScript types
│   └── geminiService.ts  # Service layer for API calls
```

## API Endpoints

### POST /api/users
Create or authenticate a user.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "credits": 10,
  "isPro": false
}
```

### POST /api/detect-regions
Detect text regions in an image.

**Request:**
```json
{
  "imageBase64": "base64-encoded-image"
}
```

**Response:**
```json
{
  "regions": [
    {
      "id": "region-1",
      "box": { "ymin": 10, "xmin": 10, "ymax": 100, "xmax": 200 },
      "order": 1,
      "description": "Header text",
      "isActive": true
    }
  ]
}
```

### POST /api/extract-text
Extract text from specified regions in an image.

**Request:**
```json
{
  "imageBase64": "base64-encoded-image",
  "regions": [
    {
      "id": "region-1",
      "box": { "ymin": 10, "xmin": 10, "ymax": 100, "xmax": 200 },
      "order": 1,
      "description": "Header",
      "isActive": true
    }
  ]
}
```

**Response:**
```json
{
  "extractedText": "Extracted text content"
}
```

### POST /api/users/[id]/credits
Update user credits.

**Request:**
```json
{
  "amount": 10
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "credits": 20,
  "isPro": false
}
```

## Environment Variables

- `BACKEND_URL` - URL of the backend server (default: `https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app`)
- `NODE_ENV` - Environment mode (development/production)

## Frontend to Backend Migration Path

### Phase 1: Current State
- Frontend calls proxy API routes
- API routes forward to backend
- Backend remains unchanged

### Phase 2: Future State (Recommended for Cloud Run)
- Frontend and backend deployed as single service within VPC
- Backend configures itself to only listen to internal requests
- API proxy routes maintain same interface for gradual migration

## Technologies Used

- **Next.js 15** - React framework with API routes
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Node.js 18** - Runtime

## License

Proprietary - SmartLens OCR
