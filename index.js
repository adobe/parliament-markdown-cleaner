/**
 *  Copyright 2020 Adobe. All rights reserved.
 *  This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License. You may obtain a copy
 *  of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under
 *  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *  OF ANY KIND, either express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 */

const fs = require("fs");
const pathUtils = require("path");
const unified = require("unified");
const parse = require("remark-parse");
const stringify = require("remark-stringify");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const shell = require("shelljs");
const { default: svgr } = require("@svgr/core");
const markdownCleaner = require("./src/markdownCleaner");

const cleaningOptions = {
  addLineBreaks: "addLineBreaks",
  cleanHtmlNodes: "cleanHtmlNodes",
};

const optionalTags = [];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function clean(path, templatePath = ".") {
  if (!path) {
    console.error(
      "You must specify a path to markdown docs you would like cleaned"
    );
    process.exit(1);
  }

  const inlineImages = `${templatePath}/inline-images`;

  const files = [
    ...shell.ls("-RLl", `${path}/**/*.md`),
    ...shell.ls("-RLl", `${path}/.**/*.md`),
  ];

  for (const file of files) {
    if (file.isFile()) {
      // Extract inline SVG and convert into react components
      // Read the contents of the file
      const data = fs.readFileSync(`${file.name}`, {
        encoding: "utf8",
        flag: "r",
      });

      // Create component name
      const filename = `Svg${capitalizeFirstLetter(
        pathUtils.basename(file.name, ".md")
      )}`;

      // Create inline images if it doesn't exist
      if (!fs.existsSync(inlineImages)) {
        fs.mkdirSync(inlineImages);
      }

      let count = 0;
      const re = /<svg([\s\S]*?)<\/svg>/g;

      // convert inline svg to react component
      const convert = (match) => {
        count++;
        // convert svg to react component
        const svgComponent = svgr.sync(match, {}, { componentName: filename });
        // Write react component
        fs.writeFileSync(
          `${inlineImages}/${filename}${count}.js`,
          svgComponent
        );
        // return new svg tag name
        return `<${filename.toLowerCase()}${count}/>`;
      };

      // Replace all inline svg's with custom component tags
      const newFile = data.replace(re, convert);
      // Write out updated markdown file
      fs.writeFileSync(file.name, newFile);

      // Adds proper line breaks below HTML/JSX tags so they can be processed correctly
      unified()
        .use(parse)
        .use(markdownCleaner, cleaningOptions.addLineBreaks)
        .use(stringify, {
          incrementListMarker: false,
        })
        .use(frontmatter, ["yaml", "toml"])
        .process(vfile.readSync(`${file.name}`), function (err, file) {
          if (err) {
            console.error(err);
          }
          if (file) {
            vfile.writeSync(file);
          }
        });

      // Fixes HTML/JSX tags by transforming HTML into markdown or adding closing tags as needed.
      unified()
        .use(parse)
        .use(
          markdownCleaner,
          cleaningOptions.cleanHtmlNodes,
          optionalTags,
          file.name,
          path
        )
        .use(stringify, {
          incrementListMarker: false,
        })
        .use(frontmatter, ["yaml", "toml"])
        .process(vfile.readSync(`${file.name}`), function (err, file) {
          if (err) {
            console.error(err);
          }
          if (file) {
            file.contents = file.contents
              .replace(/\\\[/g, "[")
              .replace(/\\\</g, "<")
              .replace(/\\&/g, "&");
            vfile.writeSync(file);
          }
        });
    }
  }
}

module.exports = markdownCleaner.clean = clean;
