/*
@identifier org.meta.web.dom.html.HTML
@extend org.meta.web.dom.DOM
@require org.meta.web.dom.DOM, org.meta.web.dom.NodeList
*/
{
		global:
		{
		
			// attributes
			
				NAMESPACE_URI_XHTML: 'http://www.w3.org/1999/xhtml',
				NAMESPACE_PREFIX_XHTML: 'html',
			
			// functions

				/**
				* Create an HTML element.
				*
				* @todo polyfill, test for second argument being HTML document
				*/
				createElement: (function( ) {
						if(isSet('createElementNS', DEFAULT_DOCUMENT))
								return function createElement(document, name) { return document.createElementNS(HTML.NAMESPACE_URI_XHTML, name) ; } ;
						else error('Illegal State: Unsupported DOM implementation. Required operation `createElementNS` not supported.') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Parsing_and_serializing_XML
				* @bug Stand-alone table elements (`'tr'`, `'td'`, ...) are being ignored while parsing.
				*/
				parse: function parse(string, document)
				{
				
					// variables
					
					var d,
						s,
						n ;
						
					//
					
						if(! (s = document.namespaceURI) || s === this.NAMESPACE_URI_XHTML)
						{
						
								d = document.implementation.createHTMLDocument("") ;
								d.body.innerHTML = string ;
								
								n = d.body.firstChild ;
/*@todo: proper parsing with DOMParser and like APIs.*/
								return document.importNode(n, true) ;
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

				},
				/**
				* @return (org.meta.web.dom.NodeList)
				*/
				find: (function( ) {
						if(isSet('querySelectorAll', DEFAULT_DOCUMENT.documentElement))
								return function find(context, selector)
								{

									// preconditions
									
										assert(this.isElement(context) || this.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

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
						if(isSet('querySelector', DEFAULT_DOCUMENT.documentElement))
								return function find(context, selector)
								{

									// preconditions
									
										assert(this.isElement(context) || this.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

									// return
									
										return context.querySelector(selector) ;

								} ;
						else error('DOM implementation does not support `Element.prototype.querySelectorAll`.') ;
				})( ),
				hasAttribute: function hasAttribute(element, name) { return DOM.hasAttribute(element, name/*,  HTML.NAMESPACE_URI_XHTML*/) ; },
				setAttribute: function setAttribute(element, name, value) { DOM.setAttribute(element, name, value/*, HTML.NAMESPACE_URI_XHTML*/) ; },
				getAttribute: function getAttribute(element, name) { return DOM.getAttribute(element, name/*, HTML.NAMESPACE_URI_XHTML*/) ; },
				removeAttribute: function removeAttribute(element, name) { return DOM.removeAttribute(eleemnt, name/*,  HTML.NAMESPACE_PREFIX_XHTML*/) ; },
				hasClass: (function( ) {
						if(isSet('classList', DEFAULT_DOCUMENT.documentElement)) return function hasClass(element, name)
						{
						
							// preconditions
							
								assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
								
							// return
							
							return element.classList.contains(name) ;
						
						}
						else return function hasClass(element, name)
						{
						
							// preconditions
							
								assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
								
							// variables
							
							var b = false ;
							
							//
								
								new Tokenizer(HTML.getClass( ))
								.tokenize(' ', function(token) {if(token === name) { b = true ; return false ; }}) ;
								
							//
							
							return b ;
							 
						}
				})( ),
				setClass: function setClass(element, name)
				{
				
					// preconditions

						assert(this.isElement(element), 'Illegal node type for argument `element`') ;

					//

						element.className = name ;

				},
				getClass: function getClass(element)
				{
				
					// preconditions

						assert(this.isElement(element), 'Illegal node type for argument `element`') ;
						
					// return
					
					return element.className ;

				},
				/**
				* Adds the class for the given name on the given element if it does not exist yet.
				*/
				addClass: (function( ) {
						if(isSet('classList', DEFAULT_DOCUMENT.documentElement))
								return function addClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.add(name) ;
								
								}
						else
						{
								return function addClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(' ') ;
										
										if(a.indexOf(name) === -1) HTML.setClass(s + ' ' + name) ;
										
								}
						}
				})( ),
				/**
				* Removes the class for the given name on the given element if it does not exist yet.
				*/
				removeClass: (function( ) {
						if(isSet('classList', DEFAULT_DOCUMENT.documentElement))
								return function removeClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.remove(name) ;
								
								}
						else
						{
								return function removeClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a,
										i ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(' ') ;
										
										if((i = a.indexOf(name)) === -1) {
										
												a.splice(i, 1) ;
												
												HTML.setClass(a.join(' ')) ;
												
										}
										
								}
						}
				})( ),
				toggleClass: (function( ) {
						if(isSet('classList', DEFAULT_DOCUMENT.documentElement))
								return function removeClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									//
									
										element.classList.remove(name) ;
								
								}
						else
						{
								return function removeClass(element, name)
								{
								
									// preconditions
									
										assert(this.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
										
									// variables
									
									var s,
										a,
										i ;
									
									//
										
										a = new Tokenizer((s = HTML.getClass( )))
										.tokenize(' ') ;
										
										if((i = a.indexOf(name)) === -1) {
										
												a.splice(i, 1) ;
												
												HTML.setClass(a.join(' ')) ;
												
										}
										
								}
						}

				})( )
		}				
}