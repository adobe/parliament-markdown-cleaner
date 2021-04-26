/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const linkOpenApiSpecs = require("../linkOpenApiSpecs");

const cwd = process.cwd();

describe("linkOpenApiSpecs", () => {
  it("is truthy", () => {
    expect(linkOpenApiSpecs).toBeTruthy();
  });
  it("OpenAPI spec in same folder", () => {
    const value = linkOpenApiSpecs(
      "openapi.json",
      `${cwd}/src/__tests__/__fixtures__/linkOpenApiSpecs/linkopenapispecs.md`,
      `${cwd}`
    );
    expect(value).toBe(
      `/src/__tests__/__fixtures__/linkOpenApiSpecs/openapi.json`
    );
  });
  it("Not OpenAPI spec in same folder", () => {
    const value = linkOpenApiSpecs(
      "notopenapi.json",
      `${cwd}/src/__tests__/__fixtures__/linkOpenApiSpecs/linkopenapispecs.md`,
      `${cwd}`
    );
    expect(value).toBe(`notopenapi.json`);
  });
  it("OpenAPI spec in sub folder", () => {
    const value = linkOpenApiSpecs(
      "subfolder/openapi.json",
      `${cwd}/src/__tests__/__fixtures__/linkOpenApiSpecs/linkopenapispecs.md`,
      `${cwd}`
    );
    expect(value).toBe(
      `/src/__tests__/__fixtures__/linkOpenApiSpecs/subfolder/openapi.json`
    );
  });
  it("OpenAPI spec in relative sub folder", () => {
    const value = linkOpenApiSpecs(
      "./subfolder/openapi.json",
      `${cwd}/src/__tests__/__fixtures__/linkOpenApiSpecs/linkopenapispecs.md`,
      `${cwd}`
    );
    expect(value).toBe(
      `/src/__tests__/__fixtures__/linkOpenApiSpecs/subfolder/openapi.json`
    );
  });
  it("OpenAPI spec in absolute sub folder", () => {
    const value = linkOpenApiSpecs(
      "/src/__tests__/__fixtures__/linkOpenApiSpecs/subfolder/openapi.json",
      `${cwd}/src/__tests__/__fixtures__/linkOpenApiSpecs/linkopenapispecs.md`,
      `${cwd}`
    );
    expect(value).toBe(
      `/src/__tests__/__fixtures__/linkOpenApiSpecs/subfolder/openapi.json`
    );
  });
});
