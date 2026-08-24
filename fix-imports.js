const fs = require("fs");
const path = require("path");

const base = path.join("src", "app", "[locale]");

// Fix property detail page
const f1 = path.join(base, "properties", "[slug]", "page.tsx");
let content1 = fs.readFileSync(f1, "utf8");
content1 = content1.replace(/from "@\/lib\/i18n""/g, 'from "@/lib/i18n"');
fs.writeFileSync(f1, content1);
console.log("Fixed property detail page");

// Fix locations page
const f2 = path.join(base, "properties", "locations", "[slug]", "page.tsx");
let content2 = fs.readFileSync(f2, "utf8");
content2 = content2.replace(/from "@\/lib\/i18n""/g, 'from "@/lib/i18n"');
fs.writeFileSync(f2, content2);
console.log("Fixed locations page");

// Fix sponsors page
const f3 = path.join(base, "sponsors", "[slug]", "page.tsx");
let lines3 = fs.readFileSync(f3, "utf8").split("\n");
lines3 = lines3.filter(line => !line.includes("const copy = getCopy"));
fs.writeFileSync(f3, lines3.join("\n"));
console.log("Fixed sponsors page");

// Remove this script
fs.unlinkSync("fix-imports.py");
console.log("Cleaned up script");
