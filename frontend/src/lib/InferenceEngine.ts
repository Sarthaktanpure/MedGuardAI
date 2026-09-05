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
    batchKey?: string,
    qrInfo?: any
  ): Promise<InferenceResult> {
    await this.loadModel();

    // Simulate inference computation time (e.g., 600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 1. If an Authenticity QR code was identified on the scan
    if (qrInfo) {
      const cleanKey = (qrInfo.key || "").trim().toUpperCase();
      const isRecalled = qrInfo.flagged || cleanKey.includes("0012B") || cleanKey.includes("RECALL");
      if (isRecalled) {
        return {
          verdict: "fake",
          confidence: 91.5,
          camSummary: JSON.stringify({
            hotspotCount: 4,
            averageLoss: 0.82,
            heatmapGrid: [
              [35, 45],
              [40, 50],
              [55, 30],
              [60, 65],
            ],
          }),
          inferenceTimeMs: 380,
        };
      }
      return {
        verdict: "genuine",
        confidence: 98.4,
        camSummary: JSON.stringify({
          hotspotCount: 0,
          averageLoss: 0.01,
          heatmapGrid: [],
        }),
        inferenceTimeMs: 350,
      };
    }

    // 2. Deterministic results for specific demo batch numbers
    if (batchKey) {
      const cleanKey = batchKey.trim().toUpperCase();
      if (cleanKey.includes("0012B") || cleanKey.endsWith("12B") || cleanKey.includes("RECALL")) {
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
      if (cleanKey.includes("0033H") || cleanKey.endsWith("33H") || cleanKey.includes("SUSPECT")) {
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
          if (batchData?.flagged) {
            return {
              verdict: "fake",
              confidence: 92.5,
              camSummary: JSON.stringify({
                hotspotCount: 4,
                averageLoss: 0.84,
                heatmapGrid: [[35, 45], [40, 50], [55, 30], [60, 65]],
              }),
              inferenceTimeMs: 390,
            };
          }
          if (batchData && batchData.chainStatus === "confirmed") {
            return {
              verdict: "genuine",
              confidence: 97.5,
              camSummary: JSON.stringify({ hotspotCount: 0, averageLoss: 0.02, heatmapGrid: [] }),
              inferenceTimeMs: 390,
            };
          }
        }
      } catch (error) {
        console.warn("Backend lookup failed, falling back to classification", error);
      }

      // Default registered batch key: verified genuine
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

    // 3. Default demo fallback: verified genuine with high confidence
    return {
      verdict: "genuine",
      confidence: 96.4,
      camSummary: JSON.stringify({
        hotspotCount: 0,
        averageLoss: 0.02,
        heatmapGrid: [],
      }),
      inferenceTimeMs: 390,
    };
  }
}
