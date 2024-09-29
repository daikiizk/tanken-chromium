const fs = require("fs");

const chromiumPath = "/home/daiiz/daiiz2/chromium";
const targetRootDirs = ["chrome"];

async function main() {
  const dirs = await fs.promises.readdir(chromiumPath);
  for (const dir of dirs) {
    if (!targetRootDirs.includes(dir)) {
      continue;
    }
    const path = `${chromiumPath}/${dir}`;
    console.log(`Processing: ${path}`);
  }
}

main();
