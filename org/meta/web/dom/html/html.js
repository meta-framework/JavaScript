/*
@identifier org.meta.web.dom.html.HTML
@extend org.meta.web.dom.DOM
@require org.meta.web.dom.DOM, org.meta.web.dom.NodeList
*/
{
		main: function main(arguments) { this.document = constant('DEFAULT_DOCUMENT') ; },
		global:
		{
		
			// attributes
			
				NAMESPACE_URI: 'http://www.w3.org/1999/xhtml',
				NAMESPACE_PREFIX: 'html',
				document: null,
				
			// functions

				/**
				* @todo polyfill
				*/
				newElement: (function( ) {
						if(isSet('createElementNS', constant('DEFAULT_DOCUMENT')))
								return function newElement(name, namespace)
								{
										return this.document.createElementNS(namespace || org.meta.web.dom.html.HTML.NAMESPACE_URI, name) ;
								} ;
						else error('Unsupported DOM implementation: `createElementNS` not supported.') ;								
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Parsing_and_serializing_XML
				* @bug Stand-alone table elements (`'tr'`, `'td'`, ...) are being ignored while parsing.
				*/
				parse: function parse(string)
				{
				
					// variables
					
					var e = null,
						d,
						s,
						n ;
						
					//
					
						d = constant('DEFAULT_DOCUMENT') ;

						if(! (s = d.namespaceURI) || s === this.NAMESPACE_URI)
						{
						
								d = d.implementation.createHTMLDocument("") ;
								d.body.innerHTML = string ;
								
								n = d.body.firstChild ;
/*@todo: proper parsing with DOMParser and like APIs.*/
								return new this(document.importNode(n, true)) ;
			/*
								if(GLOBAL_OBJECT.DOMParser)
								{
								
										d = new DOMParser( ).parseFromString(string, 'text/html') ;
										n = d.querySelector('body > *') ;
			console.log('\n\nElement::parse') ;
			console.log('parse: %s', string) ;
			console.log('parsed: %s', n) ;
			console.log(new XMLSerializer( ).serializeToString(n)) ;
										if((n = d.documentElement).nodeName === 'parsererror') throw new Error('Parser error: ' + n.textContent) ;
										else return new this(document.importNode(n, true)) ;
										
								}
								else throw 'Not implemented.' ;
			*/
						}
						else throw new TypeError('Illegal argument. Document is not an HTML document.') ;
						
					// return
					
					return e ;

				},
				find: (function( ) {
						if(isSet('querySelectorAll', constant('DEFAULT_DOCUMENT').documentElement))
								return function find(selector, context)
								{

									// preconditions
									
										assert(DOM.isElement(context) || DOM.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

									// variables
									
									var l ;
									
									//

										if((l = context.querySelectorAll(selector))) { return NodeList.create(l) ; }
												
									// return
									
									return null ;

								} ;
						else error('DOM implementation does not support `Element.prototype.querySelectorAll`.') ;
				})( ),
				/**
				* Find the first element matching the given selector for the given context element.
				*
				* This operation is recommended where only the first element matching the selector is needed or if it is known that there is only one element matching it (e.g. for an id).
				*/
				findFirst: (function( ) {
						if(isSet('querySelector', constant('DEFAULT_DOCUMENT').documentElement))
								return function find(selector, context)
								{

									// preconditions
									
										assert(DOM.isElement(context) || DOM.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

									// return
									
										return context.querySelector(selector) ;

								} ;
						else error('DOM implementation does not support `Element.prototype.querySelectorAll`.') ;
				})( ),
				setClass: function setClass(name, element)
				{
				
					// preconditions

						assert(DOM.isElement(element), 'Illegal node type for argument `element`') ;

					//

						element.className = name ;

				},
				getClass: function getClass(element)
				{
				
					// preconditions

						assert(DOM.isElement(element), 'Illegal node type for argument `element`') ;
						
					// return
					
					return element.className ;

				},
				hasClass: (function( ) {
						if(isSet('classList', constant('DEFAULT_DOCUMENT').documentElement))
								return function hasClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// return
									
									return element.classList.contains(name) ;
								
								}
						else
						{
console.log('(!) Warning: no `classList` property!') ;
								return function hasClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var a ;
									
									//
										
										a = new Tokenizer(HTML.getClass( ))
										.tokenize(constant('CHARACTERS').SPACE) ;
										
									//
									
									return a.indexOf(name) !== -1 ;
									 
								}
						}
				})( ),
				/**
				* Adds the class for the given name on the given element if it does not exist yet.
				*/
				addClass: (function( ) {
						if(isSet('classList', constant('DEFAULT_DOCUMENT').documentElement))
								return function addClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.add(name) ;
								
								}
						else
						{
								return function addClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(constant('CHARACTERS').SPACE) ;
										
										if(a.indexOf(name) === -1) HTML.setClass(s + constant('CHARACTERS').SPACE + name) ;
										
								}
						}
				})( ),
				/**
				* Removes the class for the given name on the given element if it does not exist yet.
				*/
				removeClass: (function( ) {
						if(isSet('classList', constant('DEFAULT_DOCUMENT').documentElement))
								return function removeClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.remove(name) ;
								
								}
						else
						{
								return function removeClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a,
										i ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(constant('CHARACTERS').SPACE) ;
										
										if((i = a.indexOf(name)) === -1) {
										
												a.splice(i, 1) ;
												
												HTML.setClass(a.join(constant('CHARACTERS').SPACE)) ;
												
										}
										
								}
						}
				})( ),
				toggleClass: (function( ) {
						if(isSet('classList', constant('DEFAULT_DOCUMENT').documentElement))
								return function removeClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.remove(name) ;
								
								}
						else
						{
								return function removeClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a,
										i ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(constant('CHARACTERS').SPACE) ;
										
										if((i = a.indexOf(name)) === -1) {
										
												a.splice(i, 1) ;
												
												HTML.setClass(a.join(constant('CHARACTERS').SPACE)) ;
												
										}
										
								}
						}

				})( ),
				toggleClass: (function( ) {
						if(isSet('classList', constant('DEFAULT_DOCUMENT').documentElement))
								return function toggleClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.toggle(name) ;
								
								}
						else
						{
								return function toggleClass(name, element)
								{
								
									// preconditions
									
										assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a,
										i ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(constant('CHARACTERS').SPACE) ;
										
										if((i = a.indexOf(name)) === -1) HTML.setClass(s + constant('CHARACTERS').SPACE + name) ;
										else
										{
										
												a.splice(i, 1) ;
												
												HTML.setClass(a.join(constant('CHARACTERS').SPACE)) ;
												
										}
										
								}
						}

				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
				* @link https://developer.mozilla.org/en-US/docs/DOM/event
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
				* @link name (String) The String identifier of the Event type (e.g. 'load').
				* @link listener (Function, org.meta.web.dom.event.EventListener) A listener object.
				* @link target (Element, Window) The target of the the event listener registration.
				* @todo: capture, legacy (?)
				*/
				addListener: function addListener(name, listener, target)
				{					
					
					//
					

						target.addEventListener(name, listener, false) ;

				},
				/**
				* @todo: capture, legacy (?)
				*/
				removeListener: function removeListener(name, listener, target)
				{

					//

						target.removeEventListener(name, listener, false) ;

				}
		}				
}