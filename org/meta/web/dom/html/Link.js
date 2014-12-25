/*
@identifier org.meta.web.dom.html.Link
@extend org.meta.web.dom.html.Component
@require org.meta.web.dom.event.Events, org.meta.web.dom.html.HTML
@description A component wrapper for an html anchor element.
*/
{
		global:
		{
				create: function create(document, layout)
				{
						return Component.create.apply(this, [HTML.createElement(document, 'a'), layout]) ;
				}
		},
		local:
		{
				draw: function draw(sheet)
				{

						this.style.setProperty('-moz-user-select', 'none') ;
						this.style.setProperty('display', 'inline') ;
						this.style.setProperty('position', 'relative') ;
					
						org.meta.web.dom.html.Link.super.invoke('draw', this, sheet) ;

				},
				redraw: function redraw(sheet) { },
				getLink: function getLink(url)
				{
						return this.link ;
				},
				setLink: function setLink(url)
				{
						HTML.setAttribute(this.root, 'href', url) ;
						Events.addListener(this.root, 'click', function(data) { console.log('click: %s', url) ; }) ;
				}
		}
}