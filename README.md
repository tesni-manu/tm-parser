# tm-parser
An s expression parser.

#### Grammar

{expression} := {item} {whitespace} {expression}

{item} := {token} | {escaped-token} | {string} | **(** {expression} **)**

{token} is a sequence of characters except whitespace, single quote, open and closing parentheses.

{escaped-token} is a sequence of characters enclosed inside single quotes and can contain whitespaces, single quotes, open and closing parentheses, but they need to be escaped with a back-slash.

{string} is a sequence of characters enclosed inside <% and %>.  All characters except <% and %> are allowed and no characters should be escaped. This can contain newline characters.

#### Intallation
```
npm install tm-parser
```

#### Usage
```
var tmParser = require('tm-parser');

var input = "(x y z (1 2) 'Hello World' <%String with ' ( ), no need to escape anything!%>)";

console.log(JSON.stringify(tmParser.parse(input)[0], null, 2));
```

###### Output

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


