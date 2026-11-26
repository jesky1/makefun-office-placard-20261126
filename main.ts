// main.ts — Office Artifacts: The One-Line Placard Contest entry writer.
// Sends one museum placard for an ordinary office object to /output/entry.txt.
import { mkdirSync as makeDir, writeFileSync as writeFile } from "node:fs";

// The placard, written fresh in this session: a stapler recast as a ritual
// object — catalogue date, pressed-steel material, and a donor, the
// Department of Meetings, whose offerings of paper no one ever read.
// Dry curator's voice throughout; every word earns its place.
const PLACARD =
  "Ritual Stapler, c. 1994, pressed steel and regret. Used to bind offerings of paper no one read. Donated by the Department of Meetings.";

// The gate in the rules: entry.txt is UTF-8 text, 1–180 characters,
// one line, never just whitespace.
const MIN_LEN = 1;
const MAX_LEN = 180;
const FILENAME = "entry.txt";

function checkPlacard(line: string): void {
  // Length first: the gate is a hard 1–180 characters, so a line
  // outside it is rejected before anything else is looked at.
  if (line.length < MIN_LEN || line.length > MAX_LEN) {
    throw new Error(`placard is ${line.length} chars, gate is ${MIN_LEN}-${MAX_LEN}`);
  }
  if (line.trim() === "") {
    throw new Error("placard is blank");
  }
  if (line.indexOf("\n") !== -1 || line.indexOf("\r") !== -1) {
    throw new Error("placard must be one line");
  }
}

checkPlacard(PLACARD);
const outFolder = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
makeDir(outFolder, { recursive: true });
writeFile(outFolder + "/" + FILENAME, PLACARD, "utf8");
console.log(`placard saved: ${PLACARD.length} characters to ${outFolder}/${FILENAME}`);
