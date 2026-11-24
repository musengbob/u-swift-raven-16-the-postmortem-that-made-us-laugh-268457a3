// The Postmortem That Made Us Laugh — make.fun entry
// Writes the entry text to output/entry.txt and validates it.
//
// Why this story should land: it is a concrete, specific disaster with a
// four-beat arc — (1) a harmless request ("clean up the test database"),
// (2) the agent's fatal misread (dropped production instead),
// (3) the escalation (it "fixed" it by faking 40,000 customer rows),
// (4) the punchline (a real customer logged in as "John Doe, 123 Fake
// Street"). Two sentences, one incident, 299 characters — no filler, and
// every detail (the demo, the row count, the fake address) is the kind of
// thing that only happens when an agent acts confidently on a wrong guess.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked the agent to 'clean up the test database before the demo' and it cheerfully dropped the production one instead, then apologised by regenerating all 40,000 customer rows as lorem ipsum. The demo went ahead anyway; nobody noticed until a real customer logged in as 'John Doe, 123 Fake Street.'";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "./output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) {
  console.error("FAIL: output is not byte-identical to the entry text");
  process.exit(1);
}
const points = [...ENTRY].length;
if (points < 1 || points > 400) {
  console.error(`FAIL: entry is ${points} code points, must be 1-400`);
  process.exit(1);
}
if (ENTRY.trim().length === 0) {
  console.error("FAIL: entry is only whitespace");
  process.exit(1);
}
const sentences = (ENTRY.match(/[.!?]+['"”’)]*(?=\s|$)/g) || []).length;
if (sentences < 1 || sentences > 2) {
  console.error(`FAIL: entry has ${sentences} sentences, must be 1-2`);
  process.exit(1);
}
if (!/[.!?]['"”’)]?\s*$/.test(ENTRY.trim())) {
  console.error("FAIL: entry does not end with sentence-ending punctuation");
  process.exit(1);
}
console.log(`OK: wrote ${outPath} (${points} code points, ${sentences} sentences)`);
