// Environment configuration for Roboflow API
// WARNING: In production, this API key should be kept secure and not exposed in client-side code
// Consider using environment variables or server-side proxy for production deployment
export const ROBOFLOW_CONFIG = {
  API_KEY: "JLf1y3aRLU4534yqENlb",
  MODEL_URL: "https://serverless.roboflow.com/rice-pest-jmdev/1",
  TIMEOUT: 30000, // 30 seconds
} as const;
