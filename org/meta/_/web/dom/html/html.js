// deprecated

		/**
		* @deprecated: moved to `HTML`
		*/
		Events:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				extend: 'org.meta.standard.Object',
				local: {
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

	// container elements

		/**
		* The common ancestor of all `HTML*` objects in this package.
		* 
		* `HTMLElement` extends `org.meta.web.dom.ElementNode` and extends it with HTML specific functions.
		*/
		HTMLElement:
		{
				extend: 'org.meta.web.dom.ElementNode',
				main: function main(root) { this.root = root ; },
				global:
				{
						create: function create(name, attributes)
						{
								return new this(org.meta.web.dom.html.HTML.create(name, attributes, null)) ;
						}
				},
				local:
				{
						find: function find(selector)
						{
console.log('HTMLElement.find("%s", %s)', selector, this.root) ;
							return org.meta.web.dom.html.HTML.find(selector, this.root) ;
						},
						getClass: function getClass( ) { return org.meta.web.dom.html.HTML.getClass(this.root) ; },
						setClass: function setClass(name)
						{
								org.meta.web.dom.html.HTML.setClass(name, this.root) ;
						}
				}
		},
		
		HTMLWrapperElement:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.web.dom.html.HTMLElement',
				main: function main(root, content)
				{
						this.root = root ;
						this.content = content ;
				},
				local:
				{
						content: null,
						getContentElement: function getContentElement( ) { return this.content ; }
				}
		},
		
	// container elements

		/**
		* A generic container element.
		*
		* A container consists of an outer (`.root`) and inner (`.content`) element the two of which are not identical.
		*/
		HTMLContainerElement:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.web.dom.html.HTMLWrapperElement',
				global:
				{
						create: function create(attributes)
						{

							// variables
							
							var container ;
							
							//

								container = new this(
										org.meta.web.dom.html.HTML.create('div', attributes),
										org.meta.web.dom.html.HTMLElement.create('div')
								) ;

								/*Using `.attach` does not work, since the implicit call to `.append` on this container element will lead to the content element being appended to itself.*/

								DOM.append(
										container.content.root,
										container.root
								) ;
								container.content.parent = container ;
								
							// return
							
							return container ;
						
						}
				},
				local:
				{
						/**
						* Append an instance of `org.meta.web.dom.Node` to this object.
						*
						* This function overrides `.append` in `org.meta.web.dom.Node` in order to append to the content object.
						*/
						append: function append(node)
						{
						
							// preconditions

								Meta.assert(Meta.instanceOf(org.meta.web.dom.Node, node), 'Invalid type for argument `node`.') ;
								Meta.assert(! node.isAttached( ), 'Illegal state: node is still attached.') ;
								
							//

								DOM.append(
										node.root,
										this.content.root
								) ;

							// return
							
							return node ;

						},
						remove: function remove(node)
						{
						
							// preconditions
							
								Meta.assert(Meta.instanceOf(org.meta.web.dom.Node, node), 'Illegal type for argument `node`.') ;
								Meta.assert(this.hasChild(node), 'Illegal state: node is not attached to this node.') ;
								
							//
							
								DOM.remove(
										node.root,
										this.content.root
								) ;
								
							// return
							
							return node ;
						
						}
				}
		},
		
		HTMLDivision:
		{
				extend: 'org.meta.web.dom.html.HTMLContainerElement'
		},

		/**
		* A column container.
		*
		HTMLBlockList:
		{
				extend: 'org.meta.web.dom.html.HTMLContainerElement',
				main: function main(root, content)
				{
				
						this.root = root ;
						this.content = content ;
						
						this.blocks = [ ] ;

				},
				local:
				{
						destroy: function destroy( )
						{
						
								this.blocks.forEach(function(column) { column.destroy( ) ; }) ;
						
								this.super.destroy.call(this) ;
						
						},
						block: null,
						append: function append(block)
						{
						
							// preconditions
							
								if(! Meta.instanceOf(org.meta.web.dom.html.HTMLBlockElement, block)) throw new TypeError('Invalid type for argument `node`') ;
								if(block.parent !== null) throw new Error('Illegal state: given node is attached.') ;
													
							//
							
								/*Reference the new column.*
								
								this.blocks[this.blocks.length] = block ;
/*@todo: test if the given column's root node already was appended to the content element.*
								/*Append the given node to the newly created column and set the parent reference.*

								org.meta.web.dom.xml.XML.append(
										this.content.root,
										block.root
								) ;
								
							// return
							
							return block ;
								
						},
/*@todo: `remove(element: HTMLBlockElement): void`*
						remove: function( ) { throw new Error('Stub.') ; }
				}
		},
*/			
	// content elements

		HTMLContentElement:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.web.dom.html.HTMLWrapperElement',
				local:
				{
						append: function( ) { throw new Error('Unsupported function.') ; },
						remove: function( ) { throw new Error('Unsupported function.') ; }
				}
		},

		/**
		* A single line text element.
		*/
		HTMLLabel:
		{
				extend: 'org.meta.web.dom.html.HTMLContentElement',
				global:
				{
						create: function create(text, attributes)
						{
						
							// variables
							
							var l = null,
								e ;
							
							//


								l = new this(
										Meta.constant('DEFAULT_DOCUMENT')
										.createElement('span')
								) ;

								if(text) l.setText(text) ;
								if(attributes) Meta.each(attributes, function(value, key) { l.setAttribute(key, value) ; }) ;
								
							// return
							
							return l ;
								
						}
				}				
		},

		/**
		* A multiple line text element.
		*/
		HTMLParagraph:
		{
				extend: 'org.meta.web.dom.html.HTMLContentElement',
				global:
				{
						create: function create(text, attributes)
						{
						
							// variables
							
							var p ;
							
							//
/*@todo: add style defaults*/
								p = new this(
										Meta.constant('DEFAULT_DOCUMENT')
										.createElement('p')
								) ;
								
								if(text) p.setText(text) ;
								if(attributes) Meta.each(attributes, function(value, key) { p.setAttribute(key, value) ; }) ;
								
							// return
							
							return p ;
								
						}
				}
		},
		
		/**
		* A block level text-element
		*/
		HTMLHeader:
		{
				extend: 'org.meta.web.dom.html.HTMLContentElement',
				global:
				{
						create: function create(text, attributes)
						{

							// variables
							
							var header ;
							
							//
								
								header = new this(
										org.meta.web.dom.html.HTML.create('div', attributes, text),
										org.meta.web.dom.html.HTMLElement.create('h1')
								) ;

							// return
							
							return header ;

						}
				}
		},
		
	// other elements
	
		HTMLContentList:
		{
		
				extend: 'org.meta.web.dom.html.HTMLElement',
				main: function main(root)
				{ throw new Error('Stub')
						this.root = root ;
						this.items = [ ] ;
				},
				global:
				{
						create: function create(attributes)
						{
							return new this(org.meta.web.dom.html.HTML.create('ul', attributes)) ;
						}
				},
				local:
				{
/*@todo: implement `append(element: HTMLBlockElement): void`.*/
						append: function append(element)
						{ throw new Error('Stub') ;
						
							// preconditions
							
								if(! Meta.instanceOf(org.meta.web.dom.html.HTMLContentElement, element), 'Invalid type for argument `element`.') ;
								
							//
							
								//..
						
						},
/*@todo: implement `remove(element: HTMLBlockElement): void`*/
						remove: function remove(element) { throw new Error('Stub.') ; }
				}
				
		},
	
		HTMLTable:
		{
				extend: 'org.meta.web.dom.html.HTMLElement',
				main: function main(root)
				{
				
						this.root = root ;
						this.head = head ;
						this.body = body ;
						
				},
				global:
				{
						/**
						* Factory function.
						*
						* @param attributes [optional] An attribute map.
						*/
						create: function create(attributes)
						{
						
							// variables
							
							var t ;
							
							//

								t = new this(
										org.meta.web.dom.html.HTML.create('table', attributes),
										org.meta.web.dom.html.HTML.create('thead'),
										org.meta.web.dom.html.HTML.create('tbody')
								) ;
								
							// return
												
							return t ;
						
						}
				},
				local:
				{
						destroy: function destroy( )
						{
/*@todo: remove potential handlers, ...*/
								this.super.destroy.call(this) ;

						},
						append: function( ) { throw new Error('Unsupported function.') ; },
						remove: function( ) { throw new Error('Unsupported function.') ; },
						addColumn: function addColumn(header)
						{
throw new Error('Under Revision') ;
							//

								org.meta.web.dom.html.HTMLElement.find('thead > tr', this)
								.append(org.meta.web.dom.html.HTMLElement.create('th'))
								.append(header) ;
/*@todo: padd rows.*/
							// return
							
							return true ;
						
						},
						addRow: function addRow(data/*...*/)
						{
throw new Error('Under Revision') ;
							// variables
							
							var e ;

							//

								e = org.meta.web.dom.html.HTMLElement.find('tbody', this)
								.append(org.meta.web.dom.html.HTMLElement.create('tr')) ;

								Meta.each(arguments, function(data) {
										e.append(org.meta.web.dom.html.HTMLElement.create('td'))
										.append(data) ;
								}) ;

							// return
							
							return true ;
						
						}
				}
		}
