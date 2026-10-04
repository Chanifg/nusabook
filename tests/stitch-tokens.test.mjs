import test from "node:test";
import assert from "node:assert/strict";
import rawConfig from "../tailwind.config.ts";

test("Stitch Token Verification: canonical palette & typography", () => {
  const config = rawConfig.default || rawConfig;
  const colors = config.theme?.extend?.colors || {};
  const fontSize = config.theme?.extend?.fontSize || {};
  const spacing = config.theme?.extend?.spacing || {};

  // Primary and Container
  assert.equal(colors.primary, "#003178", "primary color must be canonical #003178");
  assert.equal(colors["primary-container"], "#0d47a1", "primary-container must be #0d47a1");
  assert.equal(colors["on-primary"], "#ffffff", "on-primary must be #ffffff");

  // Secondary & Accents
  assert.equal(colors.secondary, "#964900", "secondary must be #964900");
  assert.equal(colors["secondary-container"], "#fc820c", "secondary-container must be #fc820c");

  // Surfaces & Backgrounds
  assert.equal(colors.surface, "#faf8ff", "surface must be #faf8ff");
  assert.equal(colors["surface-container-lowest"], "#ffffff", "surface-container-lowest must be #ffffff");
  assert.equal(colors["surface-container-low"], "#f2f3ff", "surface-container-low must be #f2f3ff");
  assert.equal(colors["surface-container"], "#eaedff", "surface-container must be #eaedff");
  assert.equal(colors["surface-container-high"], "#e2e7ff", "surface-container-high must be #e2e7ff");
  assert.equal(colors["surface-container-highest"], "#dae2fd", "surface-container-highest must be #dae2fd");
  assert.equal(colors["on-surface"], "#131b2e", "on-surface must be #131b2e");
  assert.equal(colors["on-surface-variant"], "#434652", "on-surface-variant must be #434652");

  // Typography tokens
  assert.ok(fontSize["micro-badge"], "micro-badge font size token must exist");
  assert.equal(fontSize["micro-badge"][0], "11px", "micro-badge size must be 11px");

  // Spacing tokens
  assert.equal(spacing["space-md"], "1rem", "space-md must be 1rem");
  assert.equal(spacing["space-lg"], "1.5rem", "space-lg must be 1.5rem");
});
