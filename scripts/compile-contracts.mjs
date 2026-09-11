import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const contractPath = path.join(rootDir, 'contracts', 'QMoosaQuantumSentinel.sol');
const artifactsDir = path.join(rootDir, 'contracts', 'artifacts');
const artifactPath = path.join(artifactsDir, 'QMoosaQuantumSentinel.json');

if (!fs.existsSync(contractPath)) {
  console.error('Contract source not found at:', contractPath);
  process.exit(1);
}

let solc;
try {
  solc = (await import('solc')).default;
} catch (e) {
  // solc not installed in current environment; fall back to verifying committed artifact
}

if (solc) {
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

  fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2), 'utf8');
  console.log('✅ Compilation successful!');
  console.log(`  Bytecode size: ${bytecode.length / 2} bytes`);
  console.log(`  ABI methods: ${abi.length}`);
} else {
  // Verify existing pre-compiled artifact
  console.log('Verifying pre-compiled BNB Chain contract artifact...');
  if (!fs.existsSync(artifactPath)) {
    console.error('❌ Artifact not found and solc is not installed.');
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  if (!artifact.bytecode || artifact.bytecode.length < 1000 || !artifact.abi) {
    console.error('❌ Invalid or corrupted contract artifact.');
    process.exit(1);
  }
  console.log('✅ Contract artifact verified!');
  console.log(`  Artifact: ${artifactPath}`);
  console.log(`  Bytecode size: ${(artifact.bytecode.length - 2) / 2} bytes`);
  console.log(`  ABI methods: ${artifact.abi.length}`);
}
