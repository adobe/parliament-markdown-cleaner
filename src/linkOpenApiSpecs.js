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

function linkOpenApiSpecs(nodeValue, filePath) {
  if (
    !(
      nodeValue.startsWith("/") ||
      nodeValue.startsWith("http:") ||
      nodeValue.startsWith("https:")
    ) &&
    (nodeValue.endsWith(".json") ||
      nodeValue.endsWith(".yml") ||
      nodeValue.endsWith(".yaml"))
  ) {
    const originalBaseName = path.dirname(filePath);
    const basename = path.dirname(nodeValue);
    const filename = path.basename(nodeValue);
    const testFilename = path.join(originalBaseName, basename, filename);

    const data = fs.readFileSync(testFilename, {
      encoding: "utf8",
      flag: "r",
    });
    if (data.includes("swagger") || data.includes("openapi")) {
      return testFilename.startsWith("/") ? testFilename : `/${testFilename}`;
    }
  }
  return nodeValue;
}

module.exports = linkOpenApiSpecs;
