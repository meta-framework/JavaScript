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

						HTML.append((list = HTML.createElement(document, 'ul')), menu.root) ;
						HTML.setAttribute(list, 'class', '-list') ;
					
					// return
					
						return menu ;

				}
		},
		local:
		{
				add: function add(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be `MenuItem`.') ; // only allow instances of `MenuItem`
						
					//
					
						Component.invoke('add', this, item) ;
						
						if(! item.hasClass('-list-item')) item.addClass('-list-item') ; // add a class name identifying the list items for easy selection

				},
				attach: function attach(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be `MenuItem`.') ;
						
					// variables
					
					var list ;
					
					//

						if((list = HTML.findFirst(this.root, stringFormat('#%s > ul.-list', this.getID( ))))) HTML.append(item.root, list) ;
						else error('Illegal State: Unable to find list container.') ;

				},
				remove: function add(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be `MenuItem`.') ; // only allow instances of `MenuItem`
						
					//
					
						Component.invoke('remove', this, item) ;

				},
				detach: function detach(item)
				{
				
					// preconditions
					
						assert(isInstanceOf(MenuItem, item), 'Invalid Argument: Argument for formal parameter "item" must be `MenuItem`.') ;
						
					// variables
					
					var list ;
					
					//

						if((list = HTML.findFirst(this.root, stringFormat('#%s > ul.-list', this.getID( ))))) HTML.remove(item.root, list) ;
						else error('Illegal State: Unable to find list container.') ;

				},
				draw: function draw(sheet)
				{
				
					//
					
this.style.setProperty('list-style-type', 'none') ;
						org.meta.web.dom.html.Menu.super.invoke('draw', this, sheet) ;
				
				},
				redraw: function redraw(sheet) { }
		}
}