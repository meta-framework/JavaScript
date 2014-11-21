/*
@identifier org.meta.web.dom.svg.Image,
@extend org.meta.web.dom.svg.Component
@require org.meta.web.dom.DOM, org.meta.web.dom.svg.Circle, org.meta.web.dom.svg.Path
*/
{
		global: {
				create: function create(height, width)
				{
console.log('Image.create') ;
					// variables
					
					var image,
						d,
						i ;
					
					//
					
						i = constant('DEFAULT_DOCUMENT')
						.implementation ;
						
						/*Create an empty SVG document to spawn elements from.*/
					
						d = i.createDocument(
								SVG.NAMESPACE_URI,
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
					
						circle = Circle.create(DOM.newElement('circle', DOM.ownerOf(this.root), SVG.NAMESPACE_URI)) ;
						
						circle.setLeft(left) ;
						circle.setTop(top) ;
						circle.setRadius(radius) ;
						
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
					
						path = Path.create(DOM.newElement('path', DOM.ownerOf(this.root), SVG.NAMESPACE_URI)) ;
						path.setAttribute('d', polyline) ;

						path.attach(this) ;
						
					// return
					
					return path ;

				}
		}
}