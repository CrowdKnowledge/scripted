/*******************************************************************************
 * @license
 * Copyright (c) 2012 VMware, Inc. All Rights Reserved.
 * THIS FILE IS PROVIDED UNDER THE TERMS OF THE ECLIPSE PUBLIC LICENSE
 * ("AGREEMENT"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS FILE
 * CONSTITUTES RECIPIENTS ACCEPTANCE OF THE AGREEMENT.
 * You can obtain a current copy of the Eclipse Public License from
 * http://www.opensource.org/licenses/eclipse-1.0.php
 *
 * Contributors:
 *     Andrew Eisenberg (VMware) - initial API and implementation
 ******************************************************************************/

// Tests for scripted-completions files

define(['orion/assert', 'scripted/editor/templateContentAssist', 'tests/client/common/testutils', 'jquery'], 
function(assert, mTemplates, mTestutils) {
	var testResourcesRoot = mTestutils.discoverTestRoot() + "completions/";
	
	
	// tests:
	
	// test that we get the same number of proposals on each call even after getting new ones
	
	// test proposals look the way we expect
	// test that proposals exist that we expect and don't exist when we don't expect
	
	var tests = {};
	
	// ensure that loading and reloading templates don't explode the number of templates
	tests.asyncTestLoadProposals1 = function() {
		mTemplates._reset();
		var templateCA = new mTemplates.TemplateContentAssist();
		templateCA.install(null, "json", testResourcesRoot).then(
			function(templates) {
				assert.equal(templates.length, 7, "Should have found 7 templates for json files");
				assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 7 templates for json files");
				assert.ok(!mTemplates._getAllTemplates()['html'], "Should have not have any html templates");
				templateCA.install(null, "json").then(
					function(templates, testResourcesRoot) {
						assert.equal(templates.length, 7, "Should have found 7 templates for json files");
						assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 7 templates for json files");
						assert.ok(!mTemplates._getAllTemplates()['html'], "Should have not have any html templates");
						templateCA = new mTemplates.TemplateContentAssist();
						templateCA.install(null, "json", testResourcesRoot).then(
							function(templates) {
								assert.equal(templates.length, 7, "Should have found 7 templates for json files");
								assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 7 templates for json files");
								assert.ok(!mTemplates._getAllTemplates()['html'], "Should have not have any html templates");
								assert.start();
							}
						);
					}
				);
			}
		);
	};
	
	// ensure that loading and reloading templates don't explode the number of templates
	tests.asyncTestLoadProposals2 = function() {
		mTemplates._reset();
		var templateCA = new mTemplates.TemplateContentAssist();
		templateCA.install(null, "json", testResourcesRoot).then(
			function(templates) {
				assert.equal(templates.length, 7, "Should have found 7 templates for json files");
				assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 7 templates for json files");
				assert.ok(!mTemplates._getAllTemplates()['html'], "Should have not have any html templates");
				templateCA.install(null, 'html', testResourcesRoot).then(
					function(templates) {
						assert.equal(templates.length, 5, "Should have found 7 templates for html files");
						assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 9 templates for json files");
						assert.equal(mTemplates._getAllTemplates()['html'].length, 5, "Should have found 5 templates for html files");
						templateCA = new mTemplates.TemplateContentAssist();
						templateCA.install(null, "html", testResourcesRoot).then(
							function(templates) {
								assert.equal(templates.length, 5, "Should have found 7 templates for html files");
								assert.equal(mTemplates._getAllTemplates()['json'].length, 7, "Should have found 9 templates for json files");
								assert.equal(mTemplates._getAllTemplates()['html'].length, 5, "Should have found 5 templates for html files");
								assert.start();
							}
						);
					}
				);
			}
		);
	};
	
	tests.asyncTestComputeProposals1 = function() {
		mTemplates._reset();
		var templateCA = new mTemplates.TemplateContentAssist();
		templateCA.install(null, "json", testResourcesRoot).then(
			function(templates) {
				var buffer = "acronym1";
				var completions = templateCA.computeProposals(buffer, buffer.length, { prefix : buffer } );
				var compl = "bar<acronym></acronym>fooarg3";
				var comp = completions[2]();
				assert.equal(comp.description, "acronym12 : " + compl);
				assert.equal(comp.proposal, compl);
				assert.equal(comp.positions.length, 3, "Should have 3 positions");
				assert.deepEqual(comp.positions[0], {length : "foo".length, offset: compl.indexOf("foo") }, "Should have 2 positions");
				assert.deepEqual(comp.positions[1], {length : "bar".length, offset : compl.indexOf("bar") }, "Should have 2 positions");
				assert.deepEqual(comp.positions[2], {length : "arg3".length, offset : compl.indexOf("arg3") }, "Should have 2 positions");
				assert.equal(comp.escapePosition, compl.indexOf('</'));
				
				comp = completions[4]();
				assert.equal(completions.length, 5, "Find 5 completions");
				assert.equal(comp.description, "acronym14 : $bar");
				assert.equal(comp.proposal, "$bar");
				assert.equal(comp.positions, null, "Should have no positions array");
				
				assert.start();
			}
		);
	};
	
	
	return tests;
});