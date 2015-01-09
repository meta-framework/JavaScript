/*
@identifier org.meta.web.dom.html.Link
@extend org.meta.web.dom.html.Component
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener, org.meta.web.dom.html.HTML
@description A component wrapper for an html anchor element.
*/
{
		global:
		{
				create: function create(document, layout)
				{
				
					// variables
					
					var link,
						element ;
					
					//
					
						element = HTML.createElement(document, 'a') ;

						link = new this(element, new CSSStyleDeclaration(element), layout)
						link.setAttribute('id', Component.createComponentID(link)) ;
						link.setAttribute('class', Component.createComponentClass(link)) ;

					// return

						return link ;

				}
		},
		local:
		{
				draw: function draw(sheet)
				{

						this.style.addRules(Component.createComponentClassSelector(this), {
								'-moz-user-select': 'none',
								'display': 'inline',
								'position': 'relative'
						}) ;
					
						org.meta.web.dom.html.Link.super.invoke('draw', this, sheet) ;

				},
				redraw: function redraw(sheet) { },
				getLink: function getLink(url)
				{
						return this.link ;
				},
				setLink: function setLink(url)
				{
						HTML.setAttribute(this.target, 'href', url) ;
				},
				onClick: function onClick(callback)
				{
						this.addListener(Events.EVENT_CLICK, EventListener.create(callback, EventListener.PREVENT_DEFAULT)) ;
				}
		}
}