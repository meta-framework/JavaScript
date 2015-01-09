/*
@abstract
@identifier org.meta.web.dom.html.Section
@extend org.meta.web.dom.html.Container
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.html.Paragraph
@description Abstract implementation of a container element wrapping multiple paragraphs of text.
*/
{
		/**
		* @link https://developer.mozilla.org/de/docs/Web/CSS/vertical-align
		*/
		local:
		{
				add: function add(paragraph)
				{
				
					// preconditions
					
						assert(paragraph instanceof Paragraph, 'Invalid Argument: Argument for formal parameter "text" must be TextContainer') ;
					
					//
					
						org.meta.web.dom.html.Section.super.invoke('add', this, paragraph) ;
					
						if(! paragraph.hasAttribute('class')) paragraph.setAttribute('class', 'paragraph') ; // flag the paragraph component's root element with a function identifier
					
				},
				remove: function remove(paragraph)
				{
				
					// preconditions
					
						assert(paragraph instanceof Paragraph, 'Invalid Argument: Argument for formal parameter "text" must be TextContainer') ;
					
					//
					
						org.meta.web.dom.html.Section.super.invoke('remove', this, paragraph) ;

				}
		}
}