const { v4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const replace = require("replace-in-file");

function createUniqueName(numbers) {
  const generated = v4().slice(0, numbers);
  if (!isNaN(parseInt(generated[0]))) {
    return createUniqueName(numbers);
  }
  return generated;
}

glob("./dist/*.html", (err, pages) => {
  let classesFound = [];

  pages.forEach((page) => {
    const pageContent = fs.readFileSync(page, "utf8");

    const classRegExp = /class="(.*?)"/g;

    const matches = [...pageContent.matchAll(classRegExp)];

    matches.forEach((match) => {
      const content = match[1].split(" ");

      content.forEach((item) => {
        if (classesFound.includes(item)) {
          return;
        }
        classesFound.push(item);
      });
    });
  });
	
  async function replacer() {
    for (const classFound of classesFound) {
      const hash = createUniqueName(4);
      await replace({
        files: path.resolve(__dirname, "dist/**/*"),
        from: new RegExp(classFound, "g"),
        to: hash,
      });
    }
  }
  replacer();
});
