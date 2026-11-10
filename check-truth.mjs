import fs from "node:fs";
const files=["README.md","server.ts"];
const forbidden=[
  /Ready for Solana on-chain synchronization/i,
  /IBM Qiskit AerSimulator \(Noise-Free Matrix\)/i,
  /Verifies the quantum decryption proof on Solana Anchor Program/i
];
let failed=false;
for(const file of files){
 if(!fs.existsSync(file)) continue;
 const body=fs.readFileSync(file,"utf8");
 for(const rule of forbidden){if(rule.test(body)){console.error(`TRUTH CHECK FAIL: ${file} matches ${rule}`);failed=true}}
}
if(failed) process.exit(1);
console.log("TRUTH CHECK PASS");
