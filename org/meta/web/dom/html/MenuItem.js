/*
@identifier org.meta.web.dom.html.MenuItem
@extend org.meta.web.dom.html.Component
@require org.meta.web.dom.html.HTML
@description A basic menu controller component.
*/
{
		global:
		{
				LAYOUT_HORIZONTAL: 1,
				LAYOUT_VERTICAL: 1 << 1,
				create: function create(document, layout)
				{
						return Component.create.apply(this, [HTML.createElement(document, 'li'), layout]) ;
				}
		},
		local:
		{
				draw: function draw(sheet)
				{

						if((this.layout & MenuItem.LAYOUT_HORIZONTAL) !== 0)
						{
								this.style.setProperty('display', 'inline-block') ;
								this.style.setProperty('float', 'left') ;
						}
					
						org.meta.web.dom.html.MenuItem.super.invoke('draw', this, sheet) ;

				},
				redraw: function redraw(sheet) { }
		}
}