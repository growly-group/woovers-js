import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { randomBytes } from "crypto";

const _generatedApiKeys = [];
const _pixQrCodes = [];

async function main() {
  const apiKey = randomBytes(128).toString("base64");
  console.log(`ApiKey: ${apiKey}`);
}

main();
