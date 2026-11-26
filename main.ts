// Office Artifacts — The One-Line Placard Contest: entry writer.
// Composed in this session. The program holds exactly one museum
// placard — a stapler presented as if it were a sacred antique —
// and stores it as the single line of /output/entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The exhibit label itself. Catalogue dating first ("c. 1994"),
// then the material (pressed steel, plus regret for colour), what
// the object was for, and finally the lending department.
const PLACARD =
  "Ritual Stapler, c. 1994, pressed steel and regret. Used to bind offerings of paper no one read. Donated by the Department of Meetings.";

export function placardText() {
  return PLACARD;
}

// The harness fixes the destination at /output; the environment
// override exists only so the test suite can use a scratch folder.
export function outputDirectory() {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function publishPlacard() {
  const text = placardText();
  // Guard the contest gate locally: one line, 1 to 180 characters,
  // and no carriage returns sneaking a second line past the check.
  if (text.length < 1 || text.length > 180 || text.includes("\n") || text.includes("\r")) {
    throw new Error(`placard breaks the gate at ${text.length} chars`);
  }
  const dir = outputDirectory();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, text, "utf8");
  console.log(`placard published: ${text.length} characters to ${target}`);
}

publishPlacard();
