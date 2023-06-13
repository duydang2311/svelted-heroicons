const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

const dirs = [
  "node_modules/heroicons/20",
  "node_modules/heroicons/24",
  "src/icons/20",
  "src/icons/24",
];
const svgs = [];
const iconNames = new Set();

while (dirs.length) {
  const dir = dirs.shift();
  const files = fsSync.readdirSync(dir);
  for (const file of files) {
    const path = `${dir}/${file}`;
    const stats = fsSync.statSync(path);
    if (stats.isDirectory()) {
      dirs.push(path);
    } else if (file.endsWith(".svg")) {
      svgs.push(path);
    }
  }
}

const length = "<svg".length;

const transformFileName = (name) => {
  name[0] = name[0].toUpperCase();
  return (
    name[0].toUpperCase() +
    name.substring(1).replace(/-(.)/g, (_, $1) => $1.toUpperCase())
  );
};

const promises = [];
for (const file of svgs) {
  const fileName = transformFileName(path.basename(file));
  iconNames.add(fileName.substring(0, fileName.length - 4));
  const outDir = `dist/${path.dirname(
    file
      .replace("20/solid", "20/mini")
      .substring(file.indexOf("icons") + "icons".length + 4)
  )}`;
  promises.push(
    fs
      .access(outDir, fs.constants.F_OK)
      .catch(() => fs.mkdir(outDir, { recursive: true }))
      .then(() => fs.readFile(file))
      .then((buffer) =>
        fs.writeFile(
          outDir + "/" + fileName.replace(".svg", ".svelte"),
          Buffer.from("<svg {...$$restProps}") + buffer.subarray(length),
          (err) => {
            if (err) {
              throw err;
            }
          }
        )
      )
  );
}

Promise.all(promises).then(() => {
  const js = `export type IconType = 'solid'|'outline'|'mini';export type IconName = ${Array.from(
    iconNames.values()
  )
    .map((name) => `'${name}'`)
    .join("|")};`;
  fs.writeFile("./dist/index.d.ts", js);
});
