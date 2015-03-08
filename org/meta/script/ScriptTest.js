/*
@identifier org.meta.script.ScriptTest
@require org.meta.data.collections.RingQueue, org.meta.data.collections.RingStack
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
										components: null,
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
					
					var Component ;
						Component = define('org.meta.script.Component', { // may be atomic or structured
						}) ;
					
					var Symbol ;
						Symbol = define('org.meta.script.Symbol', {
								extend: Component
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
										ENTITY_FILE: 0, // a pseudo entity containing the entire input file
										ENTITY_TEXT: 1,
										ENTITY_SYMBOL: 2,
										ENTITY_STRUCTURE: 3,
//										ENTITY_TOKEN_ESCAPE: 4,
										ENTITY_COMMENT: 4,
										ENTITY_BLOCK_COMMENT: 5,
										ENTITY_ESCAPE: 6,
										ENTITY_TOKEN: 7, // all others
										create: function create(input)
										{
												return new this(input) ;
										}
								},
								local:
								{
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
										/**
										* @link http://en.wikipedia.org/wiki/Whitespace_character (whitespace unicode points)
										*/
										tokenize: function tokenize( )
										{
										
											// variables
										
											var queue,
												last,
												index = -1, length = this.input.length ;
										
											//
										
												queue = RingQueue.create( ) ;

												/*Tokenize the input.*/
												while(++index < length)
														switch(this.input.charAt(index))
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
										
																		switch(this.input.charCodeAt(index))
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
										* @return File
										*/
										parse: function parse( )
										{
function printToken(token, input) {
		switch(token.type)
		{
			case Script.TOKEN_NUL: return '\\0' ; break ;
			case Script.TOKEN_LEFT_BRACE: return '{' ; break ;
			case Script.TOKEN_RIGHT_BRACE: return '}' ; break ;
			case Script.TOKEN_LEFT_BRACKET: return '[' ; break ;
			case Script.TOKEN_RIGHT_BRACKET: return ']' ; break ;
			case Script.TOKEN_BACKSLASH: return '\\' ; break ;
			case Script.TOKEN_BACKTICK: return '`' ; break ;
			case Script.TOKEN_COMMA: return ',' ; break ;
			case Script.TOKEN_HASH: return '#' ; break ;
			case Script.TOKEN_BREAK: return '<break>' ; break ;
			case Script.TOKEN_SPACE: return '<space>' ; break ;
			case Script.TOKEN_WORD: return '"' + input.substring(token.begin, token.end + 1) + '"' ; break ;

		}
}
											// variables
										
											var entities, tokens,
												token, last, next, // tokens
												current, top, previous, // entities
												type, i1, i2,
												children,
												object ;

											//
										
												entities = RingStack.create( ) ;
												entities.push({type: Script.ENTITY_FILE, begin: 0, end: this.input.length, children: [ ]}) ;
//												entities.push({type: Script.ENTITY_SYMBOLIC_GROUP, begin: 0, end: this.input.length, children: [ ]}) ; //@todo this makes it possible to stop the parser mid file using an extra "]}" sequence

												tokens = this.tokenize( ) ;
												iterator = tokens.iterator( ) ;

												while(iterator.hasNext( ))
														switch((top = entities.top( )).type)
														{
																case Script.ENTITY_FILE:
																case Script.ENTITY_TEXT:
																		switch((token = iterator.next( )).type) // analyze the next token
																		{
																				/*Context switching tokens.*/
																				case Script.TOKEN_LEFT_BRACE: entities.push({type: Script.ENTITY_STRUCTURE}) ; break ;
																				case Script.TOKEN_BACKTICK: entities.push({type: Script.ENTITY_SYMBOL}) ; break ;
																				case Script.TOKEN_HASH: entities.push({type: Script.ENTITY_COMMENT}) ; break ;
																				case Script.TOKEN_BACKSLASH: entities.push({type: Script.ENTITY_ESCAPE}) ; break ;
																				/*Terminating tokens.*/
																				case Script.TOKEN_RIGHT_BRACE:
																						if(! (children = top.children)) throw new SyntaxError('Token invalid within entity TEXT (type=RIGHT_BRACE, index=%s)', token.begin) ;
																						else if((last = children[children.length - 1]).type === Script.ENTITY_TOKEN && last.subtype === Script.TOKEN_RIGHT_BRACKET)
																						{
										
																								current = entities.pop( ) ; // remove the text or file entity from the stack
																								current.end = last.begin - 1 ; // exclude text closing delimiter
										
																								top = entities.top( ) ; // get the new top element
																								if(! (children = top.children)) children = top.children = [ ] ;
																								children[children.length] = current ;
										
																						}
																				break ;
																				case Script.TOKEN_NUL:
																						if((type = top.type) !== Script.ENTITY_FILE || (type === Script.ENTITY_FILE && token.end !== this.input.length - 1)) throw new SyntaxError('Token invalid within entity FILE or entity TEXT (type=NUL, index=%s)', token.begin) ;
																				break ;
																				/*Consumable tokens.*/
																				default:
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = {type: Script.ENTITY_TOKEN, subtype: token.type} ;
										
																		}
																break ;
										
																//...
														}
/*
														token = iterator.next( ) ;
														top = entities.top( ) ;

														switch(top.type)
														{
																case Script.ENTITY_FILE:
																case Script.ENTITY_TEXT:
out('current-entity: FILE or TEXT') ;
out('current-token: %s', printToken(token, this.input)) ;
																		switch(token.type)
																		{
																				/*Context switching tokens.* /
																				case Script.TOKEN_LEFT_BRACE:
																						entities.push({type: Script.ENTITY_STRUCTURE}) ;
																				break ;
																				case Script.TOKEN_BACKTICK:
																						entities.push({type: Script.ENTITY_SYMBOL}) ;
																				break ;
																				case Script.TOKEN_HASH:
																						entities.push({type: Script.ENTITY_COMMENT, begin: token.begin + 1}) ;
																				break ;
																				/*Terminating tokens.* /
																				case Script.TOKEN_NUL:
																						if(top.type !== Script.ENTITY_FILE || (top.type === Script.ENTITY_FILE && token.end !== length - 1)) throw new SyntaxError('Token invalid within symbolic group (type=NUL, index=%s)', token.begin) ;
																				break ;
																				case Script.TOKEN_RIGHT_BRACE:
																						if(! (children = top.children)) throw new SyntaxError('Token invalid within entity TEXT (type=RIGHT_BRACE, index=%s)', token.begin) ;
																						else if((last = children[children.length - 1]).type === Script.ENTITY_TOKEN && last.subtype === Script.TOKEN_RIGHT_BRACKET)
																						{
								
																								current = entities.pop( ) ;
																								current.end = last.begin - 1 ;
																								top = entities.top( ) ; // the new top element

																								if(! (children = top.children)) children = top.children = [ ] ;
																								children[children.length] = current ;
								
																						}
																						else throw new SyntaxError('Umatched token (type=RIGHT_BRACE, index=%s)', token.begin) ;
																				break ;
																				/*Consuming and consumable tokens.* /
																				case Script.TOKEN_BACKSLASH:
//																						entities.push({type: Script.ENTITY_TOKEN_ESCAPE}) ;
																						if(! (next = iterator.next( ))) throw new SyntaxError('Invalid escape token (index=%s)', token.begin) ;
																						else
																						{
																								if(! (children = top.children)) children = top.children = [ ] ;
																								children[children.length] = {type: Script.ENTITY_WORD, begin: next.begin, end: next.end} ; // convert the token following the backslash into a word and continue
																						}
																				break ;
																				default:
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = {type: Script.ENTITY_TOKEN, subtype: token.type}
																		}
																break ;
																case Script.ENTITY_STRUCTURE:
out('current-entity: STRUCTURE (id=%s)', top.id) ;
out('current-token: %s', printToken(token, this.input)) ;
																		switch(token.type)
																		{
																				/*Context switching tokens.* /
																				case Script.TOKEN_LEFT_BRACE : entities.push({type: Script.ENTITY_STRUCTURE}) ; break ; // enter structure context
																				case Script.TOKEN_LEFT_BRACKET: top.type = Script.ENTITY_TEXT ; break ; // enter text context
																				case Script.TOKEN_HASH: entities.push({type: Script.ENTITY_COMMENT}) ; break ; // enter comment context
																				/*Terminating tokens.* /
																				case Script.TOKEN_RIGHT_BRACE:
																						current = entities.pop( ) ; // remove the current top element
																						top = entities.top( ) ; // the new top element
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = current ;
																				break ;
																				/*Invalid tokens.* /
																				case Script.TOKEN_RIGHT_BRACKET:
																				case Script.TOKEN_BACKSLASH:
																				case Script.TOKEN_NUL:
																						throw new SyntaxError('Token invalid within structure (index=%s)', token.begin) ;
																				break ;
																				default:
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = {type: Script.ENTITY_TOKEN, subtype: token.type} ;
																		}
																break ;
																case Script.ENTITY_SYMBOL:
																		if((children = top.children) && children.length !== 0)
																		{
										
																						current = top ;
																						top = entities.pop( ) ;
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = current ;

																		}
																		else switch(token.type)
																		{
																				/*Context switching tokens.* /
																				case Script.TOKEN_LEFT_BRACE: entities.push({type: Script.ENTITY_STRUCTURE}) ; break ;
																				case Script.TOKEN_HASH: entities.push({type: Script.ENTITY_COMMENT}) ; break ;
																				case Script.TOKEN_BACKSLASH: entities.push({type: Script.ENTITY_SYMBOL}) ; break ; // a symbolic escape may escape another symbolic escape
																				/*Invalid tokens.* /
																				case Script.TOKEN_RIGHT_BRACE:
																				case Script.TOKEN_RIGHT_BRACKET:
																				case Script.TOKEN_LEFT_BRACKET:
																				case Script.TOKEN_NUL:
																						throw new SyntaxError('Token invalid within symbol (index=%s)', token.begin) ;
																				default: // consume the token and remove the symbol entity
																						current = entities.top( ) ;
																						current.end = token.end ; // include the token range within the symbol range
																						current.children = [{type: Script.ENTITY_TOKEN, subtype: token.type}] ;
										
																						top = entities.pop( ) ;
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = current ;
										
										
																		}
																break ;
																case Script.ENTITY_COMMENT:
out('current-entity: COMMENT') ;
out('current-token: %s', printToken(token, this.input)) ;
																		switch(token.type)
																		{
																				/*Context switching tokens.* /
																				case Script.TOKEN_LEFT_BRACKET: top.type = Script.ENTITY_BLOCK_COMMENT ; break ;
																				/*Terminating tokens.* /
																				case Script.TOKEN_BREAK:

																						current = entities.pop( ) ; // remove the current top element
																						current.end = token.begin - 1 ; // exclude the line break character from the comment range
														 
																						top = entities.top( ) ; // then new top element
														 
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = current ;
														 
																				break ;
																		}
																break ;
																case Script.ENTITY_BLOCK_COMMENT:
out('current-entity: BLOCK_COMMENT') ;
out('current-token: %s', printToken(token, this.input)) ;
																		switch(token.type)
																		{
																				/*Terminating tokens.* /
																				case Script.TOKEN_HASH:
																						if((children = top.children))
																								if((last = children[children.length - 1]).type === Script.ENTITY_TOKEN && last.subtype === Script.TOKEN_RIGHT_BRACKET)
																								{
																								
																										current = entities.pop( ) ; // remove the current top element
																										current.end = last.begin - 1 ;
																									
																										top = entities.top( ) ; // the new top element
																									
																										if(! (children = top.children)) children = top.children = [ ] ;
																										children[children.length] = current ;

																								}
					
																				break ;
																				default: // gather tokens for look behind
																						if(! (children = top.children)) children = top.children = [ ] ;
																						children[children.length] = {type: Script.ENTITY_TOKEN, subtype: token.type} ;
																				break ;
																		}
																break ;
*/
														}
												}
										
												iterator.destroy( ) ;
												tokens.destroy( ) ;
console.dir(entities.head_element) ;

												/*Create an object representation tree.*/
												file = new File([ ]) ;
												queue = RingQueue.create( ) ;

												top = entities.top( ) ;
												children = top.children ;
												i1 = -1, i2 = children.length
												while(++i1 < i2) queue.enqueue({parent: file, entity: children[i1]}) ;
										
												while(! queue.isEmpty( ))
												{
										
														top = queue.top( ) ;
														entity = top.entity ;
										
														switch(entity.type)
														{
																case
														}

														if((children = entity.children))
														{
										
																i1 = -1, i2 = children.length ;
																while(++i1 < i2) queue.push({parent: object, entity: children[i1]}) ;
																
														}
										
												}
										
												queue.destroy( ) ;
										
											// return
										
											return file ;
										
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
								"{define `hello {{``english} {} {[Hello world! \]}} #default to english\n {{``french} {[Salut le monde!]}} {{``german} {[Hallo Welt!]}} #[this isn't used anymore: {{``latin} {[Salve, munde!]}}]# {{[Saluton Mundo!]}} #fallback to esperanto\n }"
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