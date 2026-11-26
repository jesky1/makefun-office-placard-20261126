// test.mjs — checks for the office-placard entry writer.
// Run: node --test test.mjs
import test from "node:test";
import { strict as assert } from "node:assert";
import { execFileSync as runFile } from "node:child_process";
import { mkdtempSync as makeTemp, readFileSync as readText, rmSync as removeTree } from "node:fs";
import { tmpdir as tempRoot } from "node:os";
import { join as joinPath } from "node:path";

// Builds the entry once into a fresh temp folder and returns the text.
function placardOnce() {
  const folder = makeTemp(joinPath(tempRoot(), "office-placard-"));
  runFile(process.execPath, ["main.ts"], {
    cwd: import.meta.dirname,
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: folder },
    encoding: "utf8",
  });
  const text = readText(joinPath(folder, "entry.txt"), "utf8");
  removeTree(folder, { recursive: true, force: true });
  return text;
}

test("placard fits the gate: 1–180 characters, a single non-blank line", () => {
  const text = placardOnce();
  assert.ok(text.length >= 1, "empty entry");
  assert.ok(text.length <= 180, `too long: ${text.length}`);
  assert.ok(text.trim().length > 0, "blank entry");
  assert.ok(text.indexOf("\n") === -1, "must be one line");
});

test("the placard is identical on every build", () => {
  assert.equal(placardOnce(), placardOnce());
});

test("the placard names the stapler, its date, and its donor", () => {
  const text = placardOnce();
  assert.match(text, /Ritual Stapler/);
  assert.match(text, /c\. 1994/);
  assert.match(text, /Department of Meetings/);
});
