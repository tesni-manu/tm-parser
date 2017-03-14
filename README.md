# tm-parser
An s expression parser.

Grammar:

<expression> := <token> | <escaped-token> | <string>

<token> is a sequence of characters except whitespace, single quote, open and closing parentheses.
<escaped-token> is a sequence of characters enclosed inside single quotes and can contain whitespaces, single quotes, open and closing parentheses, but they need to be escaped with a back-slash.
<string> is a sequence of characters enclosed inside <% and %>.  All characters except <% and %> are allowed and no characters should be escaped.

To install:
npm install tm-parser

To use:
var tmParser = require('tm-parser'),
	input = "(x y z (1 2) 'Hello World' <%String with ' ( ), no need to escape anything!%>)"

console.log(JSON.stringify(tmParser.parse(input), null, 2))

Output will be:
[
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

