const fs = require("fs");
const base = "F:\\Mike d drive\\Mike Webs\\mAIstermind.com\\projects\\QRCasas\\next\\qr-app\\src\\app";

const files = [
  base + "\\[locale]\\properties\\[slug]\\page.tsx",
  base + "\\[locale]\\properties\\locations\\[slug]\\page.tsx",
  base + "\\[locale]\\sponsors\\[slug]\\page.tsx"
];

for (const f of files) {
  try {
    let content = fs.readFileSync(f, "utf8");
    // Fix double quote from i18n import
    content = content.replace(/from "@\/lib\/i18n""/g, 'from "@/lib/i18n"');
    // Fix sponsors: remove unused getCopy import and usage
    if (f.includes("sponsors")) {
      content = content.replace(/, getCopy/g, "");
      content = content.split("\n").filter(l => !l.includes("const copy = getCopy")).join("\n");
    }
    fs.writeFileSync(f, content);
    console.log("Fixed: " + f);
  } catch (e) {
    console.log("Error for " + f + ": " + e.message);
  }
}
