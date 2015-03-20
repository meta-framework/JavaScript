/*
@identifier org.meta.script.ScriptTest
@require org.meta.Object, org.meta.data.collections.RingQueue, org.meta.data.collections.RingStack, org.meta.util.StringBuilder
@description An application testing the Script object.
*/
{
		global: {
				create: function create( )
				{
// console.log('test.Application::create') ;
					// definitions

					var Component ;
						Component = define('org.meta.script.Component', { // may be atomic or structured
								extend: org.meta.Object
						}) ;
					
					var Atom ;
						Atom = define('org.meta.script.Atom', {
								extend: Component,
								main: function(value) { this.value = value ; },
								local:
								{
										toString: function toString( ) { return this.value ; }
								}
						}) ;
					
					var Number ;
						Number = define('org.meta.script.Number', {
								extend: Atom
						}) ;
					var Identifier ;
						Identifier = define('org.meta.script.Identifier', {
								extend: Atom
						}) ;
					
					var Word ;
						Word = define('org.meta.script.Word', {
								extend: Atom
						}) ;
					
					var KeyWord ;
						KeyWord = define('org.meta.script.KeyWord', {
								extend: Word
						}) ;
					
					var Comment ;
						Comment = define('org.meta.script.Comment', {
								extend: Atom,
								local:
								{
										toString: function toString( ) { return '#' + this.value + '\n' ; }
								}
						}) ;
					
					var BlockComment ;
						BlockComment = define('org.meta.script.BlockComment', {
								extend: Comment,
								local:
								{
										toString: function toString( ) { return '##' + this.value + '##' ; }
								}
						}) ;

					var Symbol ;
						Symbol = define('org.meta.script.Symbol', {
								extend: Atom,
								local:
								{
										toString: function toString( ) { return '`' + this.value.toString( ) ; }
								}
						}) ;

					var Structure ;
						Structure = define('org.meta.script.Structure', {
								extend: Component,
								main: function main(components)
								{
										this.components = components ;
								},
								local:
								{
										/**@type Array*/
										components: null,
										toString: function toString( )
										{
												
											// variables
											
											var builder ;
											
											//
											
												builder = new StringBuilder('{') ;
												
												if((a = this.components)) a.forEach(function(v) { builder.append(v.toString( )) ; }) ;
												
												builder.append('}') ;
												
											// return
											
												return builder.build( ) ;
												
												
										},
										/**
										* @return (Object) The first component within this structure or null.
										*/
										firstComponent: function firstComponent( ) { if(this.components) return this.components[0] || null ; return null ; },
										addComponent: function addComponent(component) { this.components[this.components.length] = component ; }
								}
						}) ;
					
					var Text ;
						Text = define('org.meta.script.Text', { // @abstract
								extend: Structure
						}) ;

					var File ;
						File = define('org.meta.script.File', {
								extend: Text
						}) ;
					
					var Tuple ;
						Tuple = define('org.meta.script.Tuple', {
								extend: Structure
						}) ;
					
					var List ;
						List = define('org.meta.script.List', {
								extend: Tuple
						}) ;

					var	Script ;
						Script = define('org.meta.script.Script', {
								main: function main(file) { this.file = file ; },
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
										ENTITY_FILE: 0, // a pseudo entity containing the entire input file
										ENTITY_TEXT: 1,
										ENTITY_COMMENT: 2,
										ENTITY_BLOCK_COMMENT: 3,
										ENTITY_TOKEN_ESCAPE: 4,
										ENTITY_SYMBOL_ESCAPE: 5,
										ENTITY_STRUCTURE: 6,
										ENTITY_TOKEN: 7, // all others
/*
										MACRO_DEFINE: 'define',
										MACRO_LAMBDA: 'lambda',
*/
										KEYWORD_DEFINE: 'define',
										KEYWORD_LAMBDA: 'lambda',
										KEYWORD_IF: 'if',
										KEYWORD_WHILE: 'while',
//@deprecated										KEYWORDS: ['define', 'lambda', 'if', 'while', 'for'/*, ...*/],
										create: function create(input)
										{
												return new this(Script.parseInput(input)) ;
										},
										/**
										* @link http://en.wikipedia.org/wiki/Whitespace_character (whitespace unicode points)
										*/
										tokenizeInput: function tokenize(input)
										{
										
											// variables
										
											var queue,
												last,
												index = -1, length = input.length ;
										
											//
										
												queue = RingQueue.create( ) ;

												/*Tokenize the input.*/
												while(++index < length)
														switch(input.charAt(index))
														{
																case Script.TOKEN_NUL: queue.enqueue({type: Script.TOKEN_NUL, begin: index, end: index}) ; break ;
																case Script.LEFT_BRACE: queue.enqueue({type: Script.TOKEN_LEFT_BRACE, begin: index, end: index}) ; break ;
																case Script.RIGHT_BRACE: queue.enqueue({type: Script.TOKEN_RIGHT_BRACE, begin: index, end: index}) ;	break ;
																case Script.LEFT_BRACKET: queue.enqueue({type: Script.TOKEN_LEFT_BRACKET, begin: index, end: index}) ; break ;
																case Script.RIGHT_BRACKET: queue.enqueue({type: Script.TOKEN_RIGHT_BRACKET, begin: index, end: index}) ; break ;
																case Script.BACKSLASH: queue.enqueue({type: Script.TOKEN_BACKSLASH, begin: index, end: index}) ;	break ;
																case Script.BACKTICK: queue.enqueue({type: Script.TOKEN_BACKTICK, begin: index, end: index}) ; break ;
																case Script.COMMA: queue.enqueue({type: Script.TOKEN_COMMA, begin: index, end: index}) ; break ;
																case Script.PIPE: queue.enqueue({type: Script.TOKEN_PIPE, begin: index, end: index}) ; break ;
																case Script.HASH: queue.enqueue({type: Script.TOKEN_HASH, begin: index, end: index}) ; break ;
																default:
										
																		switch(input.charCodeAt(index))
																		{

																				/*Line breaks.*/
																				case 0x0009: case 0x000A: case 0x000B: case 0x00C: case 0x000D: case 0x0085:
																						if((last = queue.last( )) && last.type === Script.TOKEN_BREAK) last.end = index ;
																						else queue.enqueue({type: Script.TOKEN_BREAK, begin: index, end: index}) ;
																				break ;
																				/*Other whitespace.*/
																				case 0x0020: case 0x00A0: case 0x1680: case 0x2000: case 0x2001: case 0x2002: case 0x2003: case 0x2004: case 0x2005: case 0x2006: case 0x2007:
																				case 0x2008: case 0x2009: case 0x200A: case 0x2028: case 0x2029: case 0x202F: case 0x205F: case 0x3000:
																						if((last = queue.last( )) && last.type === Script.TOKEN_SPACE) last.end = index ;
																						else queue.enqueue({type: Script.TOKEN_SPACE, begin: index, end: index}) ;
																				break ;
																				default:
																						if((last = queue.last( )) && last.type === Script.TOKEN_WORD) last.end = index ;
																						else queue.enqueue({type: Script.TOKEN_WORD, begin: index, end: index}) ;

																		}

														}
										
												queue.enqueue({type: Script.TOKEN_NUL, begin: length, end: length}) ; // add the NUL token as a delimiter for the input file

											// return
										
											return queue ;

										},
										/**
										* Parse the input string into a File object.
										*
										* Going down, the stack contains entities; going up, parsed entities are converted to object representations.
										*
										* @return File
										*/
										parseInput: function parseInput(input)
										{

											/* variables */
										
											var entities, tokens,
												token, last, next, // tokens
												current, top,/* previous,*/ // entities
												type, i1, i2,
												children,
												object ;
										
											var nest = function nest(host, entity)
											{
										
												/* variables */
										
												var children ;
										
												/* logic */
										
													if(! (children = host.children)) children = host.children = [ ] ;
										
													children[children.length] = entity ;
										
											} ;

											/* logic */
										
												stack = RingStack.create( ) ;
												stack.push({type: Script.ENTITY_FILE}) ;
												tokens = Script.tokenizeInput(input) ; // tokenize the input string
												iterator = tokens.iterator( ) ;

												token_iterator: while(iterator.hasNext( )) // iterate over the token list
												{

														top = stack.top( ) ;
									
														switch(top.type) // determine entity context
														{

																/*(0) files or text*/
																case Script.ENTITY_FILE:
																case Script.ENTITY_TEXT:

																		token = iterator.next( ) ;

																		switch(token.type) // analyze the next token
																		{
																				/*Context switching tokens.*/
																				case Script.TOKEN_BACKSLASH: stack.push({type: Script.ENTITY_TOKEN_ESCAPE}) ; break ; // switch context to token escape; go to (1)
																				case Script.TOKEN_BACKTICK: stack.push({type: Script.ENTITY_SYMBOL_ESCAPE}) ; break ; // switch context to symbolic sequence; go to (2)
																				case Script.TOKEN_HASH: stack.push({type: Script.ENTITY_COMMENT, begin: token.begin, end: -1}) ; break ; // switch context to comment, go to (3)
																				case Script.TOKEN_LEFT_BRACE: stack.push({type: Script.ENTITY_STRUCTURE}) ; break ; // switch context to structure; go to (4)
																				/*Terminating tokens.*/
																				case Script.TOKEN_RIGHT_BRACE:

																						if((children = top.children) && children.length !== 0)
																						{
										
																								last = children[children.length - 1] ; // analyze the last gathered component
										
																								if(isInstanceOf(Atom, last) && last.value === Script.RIGHT_BRACKET) // the sequence "]}" occured; Text entity terminates
																								{
										
																										children.pop( ) ; // consume the "]" Atom
																										current = stack.pop( ) ; // remove the text entity from the stack
										
																										nest(stack.top( ), new Text(current.children)) ;
										
																										break ; // skip the rest of this case's logic
										
																								}
										
																						}
										
																						nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ; // gather the right brace token as an Atom

																				break ;
																				case Script.TOKEN_NUL: // the sequence `\0` (end of file; at index <length>)


																						if((type = top.type) !== Script.ENTITY_FILE || (type === Script.ENTITY_FILE && token.end !== input.length)) throw new SyntaxError('Token invalid within entity FILE or entity TEXT (type=NUL, index=%s)', token.begin) ;
																						else break token_iterator ; // simply break the outer iterator

																				break ;
																				/*Consumable tokens.*/
																				default: nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ;
										
																		}
																break ;

																/*(1) token escape*/
																case Script.ENTITY_TOKEN_ESCAPE:

																		token = iterator.next( ) ; // lookahead towards the next token
																		nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ; // nest within host
																		stack.pop( ) ; // remove the token escape entity

																break ;
										
																/*(2) symbol escape*/
																case Script.ENTITY_SYMBOL_ESCAPE:

																		if((children = top.children)) // determine if there is a parsed object to consume
																		{
																				if(children.length === 1) // combine the subsequent entity and the symbol escape
																				{
																						current = stack.pop( ) ;
																						nest(stack.top( ), new Symbol(children[0])) ;
																				}
																				else error('Parsing Error: symbol entity nesting multiple children (index=%s)', token.begin) ;
																		}
																		else // leave the symbolic escape entity on the stack and proceed to parse the next entity in order to consume it later (or, immediately)
																		{
										
																				token = iterator.next( ) ;

																				switch(token.type) // look one token ahead
																				{
																						/*Context switching tokens.*/
																						case Script.TOKEN_BACKSLASH: stack.push({type: Script.ENTITY_TOKEN_ESCAPE}) ; break ; // switch context to token escape; go to (1)
																						case Script.TOKEN_BACKTICK: stack.push({type: Script.ENTITY_SYMBOL_ESCAPE}) ; break ; // switch context to symbolic sequence; go to (2)
																						case Script.TOKEN_HASH: stack.push({type: Script.ENTITY_COMMENT, begin: token.begin}) ; break ; // switch context to comment, go to (3)
																						case Script.TOKEN_LEFT_BRACE: stack.push({type: Script.ENTITY_STRUCTURE}) ; break ; // switch context to structure; go to (4)
																						/*Consumable tokens.*/
																						default: nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ;
																				}

																		}
																break ;
										
																/*(3) comment*/
																case Script.ENTITY_COMMENT:

																		token = iterator.next( ) ;

																		switch(token.type)
																		{
										
																				/*Context switching tokens.*/
																				case Script.TOKEN_HASH:
																						if(! (children = top.children) || children.length === 0) top.type = Script.ENTITY_BLOCK_COMMENT ; // switch context to block comment; go to (2.1)
																				break ;
																				/*Terminating tokens.*/
																				case Script.TOKEN_BREAK:

																						current = stack.pop( ) ; // remove the comment entity from the stack
										
																						nest(stack.top( ), new Comment(input.substring(current.begin + 1, token.begin))) ;

																				break ;
																				/*Consumable tokens.*/
																				default: nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ;

																		}
																break ;
										
																/*(3.1) block comment*/
																case Script.ENTITY_BLOCK_COMMENT:

																		token = iterator.next( ) ;

																		if(token.type === Script.TOKEN_HASH)
																		{

																				if((children = top.children) && children.length !== 0)
																				{
										
																						last = children[children.length - 1] ;

																						if(isInstanceOf(Atom, last) && last.value == Script.HASH) // the sequence "##" after the sequence "##"
																						{

																								current = stack.pop( ) ; // remove the block entity from the stack
																								nest(stack.top( ), new BlockComment(input.substring(current.begin + 2, token.begin - 1))) ; // add a BlockComment to the host object

																								break ; // skip the rest of this cases's logic

																						}
										
																				}

																		}
										
																		nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ;

																break ;
			
																/*(4) structures*/
																case Script.ENTITY_STRUCTURE:
																		token = iterator.next( ) ;
																		switch(token.type)
																		{
																				/*Context switching tokens.*/
																				case Script.TOKEN_BACKTICK:
																						stack.push({type: Script.ENTITY_SYMBOL_ESCAPE}) ; break ; // switch context to symbolic sequence; go to (2)
																				case Script.TOKEN_HASH:
																						stack.push({type: Script.ENTITY_COMMENT, begin: token.begin, end: -1}) ; break ; // switch context to comment, go to (3)
																				case Script.TOKEN_LEFT_BRACE:
																						stack.push({type: Script.ENTITY_STRUCTURE}) ; break ; // switch context to structure; go to (4)
																				case Script.TOKEN_LEFT_BRACKET:
																						if((children = top.children) && children.length !== 0) throw new SyntaxError('Token invalid at this point within STRUCTURE (type=LEFT_BRACKET, index=%s)', token.begin) ;
																						top.type = Script.ENTITY_TEXT ; // change type to TEXT; go to (0)
																				break ;
																				/*Terminating tokens.*/
																				case Script.TOKEN_RIGHT_BRACE:
																						current = stack.pop( ) ; // remove the structure entity from the stack
																						nest(stack.top( ), new Tuple(current.children)) ;
																				break ;
																				/*Consumable tokens.*/
																				default: nest(top, Script.parseAtom(input.substring(token.begin, token.end + 1))) ;
										
																		}
																break ;

														}

												}
										
												iterator.destroy( ) ;
												tokens.destroy( ) ;

												/*Create a File object.*/
												file = new File(
														stack.top( )
														.children
												) ;
out('object-print:') ;
out(file.toString( )) ;
												stack.destroy( ) ;

											// return
										
											return file ;
										
										},
										parseAtom: function parseAtom(string)
										{
										
											/* variables */
										
											var atom,
												i ;
										
											/* logic */
										
												if((i = string.charCodeAt(0)) >= 0x30 && i <= 0x39) return new Number(string) ;// first character is a digit; return a Number
												else // return a Word or KeyWord
												{
										
														switch(string)
														{
										
																case Script.KEYWORD_DEFINE:
																case Script.KEYWORD_LAMBDA:
																case Script.KEYWORD_IF:
																case Script.KEYWORD_WHILE: return new KeyWord(string) ; break ; // return a KeyWord
																default: return new Word(string) ; // return a Word
										
														}
										
												}

										},

										/**
										* @deprecated moved to global
										*/
										lookupEnvironment: function lookupEnvironment(identifier, environment)
										{
										
											/* variables */
										
											var frame = environment,
												object ;
										
											/* logic */
										
												do if((object = frame[identifier])) return object ;
												while((frame = frame['0parent'])) ;
										
											/* return */
										
											return null ;

										},
										/**
										* @implementation The key "0parent" is used to bind the parent environment; "0parent" is an invalid identifier and therefore may be stored safely alongside valid variable bindings without the risk of override.
										* @deprecated moved to global
										*/
										createEnvironment: function createEnvironment(frame, parent)
										{
										
											/* variables */
										
											var environment ;
										
											/* logic */
										
												environment = {'0parent': parent} ; // create a new environment object
												objectEach(frame, function(v, k) { environment[k] = v ; }) ; // copy the given frame's content
										
											/* return */
										
											return environment ;

										},
										/**
										*/
										evaluateObject: function evaluateObject(object, environment)
										{
										
											/* variables */
										
											var first,
												object,
												children, rest,
												length ;
										
											/* logic */
										
												if(isInstanceOf(Atom, object)) return Script.evaluateAtom(object, environment) ;
												else if(isInstanceOf(Structure, object))
												{
										
														children = object.children ;
										
														if((length = children.length) > 0)) // not the empty structure
														{
														
																first = this.evaluateObject(children[0], environment) ; // evaluate the first component
																rest = length > 1 ? arrayCopy(children, 1, length) : null ;
										
																if(isInstanceOf(KeyWord, object)) Script.evaluateMacro(first.value, rest, environment) ;
																else if(isInstanceOf(Lambda, object)) Script.evaluateLambda(first, rest, environment) ;
																else
										
														}

												}
												else throw new TypeError('Unable to evaluate unknown type (type=%s)', typeOf(object)) ;
										

										},
										/**
										* @deprecated moved to global
										*/
										evaluateAtom: function evaluateAtom(object, environment)
										{
										
											/* variables */
										
											var value = object.value ;
										
											/* logic */
										
												if(isInstanceOf(Number, object)) return value ; //@todo evaluate the number atom
												else if(isInstanceOf(Word, object)) // evaluate the identifier
												{
										
														if(isInstanceOf(KeyWord, object)) return object ; // return the keyword object
														else // perform an environment lookup for the given identifier or fail
														{
										
																if(! (object = this.lookupEnvironment(value, environment))) throw new ReferenceError('Unknow or invalid variable (name="%s")', value) ;
																else return object ;
										
														}
										
												}
										
										},
										/**
										* @deprecated moved to global
										*/
										evaluateDefine: function evaluateDefine(definition, environment)
										{
										
											/* variables */
										
											var x ;
										
											/* logic */
console.dir(definition) ;
										
										}
								},
								local:
								{
										/**@type org.meta.script.File*/
										file: null,
										/**
										* @deprecated moved to global
										*/
										_lookupEnvironment: function lookupEnvironment(identifier, environment)
										{
										
											/* variables */
										
											var frame = environment,
												object ;
										
											/* logic */
										
												do if((object = frame[identifier])) return object ;
												while((frame = frame['0parent'])) ;
										
											/* return */
										
											return null ;

										},
										/**
										* @implementation The key "0parent" is used to bind the parent environment; "0parent" is an invalid identifier and therefore may be stored safely alongside valid variable bindings without the risk of override.
										* @deprecated moved to global
										*/
										_createEnvironment: function createEnvironment(frame, parent)
										{
										
											/* variables */
										
											var environment ;
										
											/* logic */
										
												environment = {'0parent': parent} ; // create a new environment object
												objectEach(frame, function(v, k) { environment[k] = v ; }) ; // copy the given frame's content
										
											/* return */
										
											return environment ;

										},
										/**
										* @deprecated moved to global
										*/
										_evaluateObject: function evaluateObject(object, environment)
										{
										
											/* variables */
										
											var first,
												value,
												i1 = -1, i2 ;
										
											/* logic */
										
												if(isInstanceOf(Atom, object)) return evaluateAtom(object, environment) ;
												else if(isInstanceOf(Structure, object))
												{
										
														if((first = object.firstComponent( ))) // analzye the first component
														{
										
																object = this.evaluateObject(first, environment) ; // evaluate the first component
										
																if(isInstanceOf(KeyWord, object))
																{
																		//..
																}
																else if(isInstanceOf(Word, object))
																{
																		//..
																}
																else
																{
										
																		// evaluate the remaining components and return a structure
										
																}
										
														}

												}
												else throw new TypeError('Unable to evaluate unknown type (type=%s)', typeOf(object)) ;
										

										},
										/**
										* @deprecated moved to global
										*/
										_evaluateAtom: function evaluateAtom(object, environment)
										{
										
											/* variables */
										
											var value = object.value ;
										
											/* logic */
										
												if(isInstanceOf(Number, object)) return value ; // evaluate the number atom
												else if(isInstanceOf(Word, object)) // evaluate the identifier
												{
										
														if(! (object = this.lookupEnvironment(value, environment))) throw new ReferenceError('Unknow or invalid variable (name="%s")', value) ;
														else return object ;
										
												}
										
										},
										/**
										* @deprecated moved to global
										*/
										_evaluateDefine: function evaluateDefine(definition, environment)
										{
										
											/* variables */
										
											var x ;
										
											/* logic */
console.dir(definition) ;
										
										},
										/**
										* @param (Object) frame An initial set of variable bindings.
										* @return Object
										* @todo default bindings
										* @deprecated moved to global
										*/
										_evaluate: function evaluate(frame)
										{
												Script.evaluate(this.file, environment) ; //return this.evaluateObject({environment: frame || { }, object: this.file}) ;
										},
										/**
										* @param (Object) frame An initial set of variable bindings.
										* @return Object
										*/
										evaluate: function evaluate(frame)
										{
										
											/* variables */
											
											var file, child,
												stack,
												children,
												top,
												next,
												object ;
											
											/* logic */
											
												file = this.file ;
											
												//..

											/* return */
											
												return file ;

										}
										
								}
						}) ;
								
					
					// variables
					
					
					var script ;

						script = Script.create(
								'{define `hello'
								+ '{lambda'
								+ '{{} {`english} {[Hello world!]}} # default to english\n'
								* '{{`french} {[Salut le monde!]}} # french \n'
								+ '{{`german} {[Hallo Welt!]}} # german \n'
								+ '## This isn\'t used anymore: {{``latin} {[Salve, munde!]}} ##'
								+ '{{[Saluton Mundo!]}} #fallback to esperanto\n'
								+ '}}'
								+ '<!DOCTYPE html><html><head><title>{hello language}</title></head><body><p>{hello language}</p></body></html>'
						) ;
						script.evaluate({language: 'french'}) ;
					
				}
		}
}