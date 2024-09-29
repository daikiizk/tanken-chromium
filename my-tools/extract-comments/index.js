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

async function extractComments(filePath, ext) {
  const JS_SINGLE = /^\/\//;
  const JS_MULTI_HEAD = /^\/\*+/;
  const JS_MULTI_MIDDLE = /^\*+/;
  const JS_MULTI_TAIL = /\*+\//;

  const lines = (await fs.promises.readFile(filePath, "utf-8")).split("\n");

  const comments = [];
  const blockComment = [];
  for (const _line of lines) {
    const line = _line.trim();
    if (ext === ".js" || ext === ".ts") {
      if (JS_MULTI_HEAD.test(line) || blockComment.length > 0) {
        // `/*`で始まり`*/`で終わる複数行コメントを抽出
        if (JS_MULTI_TAIL.test(line)) {
          blockComment.push(
            line.replace(JS_MULTI_HEAD, "").replace(JS_MULTI_TAIL, "").trim()
          );
          comments.push(blockComment.filter((x) => !!x).join("\n"));
          blockComment.length = 0;
        } else if (JS_MULTI_HEAD.test(line)) {
          blockComment.push(line.replace(JS_MULTI_HEAD, "").trim());
        } else {
          blockComment.push(line.replace(JS_MULTI_MIDDLE, "").trim());
        }
      } else if (JS_SINGLE.test(line)) {
        // `//`で始まる単一行コメントを抽出
        comments.push(line.replace(JS_SINGLE, "").trim());
      }
    }
  }
  console.log(filePath.split("/").pop(), comments);
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
      for (let i = 0; i < filePaths.length; i++) {
        await extractComments(filePaths[i], ext);
      }
      await fs.promises.writeFile(outDataPath, JSON.stringify({}, null, 2));
      console.log(">", outDataPath);
    }
  }
}

main();
