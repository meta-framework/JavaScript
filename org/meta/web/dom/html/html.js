/*
@package org.meta.web.dom.html
@require org.meta.standard, org.meta.util, org.meta.web.dom, org.meta.logic.event
@provide HTML, EventTarget, EventListener, Component
*/
(function( ) {

var DOM = org.meta.web.dom.DOM,
	Tokenizer = org.meta.util.Tokenizer ;

return {
		/**
		* @todo the `Element.prototype.classList` related polyfills might be moved to `Element.prototype` in meta.js
		*/
		HTML:
		{
				extend: 'org.meta.web.dom.DOM',
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				main: function main(arguments)
				{
					
					//
					
						this.document = Meta.constant('DEFAULT_DOCUMENT') ;
						
				},
				local:
				{
				
					// attributes
					
						NAMESPACE_URI: 'http://www.w3.org/1999/xhtml',
						NAMESPACE_PREFIX: 'html',
						document: null,
						/**@deprecated*/
						document_ready: false,
						
					// functions

						/**
						* @todo polyfill
						*/
						newElement: (function( ) {
								if(Meta.isSet('createElementNS', Meta.constant('DEFAULT_DOCUMENT')))
										return function newElement(name, namespace)
										{
												return this.document.createElementNS(namespace || org.meta.web.dom.html.HTML.NAMESPACE_URI, name) ;
										} ;
								else Meta.error('Unsupported DOM implementation: `createElementNS` not supported.') ;								
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
							
								d = Meta.constant('DEFAULT_DOCUMENT') ;

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
								if(Meta.isSet('querySelectorAll', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function find(selector, context)
										{

											// preconditions
											
												Meta.assert(DOM.isElement(context) || DOM.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

											// variables
											
											var l ;
											
											//

												if((l = context.querySelectorAll(selector))) { return org.meta.web.dom.NodeList.create(l) ; }
														
											// return
											
											return null ;

										} ;
								else Meta.error('DOM implementation does not support `Element.prototype.querySelectorAll`.') ;	
						})( ),
						/**
						* Find the first element matching the given selector for the given context element.
						*
						* This operation is recommended where only the first element matching the selector is needed or if it is known that there is only one element matching it (e.g. for an id).
						*/
						findFirst: (function( ) {
								if(Meta.isSet('querySelector', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function find(selector, context)
										{

											// preconditions
											
												Meta.assert(DOM.isElement(context) || DOM.isDocument(context), 'Illegal Argument: illegal node type for formal parameter `context`.') ;

											// return
											
												return context.querySelector(selector) ;

										} ;
								else Meta.error('DOM implementation does not support `Element.prototype.querySelectorAll`.') ;
						})( ),
						setClass: function setClass(name, element)
						{
						
							// preconditions

								Meta.assert(DOM.isElement(element), 'Illegal node type for argument `element`') ;

							//

								element.className = name ;

						},
						getClass: function getClass(element)
						{
						
							// preconditions

								Meta.assert(DOM.isElement(element), 'Illegal node type for argument `element`') ;
								
							// return
							
							return element.className ;

						},
						hasClass: (function( ) {
								if(Meta.isSet('classList', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function hasClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// return
											
											return element.classList.contains(name) ;
										
										}
								else
								{
console.log('(!) Warning: no `classList` property!') ;
										return function hasClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// variables
											
											var a ;
											
											//
												
												a = new Tokenizer(org.meta.web.dom.html.HTML.getClass( ))
												.tokenize(Meta.constant('CHARACTERS').SPACE) ;
												
											//
											
											return a.indexOf(name) !== -1 ;
											 
										}
								}
						})( ),
						/**
						* Adds the class for the given name on the given element if it does not exist yet.
						*/
						addClass: (function( ) {
								if(Meta.isSet('classList', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function addClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											//
											
												element.classList.add(name) ;
										
										}
								else
								{
										return function addClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// variables
											
											var s,
												a ;
											
											//
												
												a = new Tokenizer((s = org.meta.web.dom.html.HTML.getClass( )))
												.tokenize(Meta.constant('CHARACTERS').SPACE) ;
												
												if(a.indexOf(name) === -1) org.meta.web.dom.html.HTML.setClass(s + Meta.constant('CHARACTERS').SPACE + name) ;
												
										}
								}
						})( ),
						/**
						* Removes the class for the given name on the given element if it does not exist yet.
						*/
						removeClass: (function( ) {
								if(Meta.isSet('classList', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function removeClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											//
											
												element.classList.remove(name) ;
										
										}
								else
								{
										return function removeClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// variables
											
											var s,
												a,
												i ;
											
											//
												
												a = new Tokenizer((s = org.meta.web.dom.html.HTML.getClass( )))
												.tokenize(Meta.constant('CHARACTERS').SPACE) ;
												
												if((i = a.indexOf(name)) === -1) {
												
														a.splice(i, 1) ;
														
														org.meta.web.dom.html.HTML.setClass(a.join(Meta.constant('CHARACTERS').SPACE)) ;
														
												}
												
										}
								}
						})( ),
						toggleClass: (function( ) {
								if(Meta.isSet('classList', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function removeClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											//
											
												element.classList.remove(name) ;
										
										}
								else
								{
										return function removeClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// variables
											
											var s,
												a,
												i ;
											
											//
												
												a = new Tokenizer((s = org.meta.web.dom.html.HTML.getClass( )))
												.tokenize(Meta.constant('CHARACTERS').SPACE) ;
												
												if((i = a.indexOf(name)) === -1) {
												
														a.splice(i, 1) ;
														
														org.meta.web.dom.html.HTML.setClass(a.join(Meta.constant('CHARACTERS').SPACE)) ;
														
												}
												
										}
								}

						})( ),
						toggleClass: (function( ) {
								if(Meta.isSet('classList', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function toggleClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											//
											
												element.classList.toggle(name) ;
										
										}
								else
								{
										return function toggleClass(name, element)
										{
										
											// preconditions
											
												Meta.assert(DOM.isElement(element), 'Illegal Argument: invalid type for formal parameter `element`') ;
												
											// variables
											
											var s,
												a,
												i ;
											
											//
												
												a = new Tokenizer((s = org.meta.web.dom.html.HTML.getClass( )))
												.tokenize(Meta.constant('CHARACTERS').SPACE) ;
												
												if((i = a.indexOf(name)) === -1) org.meta.web.dom.html.HTML.setClass(s + Meta.constant('CHARACTERS').SPACE + name) ;
												else
												{
												
														a.splice(i, 1) ;
														
														org.meta.web.dom.html.HTML.setClass(a.join(Meta.constant('CHARACTERS').SPACE)) ;
														
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
		},
		
		/**
		* {@link org.meta.logic.event.EventTarget}
		*/
		EventTarget:
		{
				extend: 'org.meta.logic.event.EventTarget',
				main: function main(target) { this.listeners = [ ] ; this.target = target ; },
				global:
				{
						EVENT_LOAD: 'load',
						EVENT_UNLOAD: 'unload',
						EVENT_READY: 'DOMContentLoaded',
						create: function create(target, listeners)
						{
							
							// preconditions
							
								Meta.assert(DOM.isElement(target) || Meta.isWindow(target), 'Invalid type for formal parameter `target`.') ;

							// return
						
							return new this(target) ;

						}
				},
				local:
				{
						addListener: function addListener(name, listener)
						{
							
							//

								this.super.addListener.apply(this, [name, listener]) ;

								/*Add the event listener to the target.*/

								org.meta.web.dom.html.HTML.addListener(name, listener, this.target) ;
						
						},
						removeListener: function removeListener(name, listener)
						{
						
							//
							
								this.super.removeListener.apply(this, [name, listener]) ;
								
								org.meta.web.dom.html.HTML.removeListener(name, listener, this.target) ;
							
						},
						/**
						* Remove all listeners for a given name.
						*/
						removeAllListeners: function removeAllListeners(name)
						{

							// variables
							
							var a,
								i,
								l ;
								
							//

								if((a = this.listeners[name]))
								{
								
										i = a.length ;
										
										while(--i >= 0)
										{
										
												l = a[i] ;

												org.meta.web.dom.html.HTML.removeListener(name, l, this.target) ;
												
										}
										
								}
								
								delete this.listeners[name] ;

						}
				}
		},
		
		/**
		* {@link org.meta.logic.event.Listener}
		* @stub
		* @source https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/DOM3-Events.html#interface-EventListener
		*/
		EventListener:
		{
				extend: 'org.meta.logic.event.EventListener'
		},
		
		/**
		* An HTML component.
		*
		* This is an object wrapper for a (partial) tree of HTML elements. It adds event management to `org.meta.web.dom.Component`.
		*/
		Component: {
				extend: 'org.meta.web.dom.Component',
				main: function main(root, target)
				{
						this.root = root ;
						this.target = target ;
						this.children = [ ] ;
				},
				global:
				{
						create: function create(root)
						{
						
							// preconditions

								Meta.assert(DOM.isElement(root) && org.meta.web.dom.html.HTML.namespaceOf(root) === org.meta.web.dom.html.HTML.NAMESPACE_URI, 'Illegal Argument: Invalid type for formal parameter `root`.') ;
						
							// return
							
							return new this(root, org.meta.web.dom.html.EventTarget.create(root)) ;
							
						}
				},
				local:
				{
						/**
						* @type EventTarget
						*/
						target: null,
						destroy: function destroy( )
						{
						
								/*Destroy the event target instance releasing all listeners.*/

								this.target.destroy( ) ;
								
								if(this.super.destroy) this.super.destroy.call(this) ;
						
						},
						setClass: function addClass(name) { org.meta.web.dom.html.HTML.setClass(name, this.root) ; },
						getClass: function getClass( ) { return org.meta.web.dom.html.HTML.getClass(this.root) ; },
						addClass: function addClass(name) { org.meta.web.dom.html.HTML.addClass(name, this.root) ; },
						removeClass: function removeClass(name) { org.meta.web.dom.html.HTML.removeClass(name, this.root) ; },
						toggleClass: function toggleClass(name) { org.meta.web.dom.html.HTML.toggleClass(name, this.root) ; },
						/**
						* Register a 'load' handler for this component.
						*
						* @param (String) name The event name to register the given action.
						* @param (EventListener) listener An event listener.
						*/
						onEvent: function onEvent(name, listener)
						{
							
							//
							
								this.target.addListener(name, listener) ;
						
						},
						/**
						* Listen to the document ready event.
						*/
						onReady: (function( ) {
						
							// variables
							
								if(Meta.isSet('readyState', Meta.constant('DEFAULT_DOCUMENT')))
										return function onReady(listener)
										{
										
											// variables
											
											var component = this,
												d ;
											
											//
											
												this.target.super.addListener.apply(this.target, ['ready', listener]) ;
											
												if((d = Meta.constant('DEFAULT_DOCUMENT')) !== 'complete') d.onreadystatechange = function( ) { if(d.readyState === 'complete') component.target.triggerEvent('ready', null) ; } ;

										
										}
								else
										return function onReady(listener)
										{
										
											// variables
											
											var component = this,
												t ;
											
											//
										
												this.target.super.addListener.apply(this.target, ['ready', listener]) ;
												
												t = org.meta.web.dom.html.EventTarget.create(this.document) ;
												t.addListener(
														'DOMContentLoaded',
														org.meta.web.dom.html.EventListener.create(
																function( ) {

																		component.triggerEvent('ready', null) ;
																		
																		t.destroy( ) ;
																		
																},
																null,
																EventListener.ATTRIBUTE_EXECUTE_ONCE
														)
												) ;
												
										}
						})( )
				}
		}
} ;
})( ) 