# Roboflow Pest Detection Integration

This document explains how the Roboflow API integration works in the AgroPredict pest detection feature.

## Overview

The pest detection feature uses Roboflow's computer vision API to analyze images of plants and detect potential pest infestations. The integration is implemented in the `PestDetection.tsx` page.

## Files Structure

- `src/services/roboflowApi.ts` - Main API service for Roboflow integration
- `src/config/roboflow.ts` - Configuration file for API settings
- `src/pages/PestDetection.tsx` - UI component that uses the API

## API Configuration

The Roboflow API is configured in `src/config/roboflow.ts`:

```typescript
export const ROBOFLOW_CONFIG = {
  API_KEY: "JLf1y3aRLU4534yqENlb",
  MODEL_URL: "https://serverless.roboflow.com/rice-pest-jmdev/1",
  TIMEOUT: 30000, // 30 seconds
} as const;
```

## How It Works

1. **Image Capture**: Users can either:
   - Take a photo using their device camera
   - Upload an image file

2. **Image Processing**: The captured/uploaded image is converted to base64 format and sent to the Roboflow API

3. **API Analysis**: The Roboflow model analyzes the image and returns:
   - Detected pest types
   - Confidence scores (0-100%)
   - Bounding box coordinates
   - Severity classification

4. **Results Display**: The UI shows:
   - Top detection with severity warning
   - Detailed list of all detected pests
   - Action buttons for sharing and treatment guidance

## API Response Format

The Roboflow API returns predictions in this format:

```typescript
interface RoboflowPrediction {
  class: string;        // Pest name
  confidence: number;   // Confidence score (0-1)
  x: number;          // Bounding box X coordinate
  y: number;          // Bounding box Y coordinate
  width: number;      // Bounding box width
  height: number;     // Bounding box height
}
```

## Error Handling

The integration includes comprehensive error handling for:
- Network connectivity issues
- API rate limiting
- Invalid image formats
- Server errors
- Timeout scenarios

## Usage Example

```typescript
import { detectPest } from '@/services/roboflowApi';

// Analyze an image
const results = await detectPest(imageBase64String);
console.log(results); // Array of PestDetectionResult objects
```

## Security Notes

- The API key is currently hardcoded in the configuration file
- For production deployment, consider using environment variables
- The API key should be kept secure and not exposed in client-side code

## Future Enhancements

- Add image preprocessing for better detection accuracy
- Implement caching for repeated analysis of similar images
- Add support for batch image processing
- Integrate with weather data for enhanced pest prediction
