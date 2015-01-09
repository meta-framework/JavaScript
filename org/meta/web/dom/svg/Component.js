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
						SVG.setAttribute(this.target, name, value) ;
				},
				getAttribute: function getAttribute(name, namespace)
				{
						return SVG.getAttribute(this.target, name) ;
				},
				hasAttribute: function hasAttribute(name, namespace)
				{
						return SVG.hasAttribute(this.target, name, value) ;
				}
				
		}
}