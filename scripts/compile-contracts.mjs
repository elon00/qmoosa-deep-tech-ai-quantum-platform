import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';

const rootDir = process.cwd();
const contractPath = path.join(rootDir, 'contracts', 'QMoosaQuantumSentinel.sol');
const artifactsDir = path.join(rootDir, 'contracts', 'artifacts');

if (!fs.existsSync(contractPath)) {
  console.error('Contract source not found at:', contractPath);
  process.exit(1);
}

const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'QMoosaQuantumSentinel.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

console.log('Compiling QMoosaQuantumSentinel.sol with solc...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  let hasFatal = false;
  for (const err of output.errors) {
    if (err.severity === 'error') {
      console.error(err.formattedMessage);
      hasFatal = true;
    } else {
      console.warn(err.formattedMessage);
    }
  }
  if (hasFatal) {
    console.error('Compilation failed with errors.');
    process.exit(1);
  }
}

const contract = output.contracts['QMoosaQuantumSentinel.sol']['QMoosaQuantumSentinel'];
const bytecode = contract.evm.bytecode.object;
const abi = contract.abi;

if (!bytecode || bytecode.length === 0) {
  console.error('Bytecode generation failed: empty bytecode');
  process.exit(1);
}

if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

const artifact = {
  contractName: 'QMoosaQuantumSentinel',
  sourceName: 'contracts/QMoosaQuantumSentinel.sol',
  abi,
  bytecode: '0x' + bytecode,
  deployedBytecode: '0x' + contract.evm.deployedBytecode.object,
  compiler: {
    version: solc.version()
  },
  updatedAt: new Date().toISOString()
};

const artifactPath = path.join(artifactsDir, 'QMoosaQuantumSentinel.json');
fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), 'utf8');

console.log('✅ Compilation successful!');
console.log(`  Artifact saved to: ${artifactPath}`);
console.log(`  Bytecode size: ${bytecode.length / 2} bytes`);
console.log(`  ABI methods: ${abi.length}`);
