// Checks for the one-line placard writer, composed in this session.
// Run with: node --test test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const EXPECTED =
  "Ritual Stapler, c. 1994, pressed steel and regret. Used to bind offerings of paper no one read. Donated by the Department of Meetings.";

// Execute the writer once against a fresh scratch directory and
// hand back whatever landed in entry.txt there.
function buildOnce() {
  const scratch = mkdtempSync(join(tmpdir(), "placard-check-"));
  execFileSync(process.execPath, ["main.ts"], {
    cwd: import.meta.dirname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: scratch },
    stdio: "pipe",
  });
  return readFileSync(join(scratch, "entry.txt"), "utf8");
}

test("entry obeys the gate: a single non-blank line of 1-180 chars", () => {
  const entry = buildOnce();
  assert.ok(entry.length >= 1 && entry.length <= 180, `length ${entry.length}`);
  assert.equal(entry.includes("\n"), false);
  assert.ok(entry.trim().length > 0);
});

test("every build emits the identical placard, byte for byte", () => {
  assert.equal(buildOnce(), EXPECTED);
  assert.equal(buildOnce(), buildOnce());
});

test("the label names the stapler, its circa date and its donor", () => {
  const entry = buildOnce();
  assert.match(entry, /Ritual Stapler/);
  assert.match(entry, /c\. 1994/);
  assert.match(entry, /Department of Meetings/);
});

test("the file carries no trailing newline or carriage return", () => {
  const entry = buildOnce();
  assert.equal(entry.endsWith("\n"), false);
  assert.equal(entry.includes("\r"), false);
});
