/*
@identifier org.meta.web.dom.svg.Circle
@extend org.meta.web.dom.svg.Shape
*/
{
		local:
		{
				setLeft: function setLeft(left) { this.setAttribute('cx', left) ; }
				setTop: function setTop(top) { this.setAttribute('cy', top) ; }
				setRadius: function setRadius(radius) { this.setRadius('r', radius) ; }
		}
}
