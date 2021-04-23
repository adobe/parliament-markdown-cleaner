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
const { v4: uuidv4 } = require("uuid");
const download = require("download");

function downloadRemoteImages(nodeValue, filePath) {
  const extension = new URL(nodeValue).pathname
    .split("/")
    .pop()
    .split(".")
    .pop();
  const basename = path.dirname(filePath);
  const filename = `${uuidv4()}.${extension}`;

  // download remote file
  (async () => {
    fs.writeFileSync(`${basename}/${filename}`, await download(nodeValue));
  })();

  return `./${filename}`;
}

module.exports = downloadRemoteImages;
