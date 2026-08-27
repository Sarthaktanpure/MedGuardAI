export const BatchRegistryAbi = [
  {
    inputs: [
      { internalType: "bytes32", name: "batchKey", type: "bytes32" },
      { internalType: "bytes32", name: "metadataHash", type: "bytes32" }
    ],
    name: "registerBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "batchKey", type: "bytes32" }],
    name: "flagBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "batchKey", type: "bytes32" },
      { internalType: "bytes32", name: "metadataHash", type: "bytes32" }
    ],
    name: "verifyBatch",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "bool", name: "hashMatches", type: "bool" },
      { internalType: "bool", name: "flagged", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "batchKey", type: "bytes32" },
      { indexed: false, internalType: "bytes32", name: "metadataHash", type: "bytes32" }
    ],
    name: "BatchRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "batchKey", type: "bytes32" }
    ],
    name: "BatchFlagged",
    type: "event"
  }
] as const;

export const BatchRegistryAddress = "0x0000000000000000000000000000000000000000";

export type UserRole = "patient" | "company" | "pharmacist" | "deliveryman";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  displayName: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export type ScanVerdict = "genuine" | "suspect" | "fake";

export interface Scan {
  _id: string;
  userId: string;
  batchId?: string;
  imageObjectKey: string;
  imageMimeType: string;
  result: ScanVerdict;
  confidence: number; // 0 to 100
  camSummary?: string; // CAM coordinates or summary JSON string
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type ChainStatus = "pending" | "confirmed" | "failed";

export interface Batch {
  _id: string;
  batchKey: string;
  metadataHash: string;
  chainTxHash: string;
  chainStatus: ChainStatus;
  flagged: boolean;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export type ModelStatus = "active" | "inactive" | "training" | "failed";

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ModelVersion {
  _id: string;
  version: string;
  status: ModelStatus;
  metrics: ModelMetrics;
  artifactObjectKey: string;
  sourceEvalReport?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSnapshot {
  _id: string;
  timestamp: string;
  scansCount: number;
  genuineCount: number;
  suspectCount: number;
  fakeCount: number;
  batchesRegistered: number;
  flaggedBatchesCount: number;
}

export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

