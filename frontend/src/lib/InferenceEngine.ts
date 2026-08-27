export interface InferenceResult {
  verdict: "genuine" | "suspect" | "fake";
  confidence: number;
  camSummary: string; // JSON string with hotspot coordinate details
  inferenceTimeMs: number;
}

export class InferenceEngine {
  private static instance: InferenceEngine;
  private isLoaded: boolean = false;

  private constructor() {}

  public static getInstance(): InferenceEngine {
    if (!InferenceEngine.instance) {
      InferenceEngine.instance = new InferenceEngine();
    }
    return InferenceEngine.instance;
  }

  public async loadModel(): Promise<void> {
    if (this.isLoaded) return;
    
    // Simulate loading onnxruntime-web model (e.g. resnet50.onnx)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.isLoaded = true;
    console.log("ONNX Model loaded successfully client-side.");
  }

  public async runInference(
    fileOrVideo: File | HTMLVideoElement | HTMLImageElement,
    batchKey?: string
  ): Promise<InferenceResult> {
    await this.loadModel();

    // Simulate inference computation time (e.g., 800ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determinstic results for specific demo batch numbers
    if (batchKey) {
      const cleanKey = batchKey.trim().toUpperCase();
      if (cleanKey.includes("0041A") || cleanKey.endsWith("41A")) {
        return {
          verdict: "genuine",
          confidence: 96.8,
          camSummary: JSON.stringify({
            hotspotCount: 0,
            averageLoss: 0.02,
            heatmapGrid: [],
          }),
          inferenceTimeMs: 420,
        };
      }
      if (cleanKey.includes("0012B") || cleanKey.endsWith("12B")) {
        return {
          verdict: "fake",
          confidence: 89.2,
          camSummary: JSON.stringify({
            hotspotCount: 4,
            averageLoss: 0.76,
            heatmapGrid: [
              [35, 45],
              [40, 50],
              [55, 30],
              [60, 65],
            ],
          }),
          inferenceTimeMs: 480,
        };
      }
      if (cleanKey.includes("0033H") || cleanKey.endsWith("33H")) {
        return {
          verdict: "suspect",
          confidence: 72.4,
          camSummary: JSON.stringify({
            hotspotCount: 2,
            averageLoss: 0.45,
            heatmapGrid: [
              [20, 30],
              [65, 70],
            ],
          }),
          inferenceTimeMs: 450,
        };
      }

      // Check online backend registry if network is available
      try {
        const response = await fetch(`/api/v1/batches/${cleanKey}`);
        if (response.ok) {
          const batchData = await response.json();
          if (batchData && !batchData.flagged && batchData.chainStatus === "confirmed") {
            return {
              verdict: "genuine",
              confidence: 94.5,
              camSummary: JSON.stringify({ hotspotCount: 0, averageLoss: 0.03, heatmapGrid: [] }),
              inferenceTimeMs: 390,
            };
          }
        }
      } catch (error) {
        console.warn("Backend lookup failed, falling back to strict classification", error);
      }
    }

    // Default strict fallback: any random / unverified scan is fake or suspect
    const rand = Math.random();
    if (rand < 0.2) {
      return {
        verdict: "suspect",
        confidence: 65.2,
        camSummary: JSON.stringify({
          hotspotCount: 2,
          averageLoss: 0.45,
          heatmapGrid: [[20, 30], [65, 70]],
        }),
        inferenceTimeMs: 420,
      };
    } else {
      return {
        verdict: "fake",
        confidence: 88.5,
        camSummary: JSON.stringify({
          hotspotCount: 4,
          averageLoss: 0.78,
          heatmapGrid: [[35, 45], [40, 50], [55, 30], [60, 65]],
        }),
        inferenceTimeMs: 450,
      };
    }
  }
}
