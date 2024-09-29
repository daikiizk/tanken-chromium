const fs = require("fs");
const path = require("path");

const chromiumPath = "/home/daiiz/daiiz2/chromium";
const targetRootDirs = ["chrome", "ui"];
const exts = [
  //".cc",
  //".h",
  ".js",
  ".ts",
];

async function findFilesWithExtension(dir, ext, fileList = []) {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      await findFilesWithExtension(fullPath, ext, fileList);
    } else if (path.extname(fullPath) === ext) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

async function main() {
  const dirs = await fs.promises.readdir(chromiumPath);
  for (const dir of dirs) {
    if (!targetRootDirs.includes(dir)) {
      continue;
    }
    const path = `${chromiumPath}/${dir}`;
    console.log(`Processing: ${path}`);
    for (const ext of exts) {
      const filePaths = await findFilesWithExtension(path, ext);
      console.log(dir, ext, filePaths.length);
    }
  }
}

main();
