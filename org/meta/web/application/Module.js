/*
@abstract
@identifier org.meta.web.application.Module
@extend org.meta.Object
@require org.meta.web.dom.DOM
@description A modular (i.e., functional) component of a web based application.
*/
{
		main: function main(component)
		{
				this.component = component ;
		},
		global:
		{
				create: function create( )
				{
						return new this(new Component(HTML.findFirst(DEFAULT_DOCUMENT, 'body'))) ;
				}
		},
		local:
		{
				/**
				* The root component of this module.
				* @type <? extend org.meta.web.dom.Component>
				*/
				component: null,
				destroy: function destroy( )
				{
						this.component.destroy( ) ;
						Module.super.invoke('destroy', this) ;
				},
				/**
				* @todo does enqueueing this way ensure the traversal order is kept?
				*/
				draw: function draw(style)
				{
				
					//
					
					var top,
						component,
						children ;
					
					//
					
						top = ringAdd(null, {component: this.component.children[0], parent: this.component}) ;
					
						/*Perform a breadth first traversal of the component tree and enqueue redraw individual components.*/
						do
						{
						
								component = top.component ;

								enqueue({ // redrawing an entire component tree may block other processes, so we queue the individual steps
										callback: (function(component) { component.draw(style) ; })
										.bind(null, component)
								}) ;
							
								if((children = component.children)) children.forEach(function(child) { ringAdd(top, {component: child, parent: component}) ; }) ;
							
						}
						while((top = ringPop(top))) ;
				
				}
		}
}