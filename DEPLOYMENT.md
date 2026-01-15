# Deployment Guide

This guide covers deploying the SmartLens OCR frontend to Google Cloud Run.

## Local Development

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure `.env.local`:
```bash
BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
# Or for local backend:
# BACKEND_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

Access at http://localhost:3000

## Docker Build

### Build Locally

```bash
docker build -f frontend.Dockerfile -t smartlensocr-frontend:latest .
```

### Run Locally

```bash
docker run \
  -p 3000:3000 \
  -e BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app \
  smartlensocr-frontend:latest
```

## Google Cloud Run Deployment

### Prerequisites

- Google Cloud account with billing enabled
- `gcloud` CLI installed and configured
- Docker installed (for building images)

### Option 1: Using gcloud CLI with Dockerfile

1. **Set your GCP project:**
```bash
gcloud config set project YOUR_PROJECT_ID
```

2. **Build and push to Artifact Registry:**
```bash
# Create repository if it doesn't exist
gcloud artifacts repositories create smartlens \
  --repository-format=docker \
  --location=us-west1

# Build and push
gcloud builds submit \
  --tag us-west1-docker.pkg.dev/YOUR_PROJECT_ID/smartlens/frontend:latest \
  -f frontend.Dockerfile
```

3. **Deploy to Cloud Run:**
```bash
gcloud run deploy smartlensocr-frontend \
  --image us-west1-docker.pkg.dev/YOUR_PROJECT_ID/smartlens/frontend:latest \
  --platform managed \
  --region us-west1 \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated \
  --set-env-vars BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

### Option 2: Direct Deploy from GitHub

If your code is in GitHub:

```bash
gcloud run deploy smartlensocr-frontend \
  --source . \
  --region us-west1 \
  --platform managed \
  --set-env-vars BACKEND_URL=https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app
```

## Configuration

### Environment Variables

Set these environment variables in Cloud Run:

- `BACKEND_URL` - Backend service URL
- `NODE_ENV` - Set to `production`

Example:
```bash
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --update-env-vars BACKEND_URL=https://your-backend-url
```

## Verification

1. **Check deployment status:**
```bash
gcloud run services describe smartlensocr-frontend --region us-west1
```

2. **View logs:**
```bash
gcloud run services logs read smartlensocr-frontend --region us-west1 --limit 50
```

3. **Test the service:**
```bash
curl https://smartlensocr-frontend-XXXXX.run.app
```

## Troubleshooting

### Service not starting

Check logs:
```bash
gcloud run services logs read smartlensocr-frontend --region us-west1 --limit 100
```

### Backend connection errors

Ensure `BACKEND_URL` is correct and the backend service is accessible:
```bash
# Test connectivity
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --update-env-vars DEBUG=true
```

### Memory/CPU issues

Increase resources:
```bash
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --memory 1Gi \
  --cpu 2
```

## Scaling Configuration

Default Cloud Run settings:
- Min instances: 0 (auto-scale down)
- Max instances: 100 (auto-scale up)
- Memory: 512 MB
- CPU: 1

Adjust as needed based on traffic:
```bash
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --min-instances 1 \
  --max-instances 50 \
  --concurrency 80
```

## Custom Domain

1. Create DNS mapping:
```bash
gcloud run domain-mappings create \
  --service smartlensocr-frontend \
  --domain your-domain.com \
  --region us-west1
```

2. Follow DNS instructions in output

## Monitoring

1. **Set up alerts:**
```bash
gcloud monitoring policies create \
  --notification-channels CHANNEL_ID \
  --display-name "Frontend High Error Rate"
```

2. **View metrics in Cloud Console:**
   - Cloud Run → Select service → Metrics tab

## Security Best Practices

1. **Disable unauthenticated access if needed:**
```bash
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --no-allow-unauthenticated
```

2. **Use service account:**
```bash
gcloud run services update smartlensocr-frontend \
  --region us-west1 \
  --service-account smartlensocr@YOUR_PROJECT.iam.gserviceaccount.com
```

3. **Enable binary authorization (optional):**
```bash
gcloud run deploy smartlensocr-frontend \
  --region us-west1 \
  --require-dapr false
```

## Cost Optimization

- Use Cloud CDN for static assets
- Enable minimum instances = 0 to pay only for requests
- Use cheaper regions if available
- Monitor cold starts

## Rollback

To rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service smartlensocr-frontend --region us-west1

# Route traffic to specific revision
gcloud run services update-traffic smartlensocr-frontend \
  --region us-west1 \
  --to-revisions REVISION_ID=100
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

env:
  REGION: us-west1
  SERVICE: smartlensocr-frontend
  REGISTRY: us-west1-docker.pkg.dev

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      id-token: write
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Google Cloud Auth
        uses: google-github-actions/auth@v1
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
      
      - name: Build and Push
        run: |
          gcloud builds submit \
            --tag ${{ env.REGISTRY }}/${{ secrets.PROJECT_ID }}/smartlens/frontend:latest \
            -f frontend.Dockerfile
      
      - name: Deploy
        run: |
          gcloud run deploy ${{ env.SERVICE }} \
            --image ${{ env.REGISTRY }}/${{ secrets.PROJECT_ID }}/smartlens/frontend:latest \
            --region ${{ env.REGION }} \
            --set-env-vars BACKEND_URL=${{ secrets.BACKEND_URL }}
```

## Support

For issues or questions, refer to:
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
