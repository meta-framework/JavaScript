/*
@identifier org.meta.web.dom.svg.SVG
@require org.meta.web.dom.DOM
@link http://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html
*/
{
		type: constant('CONSTRUCTOR_SINGLETON'),
		extend: 'org.meta.web.dom.DOM',
		/**
		* @link https://developer.mozilla.org/en-US/docs/Web/API/DOMImplementation.createDocumentType (SVG document type)
		*/
		main: function main(arguments) { },
		global:
		{
				NAMESPACE_URI: 'http://www.w3.org/2000/svg',
				NAMESPACE_PREFIX: 'svg',
				newElement: function newElement( ) { error('Unsupported operation.') ; },
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

						assert(this.isElement(element), 'Invalid node type for argument `element`.') ;

					//

						/*Default to the namespace unaware function if either the namespace aware function is not defined, the element is the root element of its document or if no namespace uri was passed.*/

						if(isSet('setAttributeNS', element) && namespace) element.setAttributeNS(namespace || SVG.NAMESPACE_URI, name, value) ;
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
					
						assert(this.isElement(element), 'Invalid type for argument `element`.') ;

					//

						if(isSet(element, 'getAttributeNS') && namespace) return element.getAttributeNS(namespace || SVG.NAMESPACE_URI, name) ;
						else return element.getAttribute(name) ;

					// return 

					return null ;

				},
				hasAttribute: function hasAttribute(name, element, namespace)
				{
				
					// preconditions
					
						assert(this.isElement(element), 'Invalid type for argument `element`.') ;

					//

						if(isSet(element, 'hasAttributeNS') && namespace) return element.hasAttributeNS(namespace || SVG.NAMESPACE_URI, name) ;
						else return element.hasAttribute(name) ;

					// return 

					return false ;

				}
		}
}