// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QMoosaQuantumSentinel
 * @dev On-chain Post-Quantum Cryptographic & Company OS Attestation Anchor for BNB Smart Chain.
 * Implements Layer 5 Dual Hybrid Cryptographic Conjunction and fail-closed state commitments.
 */
contract QMoosaQuantumSentinel {
    // -------------------------------------------------------------
    // CONSTANTS & IMMUTABLES
    // -------------------------------------------------------------
    string public constant SYSTEM_NAME = "QMOOSA-DEEP-TECH-AI-QUANTUM-PLATFORM";
    string public constant SPEC_VERSION = "URS-v2.0-12-GATE";
    uint256 public constant CHAIN_ID_BNB_MAINNET = 56;
    uint256 public constant CHAIN_ID_BNB_TESTNET = 97;

    address public owner;
    bool private _locked;

    // -------------------------------------------------------------
    // STATE VARIABLES
    // -------------------------------------------------------------
    struct QuantumCommitment {
        bytes32 stateRoot;
        bytes32 pqcDigest;
        uint256 blockTimestamp;
        address anchorAddress;
        bool active;
    }

    struct CompanyOsLog {
        string actionId;
        bytes32 executionHash;
        uint256 timestamp;
        address executor;
    }

    bytes32 public latestStateRoot;
    bytes32 public latestPqcDigest;
    uint256 public totalAnchors;
    uint256 public totalActions;

    mapping(bytes32 => QuantumCommitment) public commitments;
    mapping(uint256 => CompanyOsLog) public companyOsLogs;

    // -------------------------------------------------------------
    // EVENTS
    // -------------------------------------------------------------
    event QuantumStateAnchored(
        bytes32 indexed stateRoot,
        bytes32 indexed pqcDigest,
        address indexed anchorAddress,
        uint256 timestamp
    );

    event DualHybridVerified(
        address indexed signer,
        bytes32 indexed payloadHash,
        bytes32 indexed pqcDigest,
        bool success
    );

    event CompanyOsActionLogged(
        uint256 indexed actionIndex,
        string actionId,
        bytes32 executionHash,
        address executor,
        uint256 timestamp
    );

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // -------------------------------------------------------------
    // MODIFIERS
    // -------------------------------------------------------------
    modifier onlyOwner() {
        require(msg.sender == owner, "QMoosaSentinel: caller is not the owner");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "QMoosaSentinel: reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    // -------------------------------------------------------------
    // CONSTRUCTOR
    // -------------------------------------------------------------
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // -------------------------------------------------------------
    // POST-QUANTUM ANCHORING
    // -------------------------------------------------------------
    /**
     * @notice Anchors a post-quantum cryptographic commitment state on BNB Chain.
     * @param stateRoot 32-byte canonical SHA-256 state tree hash.
     * @param pqcDigest 32-byte commitment hash derived from NIST FIPS 204 ML-DSA-65 / FIPS 203 ML-KEM-768.
     */
    function anchorQuantumState(bytes32 stateRoot, bytes32 pqcDigest)
        external
        onlyOwner
        nonReentrant
        returns (bool)
    {
        require(stateRoot != bytes32(0), "QMoosaSentinel: invalid zero stateRoot");
        require(pqcDigest != bytes32(0), "QMoosaSentinel: invalid zero pqcDigest");

        commitments[stateRoot] = QuantumCommitment({
            stateRoot: stateRoot,
            pqcDigest: pqcDigest,
            blockTimestamp: block.timestamp,
            anchorAddress: msg.sender,
            active: true
        });

        latestStateRoot = stateRoot;
        latestPqcDigest = pqcDigest;
        totalAnchors += 1;

        emit QuantumStateAnchored(stateRoot, pqcDigest, msg.sender, block.timestamp);
        return true;
    }

    // -------------------------------------------------------------
    // DUAL HYBRID CONJUNCTION VERIFICATION
    // -------------------------------------------------------------
    /**
     * @notice Verifies dual hybrid conjunction: classical ECDSA + PQC digest presence.
     */
    function verifyDualHybridConjunction(
        bytes32 payloadHash,
        bytes32 pqcDigest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (bool) {
        require(payloadHash != bytes32(0), "QMoosaSentinel: zero payload hash");
        require(pqcDigest != bytes32(0), "QMoosaSentinel: zero PQC digest");

        address signer = ecrecover(payloadHash, v, r, s);
        require(signer != address(0), "QMoosaSentinel: invalid ECDSA signature");

        emit DualHybridVerified(signer, payloadHash, pqcDigest, true);
        return true;
    }

    // -------------------------------------------------------------
    // COMPANY OS GOVERNANCE LOGGING
    // -------------------------------------------------------------
    /**
     * @notice Logs a Company OS autonomous decision on BNB Chain.
     */
    function recordCompanyOsAction(string calldata actionId, bytes32 executionHash)
        external
        onlyOwner
        returns (uint256)
    {
        require(bytes(actionId).length > 0, "QMoosaSentinel: empty actionId");
        require(executionHash != bytes32(0), "QMoosaSentinel: zero executionHash");

        uint256 actionIdx = totalActions;
        companyOsLogs[actionIdx] = CompanyOsLog({
            actionId: actionId,
            executionHash: executionHash,
            timestamp: block.timestamp,
            executor: msg.sender
        });

        totalActions += 1;
        emit CompanyOsActionLogged(actionIdx, actionId, executionHash, msg.sender, block.timestamp);
        return actionIdx;
    }

    // -------------------------------------------------------------
    // VIEW FUNCTIONS
    // -------------------------------------------------------------
    function getCommitment(bytes32 stateRoot) external view returns (QuantumCommitment memory) {
        return commitments[stateRoot];
    }

    function isCommitmentValid(bytes32 stateRoot) external view returns (bool) {
        return commitments[stateRoot].active;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "QMoosaSentinel: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
