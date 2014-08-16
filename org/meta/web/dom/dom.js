/*
@package org.meta.web.dom
@require org.meta.standard
@provide DOM, NodeList, NodeIterator, Component
*/
{

		DOM: {
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				local: {
				
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
							
								if(this.isDocument((n = this.ownerOf(node)))) return org.meta.web.dom.DOM.isSame(n.documentElement, node) ;
								
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
								if(Meta.isSet('isSameNode', Meta.constant('DEFAULT_DOCUMENT').documentElement))
										return function isSame(a, b)
										{
												return a.isSameNode(b) ;
										} ;
								else return function isSame(a, b) { return a === b ; }
						})( ),
						/**
						* Test if the first given node is a descendant of the second given node.
						*
						* @todo polyfill
						*/
						isDescendant: (function( ) {

								if(Meta.isSet('compareDocumentPosition', Meta.constant('DEFAULT_DOCUMENT')))
										return function isDescendant(node, ancestor) { return !! (node.compareDocumentPosition(ancestor) & 16) ; }
								else return function isDescendant(node, ancestor) { Meta.error('`Node.prototype.compareDocumentPosition` is not supported.') ; }

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

								if(Meta.isSet('lookupPrefix', node)) { return node.lookupPrefix(this.namespaceOf(node)) ; }
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
												
												if(Meta.isSet('namespaceURI', node)) return node.namespaceURI ;
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
							return new org.meta.web.dom.NodeIterator(node.childNodes) ;
						},
						
					// creation, modification, retrieval functions
/*@todo: XML create.*/
						newElement: function newElement(name, document, namespace)
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
						find: function(selector, context)
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
						*/
						setText: function setText(text, node)
						{

/*@todo: use `(function(){})` function to determine the correct `setText` algorithm upon parsing.*/
							//

								if(Meta.isSet('innerText', node)) { node.innerText = text ; }
								else if(Meta.isSet('textContent', node)) { node.textContent = text ; }

						},
						/**
						*Get the given node's text content.
						* @todo: remove polyfill.
						* @return String
						*/
						getText: function getText(node)
						{

							// variables
							
							var s = null ;

							// 

								if(! Meta.isSet('textContent', node)) {

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
										node.getOwner( )
										.createTextNode(text)
								) ;

						},
						/**
						* Set an attribute of the given element node to the given value. 
						*
						* The attribute may be qualified with a namespace prefix which is automatically detected and resolved from the name string.
						*
						* @todo: polyfill.
						* @param name (String) The name of the attribute to set. May include a namespace prefix in the form `<namespace-prefix>:<attribute-name>`
						* @param value (String) The value to set the attribute for the given name to.
						* @param node (Node) The target node whose attribute to set to the given value.
						*/
						setAttribute: function setAttribute(name, value, element, namespace)
						{

							// preconditions

								Meta.assert(this.isElement(element), 'Invalid node type for argument `element`.') ;

							//

								/*Default to the namespace unaware function if either the namespace aware function is not defined, the element is the root element of its document or if no namespace uri was passed.*/

								if(Meta.isSet('setAttributeNS', element) && namespace) element.setAttributeNS(namespace, name,	value) ;
								else element.setAttribute(name, value) ;

						},
						/**
						* Get the attribute of the given element node for the given name.
						*
						* @todo: polyfill.
						* @param name The qualified (i.e. attribute name with namespace prefix joined by a colon) or unqualified name for the attribute the value of which is to be retrieved.
						*
						* @return (String)
						*/
						getAttribute: function getAttribute(name, element, namespace)
						{
						
							// preconditions
							
								Meta.assert(this.isElement(element), 'Invalid type for argument `element`.') ;

							//

								if(Meta.isSet(element, 'getAttributeNS') && namespace) return element.getAttributeNS(namespace, name) ;
								else return element.getAttribute(name) ;

							// return 

							return null ;

						},
						hasAttribute: function hasAttribute(name, element, namespace)
						{
						
							// preconditions
							
								Meta.assert(this.isElement(element), 'Invalid type for argument `element`.') ;

							//

								if(Meta.isSet(element, 'hasAttributeNS') && namespace) return element.hasAttributeNS(namespace, name) ;
								else return element.hasAttribute(name) ;

							// return 

							return false ;

						}
				}
		},

		NodeList:
		{
				extend: 'org.meta.standard.Iterable',
				main: function main(nodes)
				{
						this.nodes = nodes ;
				},
				global:
				{
						create: function create(nodes)
						{

							// preconditions

								Meta.assert(Meta.instanceOf(NodeList, nodes), 'Invalid type for argument `list`') ;
								
							// return
							
							return new this(nodes) ;
						
						}
				},
				local:
				{
						get: function get(index) { return this.nodes.item(index) ; },
						length: function length( ) { return this.nodes.length ; },
						iterator: function iterator( ) { return org.meta.web.dom.NodeIterator.create(this) ; }
				}
		},

		NodeIterator:
		{
				extend: 'org.meta.standard.Iterator',
				global:
				{
						create: function create(nodes)
						{

							// preconditions
							
								Meta.assert(Meta.instanceOf(org.meta.web.dom.NodeList, nodes), 'Invalid type for argument `list`') ;

							// return
							
							return new this(nodes) ;
							
						}
				}
		},
		
		/**
		* An object wrapper for a (partial) DOM element tree.
		*/
		Component:
		{
		
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.standard.Object',
				main: function main(root)
				{
						this.root = root ;
						this.children = [ ] ;
				},
				global: {
						create: function create(root)
						{
						
							// preconditions
							
								Meta.assert(Meta.isNode(root), 'Illegal Argument: invalid type for formal parameter `root`.') ;
								Meta.assert(org.meta.web.dom.DOM.isElement(root), 'Illegal Argument: invalid node type for formal parameter `root`.') ;
								
							// return
							
								return new this(root) ;

						}
				},
				local:
				{
						/** @type Node*/
						root: null,
						/**@type Component*/
						parent: null,
						/**
						* @type Component[]
						*/
						children: null,
						destroy: function destroy( )
						{
						
								this.children.forEach(function(component) { component.destroy( ) ; }) ;
								this.root.destroy( ) ;

								if(this.super.destroy) this.super.destroy.call(this) ;

						},
						isDetached: function isDetached( ) { return this.parent === null && ! this.root.parentNode ; },
						isAttached: function isAttached( )
						{
								return this.parent !== null && this.parent.hasChild(this) && org.meta.web.dom.DOM.contains(this.parent.root, this.root) ;
						},
						
						hasChild: function hasChild(component)
						{
								return this.children.indexOf(component) !== -1 ;
						},
						
						migrate: function migrate(document, deep)
						{

							// variables
							
							var e ;
							
							//
							
								if((e = document.adoptNode(this.root, deep))) this.root = e ;
								else Meta.error('Unable to migrate to target document.') ;
						
						},
						
						/**
						* Attach this component to the given parent component.
						*
						* This function delegates the execution of the required DOM manipulation to the parent component in order to accountt for complex DOM structures with differing insertion logics. The `.parent` property is set to the given component.
						*/
						attach: function attach(parent)
						{

							// preconditions
						
								if(! (parent instanceof org.meta.web.dom.Component)) Meta.error('Illegal type for argument `parent`') ;
								if(this.parent !== null) Meta.error('Illegal state: component is attached.') ;
								
							//

								parent.append(this) ;
								this.parent = parent ;
								
						},
						/**
						* Remove this component from its parent component.
						*
						* This function delegates the execution of the required DOM manipulation to the parent component in order to account for complex DOM structures with differing insertion logics. The `.parent` property is set to null.
						*/
						detach: function detach( )
						{
						
							// preconditions
							
								Meta.assert(this.parent !== null, 'Illegal state: node is detached.')
							
							//
						
								this.parent.remove(this) ;
								this.parent = null ;

						},
						/**
						* Append another DOM component.
						*
						* This function has the responsibility to implement the DOM manipulation logic required for appending the root elements of other components to this component. It must be overriden in case `.root` is _not_ the element to append child component's root elements to.
						* This operation will detect and automatically adopt the root element of the component in case that the owning documents differ.
						*
						* @param (Component) component Another component.
						*/
						append: function append(component)
						{

							// preconditions

								Meta.assert(Meta.instanceOf(org.meta.web.dom.Component, component), 'Illegal Argument: invalid type for formal parameter `component`.') ;
								Meta.assert(component !== this, 'Illegal Argument: cannot append component to itself') ;
								
							// variables
							
							var d ;
							
							//
							
								d = org.meta.web.dom.DOM.ownerOf(this.root) ;

								/*Adopt the node tree (if necessary)*/
								
								if(! org.meta.web.dom.DOM.isSame(d, org.meta.web.dom.DOM.ownerOf(component.root)))
								{

										if(component.isAttached( )) component.detach( ) ;
										
										component.migrate(d, true) ;

								}
								
								
								/*Add the component's root element to the root element of this component.*/
								
								org.meta.web.dom.DOM.append(component.root, this.root) ;
								
								this.addChild(component) ;
								
							// postcondition
							
								Meta.assert(org.meta.web.dom.DOM.isDescendant(this.root, component.root), 'Illegal state: root element of component is not a descendant of this component\'s root element.') ;

						},
						/**
						* Remove a child component from this component.
						*
						* This function has the responsibility to implement the DOM manipulation logic required for removing the root element of other component from to this component. It must be overriden in case `.root` is _not_ the element to append child component's root elements to.
						*/
						remove: function remove(component)
						{
						
							// preconditions
							
								Meta.assert(Meta.instanceOf(org.meta.web.dom.Component, component), 'Invalid type for argument `component`.') ;
								Meta.assert(component !== this, 'Illegal Argument: cannot remove component from itself') ;
								
							// variables
							
							var i ;
							
							//							
								
								/*Remove the component's root element from the root element of this component.*/

								org.meta.web.dom.DOM.remove(component.root, this.root) ;
								
								this.removeChild(component) ;
						
						},						
						addChild: function addChild(component)
						{
						
							// preconditions
							
								Meta.assert(this.children.indexOf(component) === -1, 'Illegal State: duplicate child component.') ;

							//
							
								this.children[this.children.length] = component ;

						},
						
						removeChild: function removeChild(component)
						{
						
							//
						
								if((i = this.children.indexOf(component))) this.children.splice(i, 1) ;
								else Meta.error('Illegal State: component to be removed is not contained within its parents child collection.') ;
						
						},
						/**
						* Set an attribute of this component's root element.
						*/
						setAttribute: function setAttribute(name, value, namespace) { org.meta.web.dom.DOM.setAttribute(name, value, this.root, namespace) ; },
						/**
						* Get the value of an attribute of this component's root element.
						*/
						getAttribute: function getAttribute(name, namespace) { return org.meta.web.dom.DOM.getAttribute(name, this.root, namespace) ; },
						hasAttribute: function hasAttribute(name, namespace) { return org.meta.web.dom.DOM.hasAttribute(name, this.root, namespace) ; }
				}

		}
}