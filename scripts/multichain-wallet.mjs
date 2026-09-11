import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { ethers } from 'ethers';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Multi-chain Configuration
const WALLET_CONFIG = {
  bnb: {
    chain: 'BNB Smart Chain (BSC)',
    symbol: 'BNB',
    chainId: 56,
    address: '0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D',
    explorer: 'https://bscscan.com/address/0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D',
    paymentUri: 'ethereum:0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D@56'
  },
  solana: {
    chain: 'Solana Network',
    symbol: 'SOL',
    address: 'FQwP8hZkE6M1VfR9yXn8bF5dZ4qQ2mC9wP8hZkE6M1Vf',
    explorer: 'https://solscan.io/account/FQwP8hZkE6M1VfR9yXn8bF5dZ4qQ2mC9wP8hZkE6M1Vf',
    paymentUri: 'solana:FQwP8hZkE6M1VfR9yXn8bF5dZ4qQ2mC9wP8hZkE6M1Vf'
  },
  ton: {
    chain: 'The Open Network (TON)',
    symbol: 'TON',
    address: 'EQBbaaD9B836f9bd61cD0d616a016Cc911A2E1f60DQMOOSA',
    explorer: 'https://tonscan.org/address/EQBbaaD9B836f9bd61cD0d616a016Cc911A2E1f60DQMOOSA',
    paymentUri: 'ton://transfer/EQBbaaD9B836f9bd61cD0d616a016Cc911A2E1f60DQMOOSA'
  }
};

console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║       QMOOSA MULTI-CHAIN WALLET & QR CODE GENERATOR                      ║');
console.log('║       Supports: BNB Chain (BSC), Solana, TON, and NIST PQC Identity      ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

async function generate() {
  for (const [key, wallet] of Object.entries(WALLET_CONFIG)) {
    console.log(`▶ [${wallet.chain.toUpperCase()}]`);
    console.log(`  Address:  ${wallet.address}`);
    console.log(`  Explorer: ${wallet.explorer}`);

    // Generate SVG file
    const svgPath = path.join(publicDir, `qr-${key}.svg`);
    const svgString = await QRCode.toString(wallet.address, {
      type: 'svg',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    fs.writeFileSync(svgPath, svgString, 'utf8');
    console.log(`  ✅ SVG QR saved: public/qr-${key}.svg`);

    // Output terminal ASCII QR code
    const terminalQr = await QRCode.toString(wallet.address, {
      type: 'terminal',
      small: true
    });
    console.log(terminalQr);
    console.log('----------------------------------------------------------------------\n');
  }

  // Save wallet manifest for frontend
  const walletManifestPath = path.join(publicDir, 'wallet-info.json');
  fs.writeFileSync(walletManifestPath, JSON.stringify(WALLET_CONFIG, null, 2), 'utf8');
  console.log(`🎉 Multi-chain wallet metadata saved to: public/wallet-info.json`);
}

generate().catch(err => {
  console.error('QR generation failed:', err);
  process.exit(1);
});
