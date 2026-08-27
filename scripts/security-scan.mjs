import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const failures = [];

function read(relativePath) {
  const absolutePath = resolve(root, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
}

function assertAbsent(relativePath, pattern, message) {
  const content = read(relativePath);
  if (pattern.test(content)) {
    failures.push(`${relativePath}: ${message}`);
  }
}

assertAbsent(
  "src/components/application-wizard.tsx",
  /register\(["'](?:password|confirm_password)["']\)|name=["'](?:password|confirm_password)["']/,
  "public application form still binds a raw password field",
);
assertAbsent(
  "src/data/schema.ts",
  /applicationSchema[\s\S]*?password\s*:/,
  "public application schema still defines a password field",
);
assertAbsent(
  "src/hooks/use-admissions.ts",
  /\bpassword\s*:\s*data\.password\b/,
  "public application mutation still sends a raw password",
);

function findFiles(directory) {
  const absoluteDirectory = resolve(root, directory);
  if (!existsSync(absoluteDirectory)) return [];
  const files = [];
  for (const entry of readdirSync(absoluteDirectory)) {
    const absoluteEntry = resolve(absoluteDirectory, entry);
    if (statSync(absoluteEntry).isDirectory()) {
      files.push(...findFiles(`${directory}/${entry}`));
    } else if (!/\.(?:js|jsx|ts|tsx|html|css|json|mjs|cjs)$/.test(entry)) {
      continue;
    } else {
      files.push(`${directory}/${entry}`);
    }
  }
  return files;
}

for (const directory of ["src", "public", "dist/client"]) {
  for (const relativePath of findFiles(directory)) {
    if (read(relativePath).includes("SUPABASE_SERVICE_ROLE_KEY")) {
      failures.push(`${relativePath}: service-role key marker is present in client-visible files`);
    }
  }
}

const hookFiles = [
  "use-admissions.ts",
  "use-attendance.ts",
  "use-batches.ts",
  "use-chat-agents.ts",
  "use-exams.ts",
  "use-faculty.ts",
  "use-fees.ts",
  "use-inquiries.ts",
  "use-live-classes.ts",
  "use-notes.ts",
  "use-notifications.ts",
  "use-settings.ts",
  "use-students.ts",
  "use-teacher-assignments.ts",
];
for (const file of hookFiles) {
  const relativePath = `src/hooks/${file}`;
  const content = read(relativePath);
  if (/const USE_MOCK = !supabase;/.test(content)) {
    failures.push(`${relativePath}: mock mode is not restricted to development`);
  }
}

if (failures.length > 0) {
  console.error("Phase 1 security scan failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Phase 1 security scan passed.");
}
