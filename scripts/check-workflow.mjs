import { readFileSync } from "node:fs";

const file = new URL("../AI_WORKFLOW.md", import.meta.url);
const markdown = readFileSync(file, "utf8");
const failures = [];

function clean(value = "") {
  return value.replace(/<!--.*?-->/g, "").replace(/`/g, "").trim();
}

function bulletValue(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return clean(markdown.match(new RegExp(`^- ${escaped}:\\s*(.*)$`, "im"))?.[1]);
}

function section(heading, level = 2) {
  const lines = markdown.split("\n");
  const marker = `${"#".repeat(level)} ${heading}`.toLowerCase();
  const start = lines.findIndex((line) => line.trim().toLowerCase() === marker);
  if (start < 0) return "";

  const collected = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const nextHeading = line.match(/^(#+)\s+/);
    if (nextHeading && nextHeading[1].length <= level) break;
    collected.push(line);
  }
  return collected.join("\n").trim();
}

function tableRows(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"))
    .map((line) => line.split("|").slice(1, -1).map(clean))
    .filter((cells) => cells.length && !cells.every((cell) => /^:?-+:?$/.test(cell)))
    .slice(1);
}

const active = bulletValue("Active time band");
if (!["<20m", "20-30m", "30-45m", ">45m"].includes(active)) {
  failures.push("Active time band must be selected.");
}

const workflow = bulletValue("Primary workflow");
if (!workflow || /^unknown$/i.test(workflow)) {
  failures.push("Primary workflow must be recorded.");
}

const toolRows = tableRows(section("Tools and Models"));
const realToolRows = toolRows.filter((row) => row.some((cell) => cell && !/^unknown$/i.test(cell)));
if (!realToolRows.length) {
  failures.push("At least one real tool/model row must be recorded.");
}

const timelineRows = tableRows(section("Session Timeline"));
const realTimelineRows = timelineRows.filter((row) => {
  const [, tool, purpose, outcome, humanAction] = row;
  return [tool, purpose, outcome, humanAction].some((cell) => cell && !/^unknown$/i.test(cell));
});
if (!realTimelineRows.length) {
  failures.push("At least one real timeline step must be recorded.");
}

const verification = bulletValue("Commands/checks run");
if (!verification || /^not recorded yet$/i.test(verification)) {
  failures.push("Verification commands/checks must be recorded.");
}

for (const heading of [
  "What worked well",
  "What I would change next time",
  "Practice I would recommend to the team",
]) {
  const text = section(heading, 3);
  if (!text || /\bTBD\b/i.test(text)) failures.push(`${heading} must be completed.`);
}

if (failures.length) {
  console.error("AI_WORKFLOW.md is incomplete:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("AI_WORKFLOW.md submission check: OK");
