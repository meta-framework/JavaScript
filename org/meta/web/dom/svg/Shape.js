/*
@identifier org.meta.web.dom.svg.Shape
@type abstract
@extend org.meta.web.dom.svg.Component

*/
{
		local:
		{
				setStroke: function setStroke(color) { this.setAttribute('stroke', color) ; },
				setStrokeWidth: function setStrokeWidth(width) { this.setAttribute('stroke-width', width) ;	},
				setFill: function setFill(color) { this.setAttribute('fill', color) ; }
		}
}