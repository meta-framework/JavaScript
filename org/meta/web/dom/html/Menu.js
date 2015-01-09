/*
@identifier org.meta.web.dom.html.Menu
@extend org.meta.web.dom.html.Container
@require org.meta.web.dom.html.HTML, org.meta.web.dom.html.Component, org.meta.web.dom.html.MenuItem
@description A basic menu controller component.
*/
{
		global:
		{
				LAYOUT_HORIZONTAL: Container.LAYOUT_ALIGN_RIGHT << 1,
				LAYOUT_VERTICAL: Container.LAYOUT_ALIGN_RIGHT  << 2,
				create: function create(document, layout)
				{
				
					// variables
					
					var menu,
						list ;
					
					//
					
						menu = Menu.super.create.apply(this, [document, layout]) ;

						HTML.append((list = HTML.createElement(document, 'ul')), menu.target) ;
						HTML.setAttribute(list, 'class', 'list') ;
					
					// return
					
						return menu ;

				}
		},
		local:
		{
				add: function add(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be MenuItem.') ; // only allow instances of `MenuItem`
						
					//
					
						Component.invoke('add', this, item) ;
						
						if(! item.hasClass('list-item')) item.addClass('list-item') ; // add a class name to the list item element for easy selection

				},
				remove: function add(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be enuItem.') ; // only allow instances of `MenuItem`
						
					//
					
						Component.invoke('remove', this, item) ;

				},
				attach: function attach(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be MenuItem.') ;
						
					// variables
					
					var list ;
					
					//

						if((list = HTML.findFirst(this.target, stringFormat('#%s .list', this.getID( ))))) HTML.append(item.target, list) ;
						else error('Illegal State: Unable to find list container.') ;

				},
				detach: function detach(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be MenuItem.') ;
						
					// variables
					
					var list ;
					
					//

						if((list = HTML.findFirst(this.target, stringFormat('#%s .list', this.getID( ))))) HTML.remove(item.target, list) ;
						else error('Illegal State: Unable to find list container.') ;

				},
				draw: function draw(sheet)
				{
				
					//
					
						this.style.addRules(Component.createComponentClassSelector(this), {'list-style-type': 'none'}) ;
						org.meta.web.dom.html.Menu.super.invoke('draw', this, sheet) ;
				
				},
				redraw: function redraw(sheet) { }
		}
}