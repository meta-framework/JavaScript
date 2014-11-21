/*
@identifier org.meta.web.dom.svg.Path
@extend org.meta.web.dom.svg.Shape,
*/
{
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