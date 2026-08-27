import crypto from "crypto";
import { BlockModel } from "../models/block.model.js";

const DIFFICULTY = 2; // Leading zeros needed for proof-of-work

export interface BlockData {
  type: "BATCH_REGISTRATION" | "TRANSIT_CHECK_IN" | "BATCH_RECALL";
  payload: Record<string, any>;
  signature?: string;
}

export function calculateHash(
  index: number,
  previousHash: string,
  timestamp: string,
  data: any,
  nonce: number
): string {
  const dataString = typeof data === "string" ? data : JSON.stringify(data);
  return crypto
    .createHash("sha256")
    .update(index + previousHash + timestamp + dataString + nonce)
    .digest("hex");
}

export async function getLatestBlock() {
  return BlockModel.findOne().sort({ index: -1 });
}

export async function addBlock(data: BlockData) {
  // Ensure we have a genesis block if empty
  let latestBlock = await getLatestBlock();
  if (!latestBlock) {
    latestBlock = await createGenesisBlock();
  }

  const index = latestBlock.index + 1;
  const previousHash = latestBlock.hash;
  const timestamp = new Date().toISOString();
  
  // Proof of work mining
  let nonce = 0;
  let hash = calculateHash(index, previousHash, timestamp, data, nonce);
  const targetPrefix = "0".repeat(DIFFICULTY);
  
  while (!hash.startsWith(targetPrefix)) {
    nonce++;
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  const newBlock = await BlockModel.create({
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce
  });

  console.log(`⛏️ Mined Block #${index} with hash: ${hash}`);
  return newBlock;
}

async function createGenesisBlock() {
  const index = 0;
  const timestamp = new Date("2026-08-27T00:00:00Z").toISOString();
  const data: BlockData = {
    type: "BATCH_REGISTRATION",
    payload: { info: "MedGuard Ledger Genesis Block" }
  };
  const previousHash = "0".repeat(64);
  const nonce = 0;
  const hash = calculateHash(index, previousHash, timestamp, data, nonce);

  return BlockModel.create({
    index,
    timestamp,
    data,
    previousHash,
    hash,
    nonce
  });
}

export async function verifyChain(): Promise<boolean> {
  const blocks = await BlockModel.find().sort({ index: 1 });
  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const previous = blocks[i - 1];

    // Check if the current block's hash matches calculated hash
    const recalculatedHash = calculateHash(
      current.index,
      current.previousHash,
      current.timestamp,
      current.data,
      current.nonce
    );

    if (current.hash !== recalculatedHash) {
      console.error(`Blockchain Error: Hash mismatch at block #${current.index}`);
      return false;
    }

    // Check if previousHash link is correct
    if (current.previousHash !== previous.hash) {
      console.error(`Blockchain Error: PrevHash link broken at block #${current.index}`);
      return false;
    }
  }
  return true;
}
