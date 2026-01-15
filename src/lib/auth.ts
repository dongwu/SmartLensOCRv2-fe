'use server';

import { GoogleAuth } from 'google-auth-library';

// Initialize Auth Client once and reuse (do this outside to avoid recreating)
const auth = new GoogleAuth();

/**
 * Create an authenticated HTTP client for calling Cloud Run services
 * This client automatically handles OIDC token generation and adds Authorization headers
 * 
 * Usage:
 *   const client = await getAuthClient(BACKEND_URL);
 *   const response = await client.request({
 *     url: `${BACKEND_URL}/api/endpoint`,
 *     method: 'POST',
 *     data: { ... }
 *   });
 */
export async function getAuthClient(targetUrl: string) {
  try {
    const client = await auth.getIdTokenClient(targetUrl);
    return client;
  } catch (error) {
    console.error('[Auth] Failed to create authenticated client:', error);
    throw new Error('Failed to authenticate with backend service');
  }
}

/**
 * Make an authenticated request to a Cloud Run service
 * Handles OIDC token generation automatically
 */
export async function authenticatedFetch(
  url: string,
  options: { method?: string; data?: any } = {}
) {
  try {
    const client = await getAuthClient(url);
    return await client.request({
      url,
      method: options.method || 'GET',
      data: options.data,
    });
  } catch (error) {
    console.error('[Auth] Authenticated request failed:', error);
    throw error;
  }
}
