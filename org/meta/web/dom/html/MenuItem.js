/*
@identifier org.meta.web.dom.html.MenuItem
@extend org.meta.web.dom.html.Component
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.html.HTML
@description A basic menu controller component.
*/
{
		global:
		{
				LAYOUT_HORIZONTAL: 1,
				LAYOUT_VERTICAL: 1 << 1,
				create: function create(document, layout)
				{
				
					// variables
					
					var item,
						element ;
					
					//
					
						element = HTML.createElement(document, 'li') ;

						item = new this(element, new CSSStyleDeclaration(element), layout)
						item.setAttribute('id', Component.createComponentID(item)) ;
						item.setAttribute('class', Component.createComponentClass(item)) ;
					
					// return

						return item ;

				}
		},
		local:
		{
				draw: function draw(sheet)
				{

						if((this.layout & MenuItem.LAYOUT_HORIZONTAL) !== 0) this.style.addRules(Component.createComponentClassSelector(this), {'display': 'inline-block', 'float': 'left'}) ;
					
						org.meta.web.dom.html.MenuItem.super.invoke('draw', this, sheet) ;

				},
				redraw: function redraw(sheet) { }
		}
}