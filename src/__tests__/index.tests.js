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

const downloadRemoteImages = require("../downloadRemoteImages");
const linkOpenApiSpecs = require("../linkOpenApiSpecs");
const addLineBreaks = require("../addLineBreaks");
const cleanHtmlNodes = require("../cleanHtmlNodes");

const cwd = process.cwd();

describe("cleanHtmlNodes", () => {
  it("is truthy", () => {
    expect(cleanHtmlNodes).toBeTruthy();
  });
  it("does not clean Newton Button tags", () => {
    const value = cleanHtmlNodes(`<newtonbutton recipe="test" />`, []);
    expect(value).toBe(`<newtonbutton recipe="test" />`);
  });
  it("does not clean JSON Schema tags", () => {
    const value = cleanHtmlNodes(`<jsonschema spec="{}" />`, []);
    expect(value).toBe(`<jsonschema spec="{}" />`);
  });
});

describe("downloadRemoteImages", () => {
  it("is truthy", () => {
    expect(downloadRemoteImages).toBeTruthy();
  });
  it("Domains on allow list to remain unchanged", () => {
    const value = downloadRemoteImages(
      "https://img.shields.io/static/v1?label=Audience&message=Anyone&color=red",
      `${cwd}/src/__tests__/__fixtures__/downloadRemoteImages/downloadRemoteImages.md`
    );
    expect(value).toBe(
      `https://img.shields.io/static/v1?label=Audience&message=Anyone&color=red`
    );
  });
});

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

describe("addLineBreaks", () => {
  it("is truthy", () => {
    expect(addLineBreaks).toBeTruthy();
  });
  it("Leaves closed col untouched", () => {
    const value = addLineBreaks("<col />");
    expect(value).toBe("<col />");
  });
  it("Leaves closed col with style untouched", () => {
    const value = addLineBreaks(`<col style="width: 100px;"/>`);
    expect(value).toBe(`<col style="width: 100px;"/>`);
  });
  it("Closes open cols", () => {
    const value = addLineBreaks("<col>");
    expect(value).toBe("<col/>");
  });
  it("Closes open cols with style", () => {
    const value = addLineBreaks(`<col style="width: 100px;">`);
    expect(value).toBe(`<col style="width: 100px;"/>`);
  });
  it("Ignores colgroup", () => {
    const value = addLineBreaks(`<colgroup>`);
    expect(value).toBe(`<colgroup>`);
  });
  it("Ignores closing colgroup", () => {
    const value = addLineBreaks(`</colgroup>`);
    expect(value).toBe(`</colgroup>`);
  });
  it("Ignores string with col in it", () => {
    const value = addLineBreaks(`Why would one say col in a sentence?`);
    expect(value).toBe(`Why would one say col in a sentence?`);
  });
  it("Ignores string with colgroup in it", () => {
    const value = addLineBreaks(`Why would one say colgroup in a sentence?`);
    expect(value).toBe(`Why would one say colgroup in a sentence?`);
  });
  it("Embedded in table", () => {
    const value = addLineBreaks(
      `<table class="wrapped"><colgroup><col> <col> </colgroup><tbody><tr><th>Team</th><th>Changes</th></tr><tr><td><div class="content-wrapper">Offer Definition &amp; Mgmt. ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274d7c5915"></ri:user></ac:link>)</div></td><td><ul><li>Enable the specification of FIGs in SSOCM.</li><li><s>Changes to Contract Offers service to support new AOS exchange model.</s></li></ul></td></tr><tr><td><div class="content-wrapper">Core Data Services ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726b8901871"></ri:user></ac:link>)</div></td><td><ul><li>MCS: support for FIG merchandising</li><li>FIGs: new API for fulfillable item groups</li><li><s>PAS: convert existing product arrangements to incorporate FIGs</s></li><li><s>PAS: convert existing product arrangements to use the new FI model</s></li><li><s>PAS: support both old and new domain model in parallel</s></li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Fulfillment Gateway ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc72730a032d9"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li><s>Add&nbsp;<em>fulfillable_group_id</em>&nbsp;and&nbsp;<em>fulfillable_group_version</em>&nbsp;to the&nbsp;<em>internal_fulfillment_needed event</em>, as detailed in the&nbsp;<a href="https://wiki.corp.adobe.com/display/platformsvcs/Fulfillment+Gateway#FulfillmentGateway-AsynchronousFulfillmentforInternalRequestors">Fulfillment Gateway spec</a>.</s></li><li>Add the FI instance id to the FN and IFN events. Required to support the use case where the same FI is instantiated in an offer multiple times.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Licensing ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc727250d24ad"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li>Retrieve FIG info for each offer in the IFN event.</li><li>Create licenses for each FIG in the Internal Fulfillment Needed event. <em>Note: this work is not described in this specification.</em></li><li><ac:inline-comment-marker ac:ref="fdcfb598-9fe0-4529-91b7-30d9851c0ddc">Expectation is that the license will include the FIG ID and any FIG attributes</ac:inline-comment-marker>.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Admin Console ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ea1f626a"></ri:user></ac:link>)</div></td><td colspan="1"><div class="content-wrapper"><ul><li>Support attributes on licensing FIGs. Specifically:<ul><li>Change products API to include the FIG attributes in the response.</li><li>Change products API to retrieve merchandising for the FIG (using the FIG ID) from the FIGs service.</li><li>Change Admin Console to use the new attributes in the products API to drive delegation, etc.</li></ul></li><li>Purchasing (add quantity and renewals).<ul><li>PdM ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ae4c0a34"></ri:user></ac:link>) to consider how to best handle FIGs in the context of Admin purchasing.</li><li>Relevant for VIP &amp; Team Direct (i.e. RTMs where admins have this capability in Admin Console).</li></ul></li></ul></div></td></tr><tr><td colspan="1"><div class="content-wrapper">AAUI ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726d0883945"></ri:user></ac:link>)</div></td><td colspan="1">TBD</td></tr><tr><td colspan="1">Provisioning Hub ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274a2b5397"></ri:user></ac:link>)</td><td colspan="1"><ul><li>Enable FI configuration in the context of FIGs. This is required for the edge case wherein an FI is instantiated in an offer multiple times. Without this change, it won't be possible for CTP to know which instance of an FI is being configured.</li></ul></td></tr></tbody></table>`
    );
    expect(value).toBe(
      `<table class="wrapped"><colgroup><col/> <col/> </colgroup><tbody><tr><th>Team</th><th>Changes</th></tr><tr><td><div class="content-wrapper">Offer Definition &amp; Mgmt. ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274d7c5915"></ri:user></ac:link>)</div></td><td><ul><li>Enable the specification of FIGs in SSOCM.</li><li><s>Changes to Contract Offers service to support new AOS exchange model.</s></li></ul></td></tr><tr><td><div class="content-wrapper">Core Data Services ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726b8901871"></ri:user></ac:link>)</div></td><td><ul><li>MCS: support for FIG merchandising</li><li>FIGs: new API for fulfillable item groups</li><li><s>PAS: convert existing product arrangements to incorporate FIGs</s></li><li><s>PAS: convert existing product arrangements to use the new FI model</s></li><li><s>PAS: support both old and new domain model in parallel</s></li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Fulfillment Gateway ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc72730a032d9"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li><s>Add&nbsp;<em>fulfillable_group_id</em>&nbsp;and&nbsp;<em>fulfillable_group_version</em>&nbsp;to the&nbsp;<em>internal_fulfillment_needed event</em>, as detailed in the&nbsp;<a href="https://wiki.corp.adobe.com/display/platformsvcs/Fulfillment+Gateway#FulfillmentGateway-AsynchronousFulfillmentforInternalRequestors">Fulfillment Gateway spec</a>.</s></li><li>Add the FI instance id to the FN and IFN events. Required to support the use case where the same FI is instantiated in an offer multiple times.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Licensing ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc727250d24ad"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li>Retrieve FIG info for each offer in the IFN event.</li><li>Create licenses for each FIG in the Internal Fulfillment Needed event. <em>Note: this work is not described in this specification.</em></li><li><ac:inline-comment-marker ac:ref="fdcfb598-9fe0-4529-91b7-30d9851c0ddc">Expectation is that the license will include the FIG ID and any FIG attributes</ac:inline-comment-marker>.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Admin Console ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ea1f626a"></ri:user></ac:link>)</div></td><td colspan="1"><div class="content-wrapper"><ul><li>Support attributes on licensing FIGs. Specifically:<ul><li>Change products API to include the FIG attributes in the response.</li><li>Change products API to retrieve merchandising for the FIG (using the FIG ID) from the FIGs service.</li><li>Change Admin Console to use the new attributes in the products API to drive delegation, etc.</li></ul></li><li>Purchasing (add quantity and renewals).<ul><li>PdM ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ae4c0a34"></ri:user></ac:link>) to consider how to best handle FIGs in the context of Admin purchasing.</li><li>Relevant for VIP &amp; Team Direct (i.e. RTMs where admins have this capability in Admin Console).</li></ul></li></ul></div></td></tr><tr><td colspan="1"><div class="content-wrapper">AAUI ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726d0883945"></ri:user></ac:link>)</div></td><td colspan="1">TBD</td></tr><tr><td colspan="1">Provisioning Hub ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274a2b5397"></ri:user></ac:link>)</td><td colspan="1"><ul><li>Enable FI configuration in the context of FIGs. This is required for the edge case wherein an FI is instantiated in an offer multiple times. Without this change, it won't be possible for CTP to know which instance of an FI is being configured.</li></ul></td></tr></tbody></table>`
    );
  });
  it("Embedded in table with style", () => {
    const value = addLineBreaks(
      `<table class="wrapped"><colgroup><col style="width: 100px;"> <col style="width: 200px;"> </colgroup><tbody><tr><th>Team</th><th>Changes</th></tr><tr><td><div class="content-wrapper">Offer Definition &amp; Mgmt. ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274d7c5915"></ri:user></ac:link>)</div></td><td><ul><li>Enable the specification of FIGs in SSOCM.</li><li><s>Changes to Contract Offers service to support new AOS exchange model.</s></li></ul></td></tr><tr><td><div class="content-wrapper">Core Data Services ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726b8901871"></ri:user></ac:link>)</div></td><td><ul><li>MCS: support for FIG merchandising</li><li>FIGs: new API for fulfillable item groups</li><li><s>PAS: convert existing product arrangements to incorporate FIGs</s></li><li><s>PAS: convert existing product arrangements to use the new FI model</s></li><li><s>PAS: support both old and new domain model in parallel</s></li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Fulfillment Gateway ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc72730a032d9"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li><s>Add&nbsp;<em>fulfillable_group_id</em>&nbsp;and&nbsp;<em>fulfillable_group_version</em>&nbsp;to the&nbsp;<em>internal_fulfillment_needed event</em>, as detailed in the&nbsp;<a href="https://wiki.corp.adobe.com/display/platformsvcs/Fulfillment+Gateway#FulfillmentGateway-AsynchronousFulfillmentforInternalRequestors">Fulfillment Gateway spec</a>.</s></li><li>Add the FI instance id to the FN and IFN events. Required to support the use case where the same FI is instantiated in an offer multiple times.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Licensing ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc727250d24ad"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li>Retrieve FIG info for each offer in the IFN event.</li><li>Create licenses for each FIG in the Internal Fulfillment Needed event. <em>Note: this work is not described in this specification.</em></li><li><ac:inline-comment-marker ac:ref="fdcfb598-9fe0-4529-91b7-30d9851c0ddc">Expectation is that the license will include the FIG ID and any FIG attributes</ac:inline-comment-marker>.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Admin Console ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ea1f626a"></ri:user></ac:link>)</div></td><td colspan="1"><div class="content-wrapper"><ul><li>Support attributes on licensing FIGs. Specifically:<ul><li>Change products API to include the FIG attributes in the response.</li><li>Change products API to retrieve merchandising for the FIG (using the FIG ID) from the FIGs service.</li><li>Change Admin Console to use the new attributes in the products API to drive delegation, etc.</li></ul></li><li>Purchasing (add quantity and renewals).<ul><li>PdM ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ae4c0a34"></ri:user></ac:link>) to consider how to best handle FIGs in the context of Admin purchasing.</li><li>Relevant for VIP &amp; Team Direct (i.e. RTMs where admins have this capability in Admin Console).</li></ul></li></ul></div></td></tr><tr><td colspan="1"><div class="content-wrapper">AAUI ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726d0883945"></ri:user></ac:link>)</div></td><td colspan="1">TBD</td></tr><tr><td colspan="1">Provisioning Hub ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274a2b5397"></ri:user></ac:link>)</td><td colspan="1"><ul><li>Enable FI configuration in the context of FIGs. This is required for the edge case wherein an FI is instantiated in an offer multiple times. Without this change, it won't be possible for CTP to know which instance of an FI is being configured.</li></ul></td></tr></tbody></table>`
    );
    expect(value).toBe(
      `<table class="wrapped"><colgroup><col style="width: 100px;"/> <col style="width: 200px;"/> </colgroup><tbody><tr><th>Team</th><th>Changes</th></tr><tr><td><div class="content-wrapper">Offer Definition &amp; Mgmt. ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274d7c5915"></ri:user></ac:link>)</div></td><td><ul><li>Enable the specification of FIGs in SSOCM.</li><li><s>Changes to Contract Offers service to support new AOS exchange model.</s></li></ul></td></tr><tr><td><div class="content-wrapper">Core Data Services ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726b8901871"></ri:user></ac:link>)</div></td><td><ul><li>MCS: support for FIG merchandising</li><li>FIGs: new API for fulfillable item groups</li><li><s>PAS: convert existing product arrangements to incorporate FIGs</s></li><li><s>PAS: convert existing product arrangements to use the new FI model</s></li><li><s>PAS: support both old and new domain model in parallel</s></li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Fulfillment Gateway ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc72730a032d9"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li><s>Add&nbsp;<em>fulfillable_group_id</em>&nbsp;and&nbsp;<em>fulfillable_group_version</em>&nbsp;to the&nbsp;<em>internal_fulfillment_needed event</em>, as detailed in the&nbsp;<a href="https://wiki.corp.adobe.com/display/platformsvcs/Fulfillment+Gateway#FulfillmentGateway-AsynchronousFulfillmentforInternalRequestors">Fulfillment Gateway spec</a>.</s></li><li>Add the FI instance id to the FN and IFN events. Required to support the use case where the same FI is instantiated in an offer multiple times.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Licensing ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc727250d24ad"></ri:user></ac:link>)</div></td><td colspan="1"><ul><li>Retrieve FIG info for each offer in the IFN event.</li><li>Create licenses for each FIG in the Internal Fulfillment Needed event. <em>Note: this work is not described in this specification.</em></li><li><ac:inline-comment-marker ac:ref="fdcfb598-9fe0-4529-91b7-30d9851c0ddc">Expectation is that the license will include the FIG ID and any FIG attributes</ac:inline-comment-marker>.</li></ul></td></tr><tr><td colspan="1"><div class="content-wrapper">Admin Console ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ea1f626a"></ri:user></ac:link>)</div></td><td colspan="1"><div class="content-wrapper"><ul><li>Support attributes on licensing FIGs. Specifically:<ul><li>Change products API to include the FIG attributes in the response.</li><li>Change products API to retrieve merchandising for the FIG (using the FIG ID) from the FIGs service.</li><li>Change Admin Console to use the new attributes in the products API to drive delegation, etc.</li></ul></li><li>Purchasing (add quantity and renewals).<ul><li>PdM ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726ae4c0a34"></ri:user></ac:link>) to consider how to best handle FIGs in the context of Admin purchasing.</li><li>Relevant for VIP &amp; Team Direct (i.e. RTMs where admins have this capability in Admin Console).</li></ul></li></ul></div></td></tr><tr><td colspan="1"><div class="content-wrapper">AAUI ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc726d0883945"></ri:user></ac:link>)</div></td><td colspan="1">TBD</td></tr><tr><td colspan="1">Provisioning Hub ( <ac:link><ri:user ri:userkey="8a85e88f4dc725cc014dc7274a2b5397"></ri:user></ac:link>)</td><td colspan="1"><ul><li>Enable FI configuration in the context of FIGs. This is required for the edge case wherein an FI is instantiated in an offer multiple times. Without this change, it won't be possible for CTP to know which instance of an FI is being configured.</li></ul></td></tr></tbody></table>`
    );
  });
});
