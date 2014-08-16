/*
@package org.meta.web.dom.xml
@require org.meta.standard
@provide Node, Element
*/
{
/*@todo: the node wrapping objects might be superfluous.*/
		/**
		* A singleton object which provides XML DOM utility functions.
		*/
		XML:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				extend: 'org.meta.web.dom.DOM',
				local:
				{
				}
		}
}
