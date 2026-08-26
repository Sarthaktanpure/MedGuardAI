// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BatchRegistry {
    struct BatchRecord {
        bytes32 metadataHash;
        bool exists;
        bool flagged;
    }

    mapping(bytes32 => BatchRecord) private batches;

    event BatchRegistered(bytes32 indexed batchKey, bytes32 metadataHash);
    event BatchFlagged(bytes32 indexed batchKey);

    function registerBatch(bytes32 batchKey, bytes32 metadataHash) external {
        require(!batches[batchKey].exists, "BATCH_ALREADY_EXISTS");
        batches[batchKey] = BatchRecord({
            metadataHash: metadataHash,
            exists: true,
            flagged: false
        });
        emit BatchRegistered(batchKey, metadataHash);
    }

    function flagBatch(bytes32 batchKey) external {
        require(batches[batchKey].exists, "BATCH_DOES_NOT_EXIST");
        batches[batchKey].flagged = true;
        emit BatchFlagged(batchKey);
    }

    function verifyBatch(bytes32 batchKey, bytes32 metadataHash)
        external
        view
        returns (bool exists, bool hashMatches, bool flagged)
    {
        BatchRecord memory record = batches[batchKey];
        return (record.exists, record.metadataHash == metadataHash, record.flagged);
    }
}
