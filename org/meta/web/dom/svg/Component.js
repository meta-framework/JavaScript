/*
@identifier org.meta.web.dom.svg.Component
@extend org.meta.web.dom.Component,
@require org.meta.web.dom.svg.SVG
@description An svg element wrapper.
*/
{
		local:
		{
				setAttribute: function setAttribute(name, value, namespace)
				{
						SVG.setAttribute(name, value, this.root) ;
				},
				getAttribute: function getAttribute(name, namespace)
				{
						return SVG.getAttribute(name, this.root) ;
				},
				hasAttribute: function hasAttribute(name, namespace)
				{
						return SVG.hasAttribute(name, value, this.root) ;
				}
				
		}
}