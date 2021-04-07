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
const path = require("path");
const url = require("url");

function jekyllLinks(nodeValue, filePath) {
  const link = url.parse(nodeValue);
  // if we have a relative link check to see if it is Jekyll style
  if (!link.protocol && link?.pathname?.endsWith(".html")) {
    const originalBaseName = path.dirname(filePath);
    const basename = path.dirname(link.pathname);
    const filename = path.basename(link.pathname, ".html");
    const mdfilename = path.join(originalBaseName, basename, `${filename}.md`);

    if (fs.existsSync(mdfilename)) {
      return path.join(
        basename,
        `${filename}.md${link.hash ? link.hash : ""}${
          link.search ? link.search : ""
        }`
      );
    } else {
      return nodeValue;
    }
  } else {
    return nodeValue;
  }
}

module.exports = jekyllLinks;
