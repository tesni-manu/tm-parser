var chai = require('chai'),
	expect = chai.expect;
	tmParser = require('./tm-parser'),
	testCases = [
		[
			"",
			undefined
		],
		[
			"()",
			[]
		],
		[
			"(a)",
			[
				"a"
			]
		],
		[
			"(a b)",
			[
				"a",
				"b"
			]
		],
		[
			"(a b ())",
			[
				"a",
				"b",
				[]
			]
		],
		[
			"(a b (c))",
			[
				"a",
				"b",
				[
					"c"
				]
			]
		],
		[
			"(a b (c (a b (c))))",
			[
				"a",
				"b",
				[
					"c",
					[
						"a",
						"b",
						[
							"c"
						]
					]
				]
			]
		],
		[
			"(a 'b c')",
			[
				"a",
				"b c"
			]
		],
		[
			"(a 'b \\'c')",
			[
				"a",
				"b 'c"
			]
		],
		[
			"(a 'b \"c')",
			[
				"a",
				"b \"c"
			]
		],
		[
			"(a 'b \\(c')",
			[
				"a",
				"b (c"
			]
		],
		[
			"(a 'b \\(a\\)c')",
			[
				"a",
				"b (a)c"
			]
		],
		[
			"(a <%b '()\"c%>)",
			[
				"a",
				"b '()\"c"
			]
		],
		[
			"(a <%b '()\"\nc%>)",
			[
				"a",
				"b '()\"\nc"
			]
		],
		[
			"(a <%b '()\"c%>) /* Comment */",
			[
				"a",
				"b '()\"c"
			]
		],
		[
			"(a /* Comment */ <%b '()\"c%>)",
			[
				"a",
				"b '()\"c"
			]
		],
		[
			"(a /* Multi-line \n Comment */ <%b '()\"c%>)",
			[
				"a",
				"b '()\"c"
			]
		],
		[
			"(x y z (1 2) 'Hello World' <%String with ' ( ), no need to escape anything!%>)",
			[
				"x",
				"y",
				"z",
				[
					"1",
					"2"
				],
				"Hello World",
				"String with ' ( ), no need to escape anything!"
			]
		]
	];

describe('TM Parser:', function () {
	testCases.forEach(function(testCase) {
		it('should parse ' + testCase[0], function () {
			var parserOutput = JSON.stringify(tmParser.parse(testCase[0])[0]);
			var expectedOutput = JSON.stringify(testCase[1]);
			expect(parserOutput).to.equal(expectedOutput);
		});
	});
});