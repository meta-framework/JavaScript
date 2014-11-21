/*
@package org.meta.web.dom.svg
@require org.meta.standard, org.meta.web.dom
@provide SVG, Component, Image, Shape, Path, Circle
*/
(function( ) {
var DOM = org.meta.web.dom.DOM ;
return {
		/**
		* @link http://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html
		*/
		SVG:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				extend: 'org.meta.web.dom.DOM',
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createDocumentType (SVG document type)
				*/
				main: function main(arguments) { },
				local:
				{
						NAMESPACE_URI: 'http://www.w3.org/2000/svg',
						NAMESPACE_PREFIX: 'svg',
						newElement: function newElement( ) { Meta.error('Unsupported operation.') ; },
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

								if(Meta.isSet('setAttributeNS', element) && namespace) element.setAttributeNS(namespace || org.meta.web.dom.svg.SVG.NAMESPACE_URI, name, value) ;
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

								if(Meta.isSet(element, 'getAttributeNS') && namespace) return element.getAttributeNS(namespace || org.meta.web.dom.svg.SVG.NAMESPACE_URI, name) ;
								else return element.getAttribute(name) ;

							// return 

							return null ;

						},
						hasAttribute: function hasAttribute(name, element, namespace)
						{
						
							// preconditions
							
								Meta.assert(this.isElement(element), 'Invalid type for argument `element`.') ;

							//

								if(Meta.isSet(element, 'hasAttributeNS') && namespace) return element.hasAttributeNS(namespace || org.meta.web.dom.svg.SVG.NAMESPACE_URI, name) ;
								else return element.hasAttribute(name) ;

							// return 

							return false ;

						}
				}
		},
		/**
		* An svg element wrapper.
		*/
		Component:
		{
				extend: 'org.meta.web.dom.Component',
				local:
				{
						setAttribute: function setAttribute(name, value, namespace)
						{
								org.meta.web.dom.svg.SVG.setAttribute(name, value, this.root) ;
						},
						getAttribute: function getAttribute(name, namespace)
						{
								return org.meta.web.dom.svg.SVG.getAttribute(name, this.root) ;
						},
						hasAttribute: function hasAttribute(name, namespace)
						{
								return org.meta.web.dom.svg.SVG.hasAttribute(name, value, this.root) ;
						}
						
				}
		},
		Image:
		{
				extend: 'org.meta.web.dom.svg.Component',
				global: {
						create: function create(height, width)
						{
console.log('Image.create') ;
							// variables
							
							var image,
								d,
								i ;
							
							//
							
								i = Meta.constant('DEFAULT_DOCUMENT')
								.implementation ;
								
								/*Create an empty SVG document to spawn elements from.*/
							
								d = i.createDocument(
										org.meta.web.dom.svg.SVG.NAMESPACE_URI,
										'svg:svg',
										i.createDocumentType('svg:svg', '-//W3C//DTD SVG 1.1//EN', 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd')
								) ;
								
								image = new this(d.documentElement) ;
								image.setAttribute('width', width) ;
								image.setAttribute('height', height) ;
										
							// return
							
							return image ;

						}
				},
				local:
				{
						drawCircle: function drawCircle(left, top, radius)
						{
console.log('Image.drawCircle') ;
							// variables
							
							var circle ;
							
							//
							
								circle = org.meta.web.dom.svg.Circle.create(DOM.newElement('circle', DOM.ownerOf(this.root), org.meta.web.dom.svg.SVG.NAMESPACE_URI)) ;
								
								circle.setAttribute('cx', left) ;
								circle.setAttribute('cy', top) ;
								circle.setAttribute('r', radius) ;
								
								circle.attach(this) ;
								
							// return
							
							return circle ;
						
						},
						drawPath: function newPath(polyline)
						{
console.log('Image.drawPath') ;
							// variables
							
							var path ;
							
							//
							
								path = org.meta.web.dom.svg.Path.create(DOM.newElement('path', DOM.ownerOf(this.root), org.meta.web.dom.svg.SVG.NAMESPACE_URI)) ;
								path.setAttribute('d', polyline) ;

								path.attach(this) ;
								
							// return
							
							return path ;

						}
				}
		},
		Shape:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.web.dom.svg.Component',
				local:
				{
						setStroke: function setStroke(color) { this.setAttribute('stroke', color) ; },
						setStrokeWidth: function setStrokeWidth(width) { this.setAttribute('stroke-width', width) ;	},
						setFill: function setFill(color) { this.setAttribute('fill', color) ; }
				}
		},
		Circle:
		{
				extend: 'org.meta.web.dom.svg.Shape'
		},
		Path:
		{
				extend: 'org.meta.web.dom.svg.Shape',
				local:
				{
						position_x: -1,
						position_y: -1,
						moveTo: function moveTo(x, y)
						{
								this.setAttribute('d', this.getAttribute('d') + ' ' + 'M' + x + ',' + y) ;
								this.position_x = x ;
								this.position_y = y ;
						},
						lineTo: function lineTo(x, y)
						{
								this.setAttribute('d', this.getAttribute('d') + ' ' + 'L' + x + ',' + y) ;
								this.position_x = x ;
								this.position_y = y ;
						},
						closePath: function closePath( ) { this.setAttribute('d', this.getAttribute('d') + ' Z') ; },
						reset: function reset( ) { this.setAttribute('d', '') ; }
				}
		}
} ;
})( )