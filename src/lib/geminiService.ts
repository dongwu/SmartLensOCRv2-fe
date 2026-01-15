import { TextRegion } from "./types";

/**
 * SERVICE LAYER - Frontend API Proxy
 * 
 * This service communicates with the Next.js API routes.
 * The API routes proxy requests to the backend.
 */

/**
 * Phase 1: Layout Analysis via API
 * Sends image to API which proxies to backend for Gemini Vision API processing
 */
export const detectRegions = async (base64Image: string): Promise<TextRegion[]> => {
  try {
    console.log('[GeminiService] detectRegions request to: /api/detect-regions');
    const response = await fetch('/api/detect-regions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: base64Image,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to detect regions");
    }

    const data = await response.json();
    return data.regions;
  } catch (error: any) {
    console.error("Error detecting regions:", error);
    throw error;
  }
};

/**
 * Phase 2: High-Precision OCR via API
 * Sends image and regions to API which proxies to backend for Gemini OCR API processing
 */
export const extractTextFromRegions = async (
  base64Image: string,
  regions: TextRegion[]
): Promise<string> => {
  // Filter active regions and sort by order
  const activeRegions = [...regions]
    .filter((r) => r.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeRegions.length === 0) return "";

  try {
    const response = await fetch('/api/extract-text', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: base64Image,
        regions: activeRegions,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to extract text");
    }

    const data = await response.json();
    return data.extractedText;
  } catch (error: any) {
    console.error("Error extracting text:", error);
    throw error;
  }
};
