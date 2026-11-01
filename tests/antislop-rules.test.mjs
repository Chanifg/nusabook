import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function getAllSourceFiles(dir, extensions = [".tsx", ".ts", ".jsx", ".js"]) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        files.push(...getAllSourceFiles(fullPath, extensions));
      }
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

test("Anti-Slop Hard Gate R-02: Zero em-dash (—) characters across all UI and copy", () => {
  const appFiles = getAllSourceFiles(path.join(process.cwd(), "app"));
  const componentFiles = getAllSourceFiles(path.join(process.cwd(), "components"));
  const allFiles = [...appFiles, ...componentFiles];

  const violations = [];
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");
    if (content.includes("—")) {
      const relPath = path.relative(process.cwd(), file);
      violations.push(relPath);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found em-dash (—) in the following files violating R-02: ${violations.join(", ")}`
  );
});

test("Anti-Slop Quality Lock R-16: Zero generic AI marketing buzzwords in UI copy", () => {
  const appFiles = getAllSourceFiles(path.join(process.cwd(), "app"));
  const componentFiles = getAllSourceFiles(path.join(process.cwd(), "components"));
  const allFiles = [...appFiles, ...componentFiles];

  const bannedBuzzwords = [
    /\bAI-powered\b/i,
    /\brevolutionary\b/i,
    /\bcutting-edge\b/i,
    /\bnext generation\b/i,
    /\bseamless\b/i,
  ];

  const violations = [];
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");
    for (const pattern of bannedBuzzwords) {
      if (pattern.test(content)) {
        const relPath = path.relative(process.cwd(), file);
        violations.push(`${relPath} (matches ${pattern})`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found generic AI buzzwords violating R-16: ${violations.join(", ")}`
  );
});

test("Anti-Slop Hard Gate R-24 & R-26: Zero dead href=\"#\" links without destination", () => {
  const appFiles = getAllSourceFiles(path.join(process.cwd(), "app"));
  const componentFiles = getAllSourceFiles(path.join(process.cwd(), "components"));
  const allFiles = [...appFiles, ...componentFiles];

  const violations = [];
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf8");
    // Look for href="#" or href={'#'} that don't have an anchor target like #section
    if (/href=["']#["']/i.test(content) || /href=\{["']#["']\}/i.test(content)) {
      const relPath = path.relative(process.cwd(), file);
      violations.push(relPath);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found dead href="#" links violating R-24 & R-26: ${violations.join(", ")}`
  );
});
