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
const parseDataUrl = require("parse-data-url");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");

function extractBase64Images(nodeValue, filePath) {
  const parsed = parseDataUrl(nodeValue);
  const extension = mime.extension(parsed.contentType);
  const basename = path.dirname(filePath);
  const filename = `${uuidv4()}.${extension}`;

  fs.writeFileSync(`${basename}/${filename}`, parsed.toBuffer());

  return `./${filename}`;
}

module.exports = extractBase64Images;
