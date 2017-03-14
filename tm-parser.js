var tree = [],
	debug = function (msg) {
		console.log('DEBUG: ' + msg)
	},
	error = function (errorMessage) {
		console.log('ERROR: ' + errorMessage)
		throw errorMessage
	}

function parse(input) {
	var state = 'whitespace', /* comment, token, whitespace, string */
		i = 0,
		c,
		len = input.length,
		prev = null,
		next = null,
		stack = [],
		isInsideString = false,
		isInsideMLString = false,
		lineIndent = '',
		insideLineIndent = false,
		multilineIndent = '',
		token = null;

	tree.splice(0, tree.length)
	stack.push(tree)
	function invalidSyntax() {
		error('Syntax error at ' + input.substring(0, i))
	}
	function inWhiteSpace() {
		if(!isInsideString) {
			endToken()
			(state != 'comment') ? state = 'whitespace' : null
		} else {
			appendToToken(c)
		}
	}
	function startList() {
		if(state == 'comment') return
		endToken()
		var newNode = []
		if(stack.length<1) invalidSyntax()
		stack[stack.length-1].push(newNode)
		stack.push(newNode)
	}
	function endList() {
		if(state == 'comment') return;
		endToken()
		stack.pop()
	}
	function appendToToken(c) {
		if(state == 'whitespace') {
			token = []
			state = 'token'
		}
		if(state == 'token' && c) token.push(c)
	}
	function endToken() {
		if(state == 'token') {
			stack[stack.length-1].push(token.join(''))
			token = []
			state = 'whitespace'
			isInsideString = false
			isInsideMLString = false
		}
	}
	function startComment() {
		endToken()
		state = 'comment'
	}
	function endComment() {
		state = 'whitespace'
	}
	function inString(c) {
		if(state == 'token') endToken(); else {
			isInsideString = true
			appendToToken()
		}
	}
	function startMultiLineString(c) {
		endToken()
		isInsideMLString = true
		multilineIndent = lineIndent
	}
	function stopMultiLineString(c) {
		endToken()
		isInsideMLString = false
		// Fix indents
		var multilineToken = stack[stack.length-1][stack[stack.length-1].length-1].split('\n').map(function (line) {
				if(line.indexOf(multilineIndent) == 0) {
					return line.substring(multilineIndent.length)
				} else {
					return line
				}
			})

		stack[stack.length-1][stack[stack.length-1].length-1] = multilineToken.join('\n')
	}
	for(; i<len; i++) {
		c = input[i];
		next = (i<len-1) ? input[i+1] : null;
		(c == '>' && prev == '%') ? stopMultiLineString(c) :
		(isInsideMLString && (c == '(' || c == ')' || c == '\\' || c == ' ' || c == '\t' || c == '\n' || c == '\r' || c == '\'' || c == '"')) ? appendToToken(c) :
		(c == '*' && prev == '/') ? startComment() :
		(c == '/' && prev == '*') ? endComment() :
		(c == ' ' || c == '\t' || c == '\n' || c == '\r') ? inWhiteSpace(c) :
		(c == '(' && prev != '\\') ? startList() :
		(c == ')' && prev != '\\') ? endList() :
		(c == '\'' && prev != '\\') ? inString(c) :
		(c == '%' && prev == '<') ? startMultiLineString(c) :
		(c == '/' && next == '*') ? null :
		(c == '*' && next == '/') ? null :
		(c == '\\' && prev != '\\') ? null :
		(c == '<' && next == '%') ? null :
		(c == '%' && next == '>') ? null :
		appendToToken(c);
		if(c == '\n') {
			lineIndent = ''
			insideLineIndent = true
		} else if(insideLineIndent && c == ' ' || c == '\t') {
			lineIndent += c
		} else {
			insideLineIndent = false
		}
		prev = c
	}
	return tree
}
module.exports.parse = parse
module.exports.tree = tree
