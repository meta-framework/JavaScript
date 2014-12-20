/*
@identifier org.meta.web.dom.DOM
@extend org.meta.Object
@require org.meta.web.dom.NodeIterator
*/
{
		global: {
		
			// testing functions
				
				isDocument: function isDocument(node) { return this.typeOf(node) === Node.DOCUMENT_NODE ; },
				isElement: function isElement(node) { return this.typeOf(node) === Node.ELEMENT_NODE ; },
				/**
				* Test wheter the given node is its owner document's root Node.
				* @param node A target Node.
				* @return Boolean
				*/

				isRoot: function isRoot(node)
				{
				
					// variables
					
					var n ;
					
					// return
					
						if(this.isDocument((n = this.ownerOf(node)))) return DOM.isSame(n.documentElement, node) ;
						
					return false ;
					
				},
				/**
				* Tests two node for identity.
				*
				* @todo legacy browsers (`.nodeIndex`)
				* @link https://developer.mozilla.org/en-US/docs/Web/API/Node.isSameNode
				* @param (Node) a
				* @param (Node) b
				*/
				isSame: (function( ) {
						if(isSet('isSameNode', DEFAULT_DOCUMENT.documentElement))
								return function isSame(a, b) { return a.isSameNode(b) ;	} ;
						else return function isSame(a, b) { return a === b ; }
				})( ),
				/**
				* Test if the first given node is a descendant of the second given node.
				*
				* @todo polyfill
				*/
				isDescendant: (function( ) {
						if(isSet('compareDocumentPosition', DEFAULT_DOCUMENT))
								return function isDescendant(node, ancestor) { return !! (node.compareDocumentPosition(ancestor) & 16) ; }
						else return function isDescendant(node, ancestor) { error('`Node.prototype.compareDocumentPosition` is not supported.') ; }
				})( ),
				
			// characterizing functions

				ownerOf: function ownerOf(node) { return this.typeOf(node) === Node.DOCUMENT_NODE ? null : node.ownerDocument ; },
				/**
				* Return the type of the selected `Node`.
				* @link http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-111237558
				* @link https://developer.mozilla.org/en/nodeType
				* @return Integer
				*/
				typeOf: function typeOf(node) { return node.nodeType ; },
				/**
				* Return the namespace prefix of the given node.
				*
				* @link https://developer.mozilla.org/en-US/docs/Web/API/Node.lookupPrefix
				*
				* @return (String)
				*/
				prefixOf: function prefixOf(node)
				{
/*@todo: cross-browser compatibility.*/
					// variables
					
					var s,
						i ;
					
					//

						if(isSet('lookupPrefix', node)) { return node.lookupPrefix(this.namespaceOf(node)) ; }
						else throw new Error('Not implemented.') ;
						
					// return
					
					return null ;

				},
				/**
				* Get the namespace URI of a namespace qualified node.
				*
				* @todo: polyfill
				* @link https://developer.mozilla.org/en-US/docs/Web/API/Node.lookupNamespaceURI
				*
				* @implementation Both the `Node.namespaceURI` and `Node.prefix` properties have been deprecated according to MDN and `Node.lookupNamespaceURI` will return the default namespace if the prefix String passed to it is null. The return of this is `null` if the element is an HTML element in an HTML document, i.e. an element in the the xhtml namespace.
				*
				* @return (String)
				*/
				namespaceOf: function namespaceOf(node)
				{
/*@todo: cross-browser compatibility; attribute nodes.*/
					// variables
					
					var s = null ;
					
					//

						switch(this.typeOf(node))
						{
						
								case Node.DOCUMENT_NODE: return this.namespaceOf(node.documentElement) ;
								case Node.ATTRIBUTE_NODE: throw new Error('Not implemented.') ;
								case Node.ELEMENT_NODE:
								{

										/*Return the default namespace using `Node.lookupNamespaceURI(prefix:String = null)`.*/
										
										if(isSet('namespaceURI', node)) return node.namespaceURI ;
//														if((s = node.lookupNamespaceURI(null)) === null) return org.meta.web.dom.DOM.namespaceOf(org.meta.web.dom.DOM.ownerOf(node)) ;
										else throw new Error('Not implemented.') ;

								}
								default: throw new Error('Invalid type for argument `node`.') ;

						}
						
					// return
					
					return null ;
					
				},
				childrenOf: function childrenOf(node)
				{
					return new NodeIterator(node.childNodes) ;
				},
				
			// creation, modification, retrieval functions
/*@todo: XML create.*/
				createElement: function createElement(document, name, namespace)
				{
				
					//
					
						// return
				
						if(namespace) return document.createElementNS(namespace, name) ;
						else return document.createElement(name) ;
						
						
					// return
					
					return null ;

				},
/*@todo: XML parse.*/
				parse: function parse(string, document)
				{
						throw Error('Not implemented') ;
				},
/*@todo: XML find.*/
				find: function find(context, selector)
				{
						throw Error('Not implemented') ;
				},
				findFirst: function findFirst(context, selector)
				{
						throw Error('Not implemented') ;
				},
				append: function append(child, parent)
				{
				
					//

						parent.appendChild(child) ;
						
					// return
					
					return child ;

				},
				remove: function remove(child, parent)
				{

					//
					
						parent.removeChild(child) ;
						
					// return
					
					return child ;
				
				},
				/**
				* Set the text content of the given node.
				*
				* @implementation IE only lets us change the text content after the window#load Event has completed. There is no apparent reason or explanation for that. As a fallback, if the text cannot be set directly the current Node is being cleared and a text Node for the given text is appended. Changing the text content of a STYLE Element will not work in IE≤8.
				*
				* @todo: remove polyfill.
				* @link http://msdn.microsoft.com/en-us/library/ms533899(v=vs.85).aspx
				* @link https://developer.mozilla.org/En/DOM/Node.textContent
				* @link http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-textContent
				* @link http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
				*
				* @param text (String) The String value to set the Node's text content to.
				* @param node (Node) The Node whose text content to change.
				*@todo polyfill
				*/
				setText: function setText(text, node)
				{

/*@todo: use `(function(){})` function to determine the correct `setText` algorithm upon parsing.*/
					//

						if(isSet('innerText', node)) { node.innerText = text ; }
						else if(isSet('textContent', node)) { node.textContent = text ; }

				},
				/**
				*Get the given node's text content.
				* @return String
				* @todo polyfill
				*/
				getText: function getText(node)
				{

					// variables
					
					var s = null ;

					// 

						if(! isSet('textContent', node)) {

								try { s = node.innerText ; }
								catch(error) { }

						}
						else { s = node.textContent ; }

					// return 
					
					return s ;

				},
				/**
				*Add a text node with the given text content to the given node.
				*/
				addText: function addText(text, node)
				{

					//

						node.appendChild(
								this.ownerOf(node)
								.createTextNode(text)
						) ;

				},
				/**
				* Set an attribute of the given element node to the given value. 
				*
				* The attribute may be qualified with a namespace prefix which is automatically detected and resolved from the name string.
				*
				* @param name (String) The name of the attribute to set. May include a namespace prefix in the form `<namespace-prefix>:<attribute-name>`
				* @param value (String) The value to set the attribute for the given name to.
				* @param node (Node) The target node whose attribute to set to the given value.
				* @todo: polyfill.
				*/
				setAttribute: function setAttribute(element, name, value, namespace)
				{

					// preconditions

						assert(this.isElement(element), 'Invalid Argument: Object for formal parameter "element" must be DOM element.') ;

					//

						/*Default to the namespace unaware function if either the namespace aware function is not defined, the element is the root element of its document or if no namespace uri was passed.*/

						if(isSet('setAttributeNS', element) && namespace) element.setAttributeNS(namespace, name,	value) ;
						else element.setAttribute(name, value) ;

				},
				/**
				* Get the attribute of the given element node for the given name.
				*
				* @param name The qualified (i.e. attribute name with namespace prefix joined by a colon) or unqualified name for the attribute the value of which is to be retrieved.
				*
				* @return (String)
				* @todo: polyfill.
				*/
				getAttribute: function getAttribute(element, name, namespace)
				{
				
					// preconditions
					
						assert(this.isElement(element), 'Invalid Argument: Object for formal parameter "element" must be DOM element.') ;

					//

						if(isSet(element, 'getAttributeNS') && namespace) return element.getAttributeNS(namespace, name) ;
						else return element.getAttribute(name) ;

					// return 

					return null ;

				},
				/**@todo polyfill*/
				removeAttribute: function removeAttribute(element, name, namespace)
				{
				
					// preconditions
					
						assert(this.isElement(element), 'Invalid Argument: Object for formal parameter "element" must be DOM element..') ;
					
					//
					
						if(isSet(element, 'removeAttributeNS') && namespace) return element.removeAttributeNS(namespace, name) ;
						else return element.removeAttribute(name) ;

				},
				/**@todo polyfill*/
				hasAttribute: function hasAttribute(element, name, namespace)
				{
				
					// preconditions
					
						assert(this.isElement(element), 'Invalid Argument: Object for formal parameter "element" must be DOM element..') ;

					//

						if(isSet(element, 'hasAttributeNS') && namespace) return element.hasAttributeNS(namespace, name) ;
						else return element.hasAttribute(name) ;

					// return 

						return false ;

				},
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
				* @link https://developer.mozilla.org/en-US/docs/DOM/event
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
				* @link name (String) The String identifier of the Event type (e.g. 'load').
				* @link listener (Function, org.meta.web.dom.event.EventListener) A listener object.
				* @link target (Element, Window) The target of the the event listener registration.
				* @todo: capture, legacy (?)
				* @deprecated: refactored into `Events`
				*/
				_addListener: (function( ) {
						if(isSet('addEventListener', DEFAULT_DOCUMENT)) return function addListener(name, listener, target)
						{
					
							//
							

								target.addEventListener(name, listener, false) ;
								
						}
						else if(isSet('attachEvent', DEFAULT_DOCUMENT)) return function addListener(name, listener, target)
						{
						
							//
							
								target.attachEvent('on' + name, listener) ;

						}
						else error('Unknown DOM event model implementation.') ;
				})( ),
				/**
				* @todo: capture, legacy (?)
				* @deprecated: refactored into `Events`
				*/
				_removeListener: (function( ) {
						if(isSet('removeEventListener', DEFAULT_DOCUMENT)) return function removeListener(name, listener, target)
						{
					
							//
							

								target.removeEventListener(name, listener, false) ;
								
						}
						else if(isSet('detachEvent', DEFAULT_DOCUMENT)) return function removeListener(name, listener, target)
						{
						
							//
							
								target.detachEvent('on' + name, listener) ;

						}
						else error('Unknown DOM event model implementation.') ;
				})( )
		}
}