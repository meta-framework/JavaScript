/*
@identifier test.meta.script.Script
@require org.meta.data.collections.LinkedList, org.meta.data.collections.RingStack, org.meta.data.collections.RingQueue
@description An application testing the Script object.
*/
{
		global: {
				create: function create( )
				{
// console.log('test.Application::create') ;
					// definitions
					
					var Structure ;
						Structure = define('org.meta.script.Structure', {
								main: function main(components)
								{
										this.components = components ;
								},
								local:
								{
										/**@type Array*/
										components: null
								}
						}) ;

					var Component ;
						Component = define('org.meta.script.Component', { // may be atomic or structured
						}) ;

					var File ;
						File = define('org.meta.script.File', {
								extend: Structure
						}) ;

					var	Script ;
						Script = define('org.meta.script.Script', {
								main: function main(input) { this.input = input ; },
								global:
								{
										NUL: '\0',
										LEFT_BRACE: '{',
										RIGHT_BRACE: '}',
										LEFT_BRACKET: '[',
										RIGHT_BRACKET: ']',
										BACKSLASH: '\\', // single character escape
										BACKTICK: '`', // symbolic sequence escape
										COMMA: ',',
										PIPE: '|',
										HASH: '#',
										TOKEN_NUL: 0,
										TOKEN_LEFT_BRACE: 1,
										TOKEN_RIGHT_BRACE: 2,
										TOKEN_LEFT_BRACKET: 3,
										TOKEN_RIGHT_BRACKET: 4,
										TOKEN_BACKSLASH: 5,
										TOKEN_BACKTICK: 6,
										TOKEN_COMMA: 7,
										TOKEN_HASH: 8,
										TOKEN_BREAK: 9,
										TOKEN_SPACE: 10,
										TOKEN_WORD: 11,
										ENTITY_SYMBOLIC_GROUP: 0,
										ENTITY_SYMBOLIC_SEQUENCE: 1,
										ENTITY_STRUCTURE: 2,
										ENTITY_TOKEN_ESCAPE: 3,
										ENTITY_COMMENT: 4,
										ENTITY_BLOCK_COMMENT: 5,
										create: function create(input)
										{
												return new this(input) ;
										}
								},
								local:
								{
										file: null,
										input: null,
										/**@deprecated*/
										_isEscaped: function isEscaped(index)
										{
										
											//
										
												return this.lookBehind(index, 1) === Script.TOKEN_ESCAPE ;
										},
										/**@deprecated*/
										_lookBehind: function lookBehind(index, width)
										{
										
											//
										
												if(index >= width) return this.input.charAt(index - width) ;
										
												return null ;

										},
										/**@deprecated*/
										_lookAhead: function lookAhead(index, width)
										{
										
											// variables
										
											var i ;
										
											//
										
												if((i = index + width) < this.input.length) return this.input.charAt(i) ;
										
												return null ;

										},
										tokenize: function tokenize( )
										{
										
											// variables
										
											var stack,
												head,
												index = -1, length = this.input.length ;
										
											//
										
												stack = RingQueue.create( ) ;

												/*Tokenize the input.*/
												while(++index < length)
														switch(this.input.charAt(index))
														{
																case Script.LEFT_BRACE: stack.push({type: Script.TOKEN_LEFT_BRACE, begin: index, end: index}) ; break ;
																case Script.RIGHT_BRACE: stack.push({type: Script.TOKEN_RIGHT_BRACE, begin: index, end: index}) ;	break ;
																case Script.LEFT_BRACKET: stack.push({type: Script.TOKEN_LEFT_BRACKET, begin: index, end: index}) ; break ;
																case Script.RIGHT_BRACKET: stack.push({type: Script.TOKEN_RIGHT_BRACKET, begin: index, end: index}) ; break ;
																case Script.BACKSLASH: stack.push({type: Script.TOKEN_BACKSLASH, begin: index, end: index}) ;	break ;
																case Script.BACKTICK: stack.push({type: Script.TOKEN_BACKTICK, begin: index, end: index}) ; break ;
																case Script.COMMA: stack.push({type: Script.TOKEN_COMMA, begin: index, end: index}) ; break ;
																case Script.PIPE: stack.push({type: Script.TOKEN_PIPE, begin: index, end: index}) ; break ;
																case Script.HASH: stack.push({type: Script.TOKEN_HASH, begin: index, end: index}) ; break ;
																default:
										
																		switch(this.input.charCodeAt(index))
																		{
																				/*Line breaks.*/
																				case 0x0009: case 0x000A: case 0x000B: case 0x00C: case 0x000D: case 0x0085:
																						if((head = stack.head( )) && head.type === Script.TOKEN_BREAK) head.end = index ;
																						else stack.push({type: Script.TOKEN_BREAK, begin: index, end: index}) ;
																				break ;
																				/*Other whitespace.*/
																				case 0x0020: case 0x00A0: case 0x1680: case 0x2000: case 0x2001: case 0x2002: case 0x2003: case 0x2004: case 0x2005: case 0x2006: case 0x2007:
																				case 0x2008: case 0x2009: case 0x200A: case 0x2028: case 0x2029: case 0x202F: case 0x205F: case 0x3000:
																						if((head = stack.head( )) && head.type === Script.TOKEN_SPACE) head.end = index ;
																						else stack.push({type: Script.TOKEN_SPACE, begin: index, end: index}) ;
																				break ;
																				default:
																						if((head = stack.head( )) && head.type === Script.TOKEN_WORD) head.end = index ;
																						else stack.push({type: Script.TOKEN_WORD, begin: index, end: index}) ;

																		}

														}

											// return
										
											return stack ;

										},
										/**
										* @link http://en.wikipedia.org/wiki/Whitespace_character (whitespace unicode points)
										*/
										parse: function parse( )
										{
										
											// variables
										
											var entities, tokens,
												current, top, previous,
												type,
												children ;

											//
										
												entities = RingStack.create( ) ;
												entities.push({type: Script.ENTITY_SYMBOLIC_GROUP, begin: 0, end: this.input.length, children: [ ]}) ;

												tokens = this.tokenize( ) ;
												tokens.iterator( )
												.forEach(function(token, index) {

switch(token.type)
{

	case Script.TOKEN_NUL: out('token #%s: %s', index, '\\0') ; break ;
	case Script.TOKEN_LEFT_BRACE: out('token #%s: %s', index, '{') ; break ;
	case Script.TOKEN_RIGHT_BRACE: out('token #%s: %s', index, '}') ; break ;
	case Script.TOKEN_LEFT_BRACKET: out('token #%s: %s', index, '[') ; break ;
	case Script.TOKEN_RIGHT_BRACKET: out('token #%s: %s', index, ']') ; break ;
	case Script.TOKEN_BACKSLASH: out('token #%s: %s', index, '\\') ; break ;
	case Script.TOKEN_BACKTICK: out('token #%s: %s', index, '`') ; break ;
	case Script.TOKEN_COMMA: out('token #%s: %s', index, ',') ; break ;
	case Script.TOKEN_HASH: out('token #%s: %s', index, '#') ; break ;
	case Script.TOKEN_BREAK: out('token #%s: %s', index, '<break>') ; break ;
	case Script.TOKEN_SPACE: out('token #%s: %s', index, '<space>') ; break ;
	case Script.TOKEN_WORD: out('token #%s: "%s"', index, this.input.substring(token.begin, token.end + 1)) ; break ;

}
														
														switch((top = entities.top( )))
														{
														
																case Script.Entity_SYMBOLIC_GROUP:
																		switch(token.type)
																		{
																				/*Switch context when reaching these tokens.*/
																				case Script.TOKEN_LEFT_BRACE:
																						entities.push({type: Script.ENTITY_STRUCTURE}) ;
																				break ;
																				case Script.TOKEN_BACKSLASH:
																						entities.push({type: Script.ENTITY_TOKEN_ESCAPE}) ;
																				break ;
																				/*Terminators.*/
																				case Script.TOKEN_NUL:
																						if(token.end !== length - 1) throw new SyntaxError('Invalid Token (type=NUL, index=%s)', token.begin) ;
																				break ;
														
																		}
																break ;
														
														}

												}, this) ;

										},
										run: function run(scope)
										{
												return null ;
										}
								}
						}) ;
								
					
					// variables
					
					
					var script ;
					
						script = Script.create(
								"{define `hello {{``english} {} {[Hello world!]}} # default to english \n {{``french} {[Salut le monde!]}} {{``german} {[Hallo Welt!]}} {{[Saluton Mundo!]}}}"
								+ "<!DOCTYPE html>"
								+ "<html>"
								+ "<head><title>{hello}</title></head>"
								+ "<body><p>{hello}</p></body>"
								+ "</html>"
						) ;
					
						script.parse( ) ;
						script.run({language: 'french'}) ;
					
				}
		}
}