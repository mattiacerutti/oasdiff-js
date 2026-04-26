import {createWriteStream} from "node:fs";
import * as fs from "node:fs/promises";
import {HttpsProxyAgent} from "https-proxy-agent";
import fetch from "node-fetch";
import {pipeline} from "node:stream/promises";
import * as tar from "tar";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {ARCH_MAPPING, CONFIG, PLATFORM_MAPPING} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");

function getProxyUrl() {
  return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy || null;
}

async function install() {
  const packageJson = JSON.parse(await fs.readFile(path.join(packageRoot, "package.json"), "utf8"));
  let version = packageJson.version;

  if (typeof version !== "string") {
    throw new Error("Missing version in package.json");
  }

  if (version.startsWith("v")) {
    version = version.slice(1);
  }

  const {name: binName, path: binPath} = CONFIG;
  const binaryName = process.platform === "win32" ? `${binName}.exe` : binName;
  const resolvedBinPath = path.resolve(packageRoot, binPath);
  const binaryPath = path.join(resolvedBinPath, binaryName);

  try {
    await fs.access(binaryPath);
    return;
  } catch {
    // Binary missing, continue with install.
  }

  let url = process.platform === "darwin" ? CONFIG.darwinUrl : CONFIG.url;
  url = url.replace(/{{arch}}/g, ARCH_MAPPING[process.arch]);
  url = url.replace(/{{platform}}/g, PLATFORM_MAPPING[process.platform]);
  url = url.replace(/{{version}}/g, version);
  url = url.replace(/{{bin_name}}/g, binName);

  const fetchOptions = {};
  const proxyUrl = getProxyUrl();
  if (proxyUrl) {
    console.log("Using proxy:", proxyUrl);
    fetchOptions.agent = new HttpsProxyAgent(proxyUrl);
  }

  console.log("Fetching from URL:", url);
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`Failed fetching oasdiff binary: ${response.status} ${response.statusText}`);
  }

  const tarFile = path.join(resolvedBinPath, "downloaded.tar.gz");

  await fs.mkdir(resolvedBinPath, {recursive: true});
  await pipeline(response.body, createWriteStream(tarFile));
  await tar.x({file: tarFile, cwd: resolvedBinPath});
  await fs.rm(tarFile, {force: true});

  if (process.platform !== "win32") {
    await fs.chmod(binaryPath, 0o755);
  }
}

install().catch((error) => {
  console.error(error);
  process.exit(1);
});
