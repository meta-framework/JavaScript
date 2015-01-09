/*
@abstract
@identifier org.meta.web.dom.html.Paragraph
@extend org.meta.web.dom.html.Text
@require org.meta.web.dom.html.HTML, org.meta.web.dom.html.Component, org.meta.web.css.CSSStyleDeclaration
@description Abstract implementation of a container element wrapping a text element.
*/
{
		global:
		{
				create: function create(document, layout)
				{
				
					// variables
					
					var paragraph,
						element ;
					
					//
					
						element = HTML.createElement(document, 'p') ;
						paragraph = new this(element, new CSSStyleDeclaration(element.style), layout)
						paragraph.setAttribute('id', Component.createComponentID(paragraph)) ;
						paragraph.setAttribute('class', Component.createComponentClass(paragraph)) ;
					
					// return

						return paragraph ;

				}
		}
}