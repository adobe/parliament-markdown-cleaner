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

const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const childProcess = require("child_process");
const isBinaryFileSync = require("isbinaryfile").isBinaryFileSync;

const allowList = ["img.shields.io"];

function downloadRemoteImages(nodeValue, filePath) {
  const imageUrl = new URL(nodeValue);

  if (allowList.includes(imageUrl.hostname)) {
    return nodeValue;
  }

  const extension = new URL(imageUrl).pathname
    .split("/")
    .pop()
    .split(".")
    .pop();
  const basename = path.dirname(filePath);
  const filename = `${uuidv4()}.${extension}`;
  const fullFilename = `${basename}/${filename}`;

  try {
    // download remote file
    childProcess.execFileSync(
      "curl",
      ["--silent", "-L", "-o", fullFilename, nodeValue],
      {}
    );

    const bytes = fs.readFileSync(fullFilename);
    const size = fs.lstatSync(fullFilename).size;
    if (isBinaryFileSync(bytes, size)) {
      return `./${filename}`;
    } else {
      fs.removeSync(fullFilename);
      return nodeValue;
    }
  } catch (error) {
    // console.log(error);
    return nodeValue;
  }
}

module.exports = downloadRemoteImages;
