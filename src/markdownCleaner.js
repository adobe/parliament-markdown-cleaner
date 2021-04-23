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

const addLineBreaks = require("./addLineBreaks");
const cleanHtmlNodes = require("./cleanHtmlNodes");
const extractBase64Images = require("./extractBase64Images");
const jekyllLinks = require("./jekyllLinks");
const downloadRemoteImages = require("./downloadRemoteImages");
const linkOpenApiSpecs = require("./linkOpenApiSpecs");

module.exports = markdownCleaner;

function markdownCleaner(
  cleaningOption,
  pluginOptionTags = [],
  filePath,
  rootFolder
) {
  return cleanMarkdown;
  function cleanMarkdown(node) {
    const type = node && node.type;
    if (type === `html`) {
      let nodeValue;
      if (cleaningOption === "addLineBreaks") {
        nodeValue = addLineBreaks(node.value);
      } else {
        nodeValue = cleanHtmlNodes(node.value, pluginOptionTags);
      }
      try {
        node.value = nodeValue;
      } catch (e) {
        throw Error(`${e.message}`);
      }
    } else if (type === `image`) {
      if (cleaningOption === "cleanHtmlNodes") {
        if (node.url.startsWith("data:")) {
          try {
            node.url = extractBase64Images(node.url, filePath);
          } catch (e) {
            throw Error(`${e.message}`);
          }
        } else if (
          node.url.startsWith("http://") ||
          node.url.startsWith("https://")
        ) {
          try {
            node.url = downloadRemoteImages(node.url, filePath);
          } catch (e) {
            throw Error(`${e.message}`);
          }
        }
      }
    } else if (type === `link` && cleaningOption === "cleanHtmlNodes") {
      try {
        node.url = jekyllLinks(node.url, filePath);
      } catch (e) {
        throw Error(`${e.message}`);
      }
      try {
        node.url = linkOpenApiSpecs(node.url, filePath, rootFolder);
      } catch (e) {
        throw Error(`${e.message}`);
      }
    } else if (type !== "code" && type !== "inlineCode") {
      // if the node is not html convert < and > to &lt; and &gt;
      if (node.value) {
        try {
          node.value = node.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        } catch (e) {
          throw Error(`${e.message}`);
        }
      }
    }
    if (node.children) {
      let nodes = [];
      for (const childNode of node.children) {
        let cleanedNode = cleanMarkdown(childNode);
        nodes.push(cleanedNode);
      }
      node.children = nodes;
    }
    return node;
  }
}
