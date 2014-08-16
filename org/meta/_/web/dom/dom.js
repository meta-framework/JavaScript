/**
* org.meta.web.dom library set-up script
* @author Friedrich Alexander Kurz, 2013, f.a.kurz@googlemail.com
*/

(function( ) {

Meta.define(  {
		/*A Node collection wrapper.*/
		name: "Collection",
		package: "org.meta.web.dom",
		main: function main(target)
		{
		
			// variables
			
			var s ;
			
			//

				switch((s = Meta.typeOf(target))) {
						case Meta.STRING_TYPE_NULL: { this.nodes = [] ; break ; }
						case Meta.STRING_TYPE_NODE: { this.nodes = [nodes] ; break ; }
						case Meta.STRING_TYPE_ARRAY: { this.nodes = target ; }
						case Meta.STRING_TYPE_DOMCOLLECTION: { this.nodes = Meta.copy(target) ;break ; }
						default: {
						
								if( Meta.instanceOf(this.constructor,target) ) this.nodes = target.nodes ;
								else Meta.error("Invalid type for parameter target (type=%1;).", s) ;

						}
				}

		},
		local: {
				nodes: null,
				index: -1,
				size: function size( ) { return this.nodes !== null ? this.nodes.length : 0 ; },
				isEmpty: function isEmpty( ) { return this.size( ) === 0 ; },
				item: function item(index)
				{
					//
					
						if(this.nodes != null) { return Meta.isSet("item",this.nodes) ? this.nodes.item(index) : this.nodes[index] ; }
						
					// return 
					
					return null ;

				},
				remove: function remove(index)
				{

					// preconditions
					
					Meta.assert(this.index === -1, "Concurrent modification.") ;
					Meta.assert(index < this.nodes.length, "Index exceeds bounds.") ;
					
					// variables
					
					var n = null ;
					
					//
					
						n = this.nodes.splice(index,1) ;


					// return
					
					return n ;
					
				},
				add: function add(node)
				{

					// preconditions
					
					Meta.assert(this.index === -1, "Concurrent modification.") ;
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;
						
					//

						this.nodes[this.nodes.length] = node ;

					// return
					
					return this ;
				
				},
				each: function each(callback,context)
				{

					// preconditions
					
					Meta.assert(this.index === -1, "Concurrent modification.") ;
					
					// variables
					
					var i = this.nodes.length, o = context || this ;

					//
					
						/*The boundary index is dynamically assessed in order to reflect changes to the underlying Array (e.g. using `Collection.filter`).*/
					
						while(++this.index < this.nodes.length) {
								if(  callback.apply( o, [ this.index, this.nodes[this.index] ] )  ===  false  ) { break ; }
						}
						
						this.index = -1 ;
						
					// return
					
					return this ;
				
				},
				filter: function filter(callback,context)
				{
				
					// variables
					
					var c = this, o = context || this ;

					//

						this.each(  function(index,node) {
						
								if( callback.call(o,node) === false ) {

										c.nodes.splice(index,1) ;
										c.index-- ;

								}

						},
						o ) ;

					// return
					
					return this ;

				}
		}
})
.define({
		/**
		* @see org.meta.core.Listener
		* @source https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/DOM3-Events.html#interface-EventListener
		*/
		name: "Listener",
		package: "org.meta.web.dom",
		prototype: "org.meta.core.Listener",
		require: ["org.meta.web.dom.DOM"],
		main: function main(name, callback, owner)
		{
		
			// preconditions
			
			Meta.assert(Meta.isFunction(callback) || Meta.isObject(callback), "Invalid type for parameter `callback`.") ;
			Meta.assert(org.meta.web.dom.DOM.isElement(owner) || org.meta.web.dom.DOM.isDocument(owner) || Meta.isWindow(owner), "Invalid type for parameter target.") ;
			
			// variables
			
			var o ;
			
			//
			
				this.name = name ;
				
				if(Meta.isFunction(callback))
				{
				
						this.callback = callback ;
						this.target = owner || this ;
						this.singleton = false ;
						
				}
				else if(Meta.isObject(callback))
				{

						this.callback = callback.callback ;
						this.target = owner || this ;
						
						o = callback.parameter ;
						
						this.parameter = !! o ? Meta.isArray(o) ? o : [o] : null ;
						this.singleton = callback.singleton || false ;
						
				}
		
		},
		local: {
				node: null,
				/**A proxy for `handle` to comply with the W3C `EventListener` interface specification.*/
				handleEvent: function handleEvent(event)
				{

					//
			
						this.handle(event) ;

				}
		}
})
.define({
		name: "DOM",
		package: "org.meta.web.dom",
		prototype: "org.meta.core.Object",
		type: Meta.STRING_OBJECT_TYPE_SINGLETON,
		require: ["org.meta.core.Schedule","org.meta.web.dom.Listener"],
		main: function main(arguments)
		{
		
			// variables
			
			var a ;
			
			//
			
				/*Window, Document ready.*/
				
				Meta.DEFAULT_VIEW.onload = function( ) { org.meta.web.dom.DOM.WINDOW_READY = true ; }
				
				/*@Note(Poll the document for completion of parsing.)*/
				
				org.meta.web.dom.DOM.DOCUMENT_READY = false ;
				
				a = [[0, Meta.DEFAULT_DOCUMENT.getElementsByTagName("*")]] ;
				
				new org.meta.core.Schedule(10, true)
				.onComplete({
					
						callback: function(parameter, event) {

							var i ;

								if(parameter[0] === parameter[1].length) {
								
										org.meta.web.dom.DOM.DOCUMENT_READY = true ;
										
										if(!! (o = org.meta.web.dom.DOM.getProperty(Meta.DEFAULT_DOCUMENT, "EVENT_LISTENERS"))) {
												if(!! (a = o["ready"])) { Meta.each( a, function(index,listener) { listener.handleEvent(null) ; } ) ; }
										}
																				
								}
								else {
										
										this.reset( )
										.start( ) ;
										
								}
								
						},
						parameter: a

				})
				.add({
						/*Update the node count parameter.*/
						callback: function(parameter) { parameter[0] = parameter[1].length ; },
						parameter: a
				})
				.start( ) ;

		},
		local: {
		
				VIEW_READY: false,
				DOCUMENT_READY: false,

				/*Use the integer values for the node type on `Node` to get a `String` key. Zero is unmapped.*/

				XML_NODE_TYPES: [null,"#element","#attribute","#text","#cdata-section","#entity-reference","#entity","#processing-instruction","#comment","#document","#document-type","#document-fragment","#notation"],
				HTML_ELEMENT_NAME_SCRIPT: "script",
				HTML_ELEMENT_NAME_IMG: "img",
				HTML_ELEMENT_NAME_SCRIPT: "script",
				HTML_ELEMENT_NAME_OBJECT: "object",
				HTML_ELEMENTS_LOADABLE: ["window","script","img","object"],
				NAMESPACE_PREFIX_XMLNS: "xmlns",
				NAMESPACE_PREFIX_HTML: "html",
				NAMESPACE_URI_XMLNS: "http://www.w3.org/2000/xmlns",
				NAMESPACE_URI_XHTML: "http://www.w3.org/1999/xhtml",
				
				/*-----Node assessment functions.------*/

				isDocument: function isDocument(node) { return this.typeOf(node) === Node.DOCUMENT_NODE ; },
				isComment: function isComment(node) { return this.typeOf(node) === Node.COMMENT_NODE ; },
				isElement: function isElement(node) { return this.typeOf(node) === Node.ELEMENT_NODE ; },
				/*@ToDo(More node type functions.)*/
				/**
				Test wheter the given node is its owner document's root Node.
				@Param node A target Node.
				@Return Boolean
				*/
				isRoot: function isRoot(node) { return this.typeOf(node.parentNode) === Node.DOCUMENT_NODE ; },
				/**Test whether the given Node is part of the document for the current location.*/
				isLive: function isLive(node){ return this.typeOf(node) !== Node.DOCUMENT_NODE ? this.isDescendant(node,Meta.DEFAULT_DOCUMENT) : false ; },
				/**Defaults to true because HTML nodes aren't necessarily identified with the xhtml namespace URI.*/
				isHTML: function isHTML(node) { return this.namespaceOf(node) === this.NAMESPACE_URI_XHTML || true ; },
				isLoadable: function isLoadable(object)
				{

					// variables

					var s ;
					
					// 
					
						if(  ( s = Meta.typeOf(object) )  ===  Meta.STRING_TYPE_WINDOW  ) { return true ; }
						else if(s === Meta.STRING_TYPE_NODE) {

								s = this.nameOf(object) ;
								
								for(var name in this.HTML_ELEMENTS_LOADABLE) {
										if(name === s) { return true ; }
								}
								
						}
					
					// return 

					return false ;

				},
				isSameNode: function isSameNode(A,B)
				{
				
					// variables
					
					var i ;
					
					//

						if( Meta.isSet("isSameNode",A) ) { return A.isSameNode(B) ; }
						else if( !! (i = A.sourceIndex) ) { return B.sourceIndex === i ; }
						else { Meta.error("Unable to compare nodes.") ; }
						
					// return
					
					return false ;

				},
				isCommented: function isCommented(node)
				{
					
					// variables
					
					var b = false ;
					
					//
					
						if( ! Meta.isNull(node.innerHTML) ) { return node.innerHTML.indexOf("<!--") !== -1 ; }
						else {

								Meta.each(
										node.childNodes,
										function(index,node){
												if( this.isComment(node) ) { b = true ; return false; }
										},
										this
								) ;
								
								return b ;
						
						}
						
					// return
					
					return false ;

				},
				/**
				*Return a Boolean value indicating whether the given element contains itself element nodes.
				*@Param (Element) The target element.
				*/
				isContainer: function isContainer(element)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(element), "Invalid node type for parameter element.") ;
				
					// variables
					
					var b = false, nl, i ;
					
					// 
					
						if( Meta.isSet("firstElementChild",node) ) { b = !! element.firstElementChild ; }
						else {
						
								nl = node.childNodes ;
								i = nl.length ;
								
								while(b === false && --i >= 0) {
										if( this.isElement( nl.item(i) )  ) { b = true ; }
								}

						}
					
					// return 
					
					return b ;

				},
				/*@Deprecated*/
				isEmpty: function isEmpty(node) { throw "Deprecated" ; return ! this.isContainer(node) ; },
				/**
				* Check if the given potential descendant Node is contained by the given potential ancestor Node.
				* @link http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-compareDocumentPosition
				* @link http://ejohn.org/blog/comparing-document-position/
				* @link http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
				* @Param descendant (Node) The potential descendant Node.
				* @Param ancestor (Node) The potential ancestor Node.				
				* @Return Boolean
				*/
				isDescendant: function isDescendant(descendant,ancestor)
				{

					// variables

					var b = false, i, e ;

					// 

						/* Exclude Document Nodes since they cannot be contained by other Nodes. */

						if( this.typeOf(descendant) !== 9 ) {

								/*Get a reference to the document Element in order to distinguish between IE and W3 compliancy by checking
								*for the respective implementation of `compareDocumentPosition` and `contains`.*/

								i = this.typeOf(ancestor) ;
								
								/*@Note("Document Nodes in IE do not implement the  `contains` method. That being the case we need to 
								*instead use the default Document's root Element. This will work even if the given descendant Node is itself 
								*the default Document's root Node since `contains` returns true if the same Node is passed to it as its
								*parameter")*/

								e = (i === 9) ? ancestor.documentElement : ancestor.ownerDocument.documentElement ;

								if( Meta.isSet("compareDocumentPosition",e) ) { //!! W3
										if(  !!  ( ancestor.compareDocumentPosition(descendant) & 16 )  ) { b = true ; }
								}
								else if( Meta.isSet("contains",e) ) { //!! IE, early versions of SF

										if(i === 9) { b = e.contains(descendant) ; }
										else {
												if( ancestor.contains(descendant) ) { b = ! this.isSameNode(ancestor,descendant) ; }
										}

								 }

						}

					// return 

					return b ;

				},
				/**
				*Return the type of the selected `Node`.
				*@Link http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-111237558
				*@Link https://developer.mozilla.org/en/nodeType
				*@Return Integer
				*/
				typeOf: function typeOf(node) { return node.nodeType ; },
				valueOf: function valueOf(node) { return node.nodeValue ; },
				/**
				@Note Both the `Node.namespaceURI` and `Node.prefix` properties have been deprecated according to MDN.
				@Note `Node.lookupNamespaceURI` will return the default namespace if the prefix String passed to it is null.
				*/
				namespaceOf: function namespaceOf(node)
				{
				
					// variables
					
					var s = null ;
					
					//

						if( this.isElement(node) )  {
								if(  !!!  ( s = this.getAttribute(node,"xmlns") )  ) { s = node.lookupNamespaceURI( this.prefixOf(node) ) ; }
						}
						else if( this.isDocument(node) ) { s = this.namespaceOf(node.documentElement) ; }
						
					//
					
					return s ;
					
				},
				prefixOf: function prefixOf(node)
				{
				
					// variables
					
					var s, i ;
					
					//
					
						s = node.nodeName.toLocaleLowerCase( ) ;
						
						if(  ( i = s.indexOf(":") )  !==  -1  ) { return s.substring(0,i) ; }
						
					// return
					
					return null ;

				},
				/**
				*Return the name of the selected `Node`. This equals the unqualified name (without namespace prefix) for element nodes and the node name for all other nodes.
				*@Link https://developer.mozilla.org/en/DOM/Node.nodeName
				*@Link http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-F68D095
				*@Return String
				*/
				nameOf: function nameOf(node)
				{
				
					// variables
					
					var s, i ;
					
					//
					
						s = node.nodeName.toLocaleLowerCase( ) ;
						
						if( this.isElement(node) ) {
								if(  ( i = s.indexOf(":") )  !==  -1  ) { return s.substr(i + 1) ; }
						}
						
					// return
					
					return s ;

				},
				/**
				*Get the index of this Element Node within its parent Node's child Node collection.
				*@Return Integer
				*/
				/*@Reviewed*/
				/*@ToDo(For browsers supporting the nodeIndex property, this might be reduced to an arithmetic algorithm in O(1), i.e. `node.nodeIndex - node.parentNode.firstChild.nodeIndex`*/
				indexOf: function indexOf(node)
				{
				
					// variables
					
					var i = -1, n ;
					
					// 
					
						n = node ;

						do { i++ ; }
						while( !! (n = n.previousSibling) ) ;
					
					// return 
					
					return i ;

				},
				/**
				*Get the offset of this Node relative to siblings of the same type. Positions like indices are zero based integer values.
				*@Param node (Node) The target `Element` `Node`.
				*@Return Integer
				*/
				positionOf: function positionOf(node)
				{

					// variables
				
					var i = -1, s, n ;

					// 
					
						s = this.typeOf(node) ;
						n = node ;
						
						do {
								if( this.typeOf(n) === s ) { i++ ; }
						}
						while( !! (n = n.previousSibling) ) ;

					// return

					return i ;

				},
				parentOf: function parentOf(node) { return node.parentNode ; },
				childrenOf: function childrenOf(node) { return Array.prototype.slice.call(node.childNodes,0) ; },
				
				/*-----Node creation, serialization, etc. functions. (By convention all of the functions below have the relevent node parameter as the first parameter.)------*/

				/**
				* Create an `Element`.
				* @note 1 IE does not implement namespace aware DOM methods.
				* @Param name (String) The tag name of the `Element` to create.
				* @Param doc (Document) The optional `Document` to create an `Element` for (defaults to `Meta.DEFAULT_DOCUMENT`).
				* @Param uri (String) The optional namespace URI for the `Element` to create.
				* @Return Element
				*/
				createElement: function(document,name,uri)
				{

				
					// preconditions
					
					Meta.assert(this.isDocument(document), "Invalid type for parameter document.") ;

					// variables

					var e = null, s ;

					// 

						s = uri || this.namespaceOf(document) ;

						if( Meta.isSet("createElementNS",document) ) { e = document.createElementNS(s,name) ; }
						else { e = document.createElement(name) ; }

					// return 

					return e ;

				},
				/**
				* Create a `DocumentFragment` `Node`.
				* @Param doc (Document) The optional `Document` to create a document fragment `Node` for (defaults to `Meta.DEFAULT_DOCUMENT`).
				* @Return Node
				*/
				createFragment: function(document) { return document.createDocumentFragment( ) ; },
				/**
				* Create a text `Node`.
				* @Param text (String) The text content of the text `Node` to create.
				* @Param doc (Document) The optional `Document` to create a text `Node` for (defaults to `Meta.DEFAULT_DOCUMENT`).
				* @Return Node
				*/
				createText: function(document,text) { return document.createTextNode(text) ; },
				/**
				*Clone a `Node`.
				*@Param node (Node) The `Node` to clone.
				*@Param deep (Boolean) Boolean flag to indicate whether the descendant `Node`s of the given `Node` shall be
				*recursively imported.
				*@Return Node
				*/
				cloneNode: function(node,deep)
				{
			
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// variables

					var n = null ;

					// 

						n = node.cloneNode(deep || false) ;
						
						/*@ToDo("Clone data and listeners.")*/
						
						//..

					// return 

					return n ;

				},
				/**
				Import a Node to the given Document.
				@Param node (Node) The Node to import.
				@Param doc (Document) The optional `Document` to create a text `Node` for (defaults to `Meta.DEFAULT_DOCUMENT`).
				@Param deep (Boolean) Boolean flag to indicate whether a recursive import on the descendant Nodes of this Node shall be performed.
				@Return Node
				*/
				importNode: function importNode(node,document,deep)
				{

					// variables

					var n = null, o1, o2, nl, e, s ;

					// 

						if( ! this.isDocument(node) ) {
						
							/*@Note("IE does not support `Document.importNode` until version 9.")*/

							if(  ! Meta.isSet("importNode",document)  ||  Meta.IS_IE_9  ) {
throw "Deprecated" ;
								o1 = this.getDoctype(document) ;
								o2 = this.getDoctype(node.ownerDocument) ;

								if( node.nodeType === 1 ) { // Element Nodes

									if( o1.name === org.meta.web.dom.DOM.DOCUMENT_NAME_HTML && !!! o1.namespaceURI ) {

											if( o2.name === org.meta.web.dom.DOM.DOCUMENT_NAME_HTML && !!! o2.namespaceURI ) { // HTML to HTML import

													e = this.createElement(document, node.nodeName.toLocaleLowerCase( )) ;
													e.innerHTML = node.outerHTML ;

													n = e.childNodes[1] ;

											}
											else { // XML to HTML import

													/*@Note("Expand self-closing tags as they are not valid HTML.")*/

													node.ownerDocument.setProperty("SelectionLanguage","XPath") ;
													nl = node.selectNodes(".//*[not(node())]") ;
													Meta.each(
															nl,
															function(index,descendant) { descendant.text = " " ; }
													) ;

													n = this.createElement(document, node.nodeName.toLocaleLowerCase( )) ;

													Meta.each(
															node.attributes,
															function(index,attribute) { n.setAttribute(attribute.nodeName,attribute.nodeValue) ; }
													) ;

													Meta.each(
															node.childNodes,
															function(index,node) { n.innerHTML += node.xml ; }
													) ;

											}

									}
									else {

											if(o2.name === org.meta.web.dom.DOM.DOCUMENT_NAME_HTML && !!! o2.namespaceURI) {
													Meta.error("Import of Nodes from HTML to XML not supported.") ;
											}
											else { n = document.importNode(node,true) ; }

									}

								}
								else { throw TypeError("Importing for non-Element Nodes for IE currently not supported.") ; }

							}
							else { n = document.importNode(node,!!deep) ; }

						}

					// return 

					return n ;

				},
				/**
				*Serialize the given `Node` to a `String` representation.
				*@Param node (Node) The target Node.
				*@Return String
				*/
				printMarkup: function printMarkup(node)
				{

					// variables

					var s = null ;

					// 
					
						/*@Note("Use the `outerHTML` property for nodes of a HTML DOM. Otherwise use XML methods/properties.")*/

						if( Meta.isNull( (s = node.outerHTML) )  ) {

								if( Meta.IS_IE) { s = node.xml ; }
								else if(Meta.DEFAULT_VIEW.XMLSerializer) {
								
										s = new XMLSerializer( )
										.serializeToString(node) ;

								}

						}

					// return 

					return s ;

				},
				/**
				@Link http://stackoverflow.com/questions/10228304/parse-xml-with-javascript
				*/
				parseMarkup: function parseMarkup(string)
				{
				
					// variables
					
					var n = null ;
					
					//
					
						if( ! Meta.isNull(DOMParser) ) {
						
								n = new DOMParser( )
								.parseFromString(string,"text/xml") ;
						
						}
						else {
						
								n = new ActiveXObject("XMLDOM") ;
								n.async = false ;
								n.loadXML(string) ;
						
						}
						
						n = n.documentElement ;
					
					// return
					
					return n ;
				
				},
				parseTemplate: function parseTemplate(string,variables)
				{
				
					// variables
					
					var n = null, s, e ;
					
					//
					
						s = Meta.format.apply(  null, [string].concat( Array.prototype.slice.call(arguments,1) )  ) ;
						
						e = this.createElement(Meta.DEFAULT_DOCUMENT,"div") ;
						e.innerHTML = s ;
						
						n = DOM.importNode(
								this.findFirst(e,"*"),
								Meta.DEFAULT_DOCUMENT,
								true
						) ;

					// return
					
					return n ;
					
				},
				
				/*-----Node retrieval functions-----*/

				findElements: function findElements(node,name,namespace)
				{

					// variables
					
					var a = null, s, b, n, i ;
					
					//
					
						s = namespace || this.namespaceOf(node) ;

						b = ( this.isElement(node) && this.isHTML(node) ) ;
						n = b || this.isDocument(node) ? node : node.ownerDocument ;

						if( Meta.isSet("getElementsByTagNameNS",n) ) { a = Array.prototype.slice.call( n.getElementsByTagNameNS(s,name), 0 ) ; }
						else {
						
								s = s + ":" + name ;
								a = Array.prototype.slice.call( n.getElementsByTagName(s), 0 ) ;
								
						}

						/*@Note(Unlike XML elements, HTML elements have a `getElementsByTagName` (or, `getElementsByTagNameNS`) function which eliminates the need to filter a node collection for descendants. For XML elements this additional step has to be taken.)*/
						
						if( ! b && (i = a.length) > 0 ) {
						
								while(--i >= 0) {
								
										n = a[i] ;
										
										if( ! this.isDescendant(n,node) ) { a.splice(i,1) ; }

								}

						}

					// return
					
					return a ;
				
				},
				findChildren: function findChildren(node,name,namespace)
				{

					// variables
					
					var a = null, s, n ;
					
					//
				
						a = [] ;
						s = namespace || this.namespaceOf(node) ;

						Meta.each(
						
								node.childNodes,
								function(index,node) {

										if( this.namespaceOf(node) === s ) {
												/*@Note(The String parameter `name` may reference the tag name of an element node or the node type identifier of a Node.)*/
												if((this.isElement(node) && (name === "*" || this.nameOf(node) === name))  ||  this.XML_NODE_TYPES[this.typeOf(node)] === name) { a[a.length] = node ; }
										}

								},
								this
								
						) ;

					// return
					
					return a  ;
				
				},
				findFirst: function findFirst(node,name,namespace)
				{
				
					// variables
					
					var n = null, s ;
					
					//
					
						s = namespace || this.namespaceOf(node) ;
						
						Meta.each(
								node.childNodes,
								function(index,node) {
								
										if(this.namespaceOf(node) === s) {
										
												if((this.isElement(node) && (name === "*" || this.nameOf(node) === name))  ||  this.XML_NODE_TYPES[this.typeOf(node)] === name) {
												
														n = node ;
														
													return false ;

												}

										}
								
								},
								this
						) ;
					
					// return
					
					return n ;
				
				},
				
				/*-----Node modification functions-----*/

				appendTo: function append(target,node)
				{

					// 

						target.appendChild(node) ;

					// return 
					
					return this ;

				},
				insertTo: function insert(target,node,index)
				{
					
					// variables

					var nl, i;

					// 

						nl = target.childNodes ;
						
						if(  ( i = nl.length - 1  ) >  index  ) {
								this.current.insertBefore( node, nl.item(index) ) ;
						}
						else if(i === index) { target.appendChild(node) ; }

					// return 
					
					return this ;
				
				},
				prependTo: function prepend(target,node)
				{

					// variables
					
					var n ;
					
					// 

						if( !! (n = target.firstChild) ) { target.insertBefore(node,n) ; }
						else { target.appendChild(node) ; }

					// return 
					
					return this ;

				},
				/*Replace the given node with the current node.*/
				replace: function replace(target,node)
				{

					// variables
					
					var n ;
					
					// 

						if( !! (n = target.parentNode) ) {
						
								n.insertBefore(node,target) ;
								n.removeChild(target) ;

						}
						
					// return 
					
					return this ;

				},
				remove: function remove(node)
				{ 
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// variables
					
					var n ;
					
					// 

						if( !! (n = node.parentNode) ) { n.removeChild(node) ; }
						
					// return 
					
					return this ;

				},
				/*@ToDo(For HTML Nodes `node.innerHTML=""` might be more efficient.)*/
				clear: function clear(node)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// variables
					
					var n ;

					// 

						while( !! (n = node.firstChild) ) { node.removeChild(n) ; }
					
					// return 
					
					return this ;

				},
				
				/*-----Node assessment functions-----*/

				/**
				*Test whether the given Node contains text content other than whitespace.
				*@Param node (Node) The target Node.
				*@Return Boolean
				*/
				hasText: function hasText(node)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// variables

					var b = false, s ;

					// 

						if(  !!  ( s = this.getText(node) )  ) { b = s !== Meta.STRING_EMPTY ; }

					// return 

					return b ;

				},
				/**
				*Set the text content of the given Node.
				*@note IE only lets us change the text content after the window#load Event has completed. There
				*is no apparent reason or explanation for that. As a fallback, if the text cannot be set directly
				*we'll clear the current Node and append a text Node containing the given text String.
				*@note Changing the text content of a STYLE Element will not work in IE≤8. To change the rules of a stylesheet use the methods exposed by the `CSSStyleSheet` `Object` or use a `org.meta.web.css.StyleSheet`.
				*@Link http://msdn.microsoft.com/en-us/library/ms533899(v=vs.85).aspx
				*@Link https://developer.mozilla.org/En/DOM/Node.textContent
				*@Link http://www.w3.org/TR/2004/REC-DOM-Level-3-Core-20040407/core.html#Node3-textContent
				*@Link http://www.phpied.com/dynamic-script-and-style-elements-in-ie/
				*@Param text (String) The String value to set the Node's text content to.
				*@Param node (Node) The Node whose text content to change.
				*@Return this
				*/
				setText: function setText(node,text)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// 

						if( Meta.isSet("innerText",node) ) { node.innerText = text ; }
						else if( Meta.isSet("textContent",node) ) { node.textContent = text ; }

					// return 
					
					return this ;

				},
				/**
				*Get the given `Node`'s text content.
				*@Param node (Node) The target Node.
				*@Return String
				*/
				getText: function getText(node)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					// variables
					
					var s = null ;

					// 

						if( ! Meta.isSet("textContent",node) ) {

								try { s = node.innerText ; }
								catch(error) { }

						}
						else { s = node.textContent ; }

					// return 
					
					return s ;

				},
				/**
				*Add a text `Node` with the given text content to the given `Node`.
				*@Param node (Node) The target Node.
				*return this
				*/
				addText: function addText(node,text)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;

					//

						this.append( this.createText(node.ownerDocument,text) ) ;
						
					// return 
					
					return this ;

				},
				hasAttribute: function hasAttribute(element,name)
				{
								
					// preconditions
					
					Meta.assert(this.isElement(element), "Invalid type for parameter element.") ;
					
					//
				
						return !! this.getAttribute(element,name) ;
						
				},
				/**
				*Set an attribute of the given Node to the given value. The attribute may be qualified with a namespace prefix
				*which is automatically detected.
				*@Param name (String) The name of the attribute to set.
				*@Param value (String) The value to set the attribute for the given name to.
				*@Param node (Node) The target node whose attribute to set to the given value.
				*@Return this
				*/
				setAttribute: function setAttribute(element,name,value,namespace)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(element), "Invalid type for parameter element.") ;

					// variables

					 var i, a, s ;

					// 

						/*@Note("The root Element for a Document typically is used to declare XML namespace prefixes. Namespace-aware methods
						will therefore return null for attributes with namespace-qualified names. We may default to the namespace-unaware method
						in that case simply passing the qualified name as the parameter as though it was in fact not qualified.)*/
						
						i = name.indexOf(Meta.CHARACTER_COLON) ;

						if(  ( Meta.isSet("setAttributeNS",element)  &&  i !== -1 )  &&  ( ! org.meta.web.dom.DOM.isRoot(element) )  ) {

//								s = i !== - 1 ? name.substring(0,i) : name ;

								/* Get the namespace URI for the given namespace prefix. */

								element.setAttributeNS(
										namespace || DOM.namespaceOf(element),
										name,
										value
								) ;

						}
						else { element.setAttribute(name,value) ; }
						
					// return 
					
					return this ;

				},
				/**
				*@Param name The qualified (i.e. attribute name with namespace prefix joined by a colon) or unqualified name for the attribute the value of which is to be retrieved.
				*return String
				*/
				getAttribute: function getAttribute(element,name)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(element), "Invalid type for parameter element.") ;
				
					// variables

					var s = null, n, a ;

					// 

							if(! Meta.IS_OPERA) {
									if(  !!  ( n = element.getAttributeNode(name) )  ) { s = n.nodeValue ; }
							}
							else {

									if(  ( a = name.split(Meta.CHARACTER_COLON) ).length  ===  1  ) {
											if(  !!  ( n = element.getAttributeNode(name) )  ) { s = n.nodeValue ; }
									}
									else { s = element.getAttributeNS(  this.resolveNamespace( a[0] ),  a[1]  ) ; }

							}

					// return 

					return s ;

				},
				/**
				*Remove the attribute by the given name from the currently selected Element. The attribute name may be 
				*qualified with a namespace prefix.
				*@Link https://developer.mozilla.org/en/DOM/element.removeAttributeNode
				*@Param attribute (String) The name of the attribute to remove.
				*@Param node (Node) The target node.
				*@Return this
				*/
				removeAttribute: function removeAttribute(element,name)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(element), "Invalid type for parameter element.") ;

					// variables

					var n ;

					//

						if(  !!  ( n = element.getAttributeNode(name) )  ) { element.removeAttributeNode(n) ; }
					
					// return 
					
					return this ;

				},
				hasProperty: function hasProperty(node,key)
				{
				
					// preconditions
					
					Meta.assert(Meta.isNode(node), "Invalid type for parameter node.") ;
					
					//

					return !! this.getProperty(key,node) ;

				},
				getProperty: function getProperty(target,key)
				{

					// preconditions
					
					Meta.assert(Meta.isNode(target)||Meta.isWindow(target), "Invalid type for parameter target.") ;

					// variables
					
					var o ;
					
					// 
					
						if( Meta.isSet("getUserData",target) ) { o = target.getUserData(key) ; }
						else {
								if(  !! ( o = target["USER_DATA"] )  ) { o = Meta.isSet(key,o) ? o[key] : null ; }
						}
					
					// return 
					
					return o ;

				},
				setProperty: function setProperty(target,key,value)
				{

					// preconditions
					
					Meta.assert(Meta.isNode(target)||Meta.isWindow(target), "Invalid type for parameter target.") ;

					// variables
					
					var o ;
					
					// 
					
						if( Meta.isSet("setUserData",target) ) { target.setUserData(key,value,null) ; }
						else {
								
								if(  !!!  ( o = target["USER_DATA"] )  ) { o = target["USER_DATA"] = { } ; }

								o[key] = value ;

						}

					// return 
					
					return this ;

				},
				clearProperty: function clearProperty(target,key) { this.setProperty(target,key,null) ; },
				
				/*-----Event handling functions. (By convention the relevant target parameter is the first parameter in all the functions below).-----*/

				/**
				@Link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
				@Link https://developer.mozilla.org/en-US/docs/DOM/event
				@Link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
				@Param name (String) The String identifier of the Event type (e.g. "load").
				@Param listener (Function,Object) The listener specification.
				@Param target (Element,Window) The target of the the event listener registration.
				*/
				addListener: function addListener(target,name,listener)
				{					

					// preconditions

					Meta.assert(this.isElement(target) || Meta.isWindow(target), "Invalid type for parameter target.") ;

					// variables
					
					var s ;
					
					//
					
						l = new org.meta.web.dom.Listener(name,listener,target) ;

						if( Meta.isSet("addEventListener",target) ) { target.addEventListener(name,l,false) ; }
						else if( Meta.isSet("attachEvent",target) ) { target.attachEvent( "on" + name, l ) ; }
						
						this.registerListener(target,l) ;

					// return 
					
					return this ;
				
				},
				removeListener: function removeListener(target,listener)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(target)||Meta.isWindow(target), "Invalid type for parameter target.") ;
					Meta.assert( Meta.instanceOf(org.meta.web.dom.Listener,listener), "Invalid type for parameter listener." ) ;
					
					// variables
					
					var o, s, a, i ;
					
					//
					
						if(  !!  ( o = this.getProperty(target,"EVENT_LISTENERS") )  ) {
						
								if(  !!  ( a = o[s] )  )  {
								
										s = listener.instanceId( ) ;
										
										for( i = a.length ; --i >= 0 ; ) {
												if( a[i].instanceId( ) === s ) { a.splice(i,1) ; }
										}
										
										if(a.length === 0) { o[s] = null ; }
								
								}
						
						}

					// return 
					
					return this ;

				},
				/**
				@Note The target of the listener registration may differ from the listener's target reference; hence it must be passed as a parameter.
				*/
				registerListener: function registerListener(target,listener)
				{

					// preconditions
					
					Meta.assert(this.isElement(target) || this.isDocument(target) || Meta.isWindow(target), "Invalid type for parameter target.") ;
					Meta.assert( Meta.instanceOf(org.meta.web.dom.Listener, listener), "Invalid type for parameter listener." ) ;
					
					// variables
					
					var s, o, a ;
					
					//
					
						s = listener.name ;
						
						if( !!! ( o = this.getProperty(target,"EVENT_LISTENERS") )  ) { this.setProperty(  target, "EVENT_LISTENERS", ( o = { } ) ) ; }
								
						if(  !!!  ( a = o[s] )  ) { a = o[s] = [ ] ; }
								
						a[a.length] = listener ;
					
					// return
					
					return this ;
				
				},
				/**
				@Link http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-DocumentEvent
				*/
				reportEvent: function reportEvent(target,name,event)
				{
				
					// preconditions
					
					Meta.assert(this.isElement(target)||this.isDocument(target)||Meta.isWindow(target), "Invalid type for parameter target.") ;

					// variables
					
					var o, a, i ;
					
					//
					
						o = this.getProperty("EVENT_LISTENERS",target) ;
						
						if(  !!  ( a = o[name] )  ) {
						
								i = a.length ;

								while(--i >= 0) { a[i].handleEvent(event) ; }
						
						}

					// return
					
					return this ;
				
				},
				/*@ToDo(Ready handlers should always be singleton.)*/
				onReady: function onReady(listener)
				{
				
					// variables
					
					var l ;
					
					//

						l = Meta.instanceOf(org.meta.web.dom.Listener, listener) ? listener : new org.meta.web.dom.Listener("ready", listener, Meta.DEFAULT_DOCUMENT) ;
						
						if(this.DOCUMENT_READY) { l.handleEvent(null) ; }
						else { this.registerListener(Meta.DEFAULT_DOCUMENT, l) ; }
						
					// return
					
					return this ;
				
				}
		}
}) ;

})( ) ;