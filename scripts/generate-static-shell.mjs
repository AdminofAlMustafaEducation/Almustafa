import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const serverEntry = resolve(root, "dist/server/server.js");
const shellPath = resolve(root, "dist/client/_shell.html");
const siteUrl = "https://www.almustafaeducationsystem.com/";

const { default: server } = await import(pathToFileURL(serverEntry));
const response = await server.fetch(new Request(siteUrl));

if (!response.ok) {
  throw new Error(`Failed to generate static shell: ${response.status} ${response.statusText}`);
}

const html = await response.text();

if (!html.includes("Al-Mustafa Academy")) {
  throw new Error("Generated shell did not include expected page content.");
}

await mkdir(dirname(shellPath), { recursive: true });
await writeFile(shellPath, html);

console.log(`Generated ${shellPath}`);
