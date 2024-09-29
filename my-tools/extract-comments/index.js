const fs = require("fs");

const chromiumPath = "/home/daiiz/daiiz2/chromium";
const targetRootDirs = ["chrome"];

async function main() {
  const dirs = await fs.promises.readdir(chromiumPath);
}

main();
