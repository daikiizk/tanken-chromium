const fs = require("fs");
const path = require("path");

const chromiumPath = "/home/daiiz/daiiz2/chromium";
const outDataDir = "./out/extract-comments";

const targetRootDirs = [
  //"chrome",
  "ui",
  //"third_party"
];
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
      const outDataPath = `${outDataDir}/${dir}_${ext}.json`;
      console.log(ext, filePaths.length);
      await fs.promises.writeFile(outDataPath, JSON.stringify({}, null, 2));
      console.log(">", outDataPath);
    }
  }
}

main();
