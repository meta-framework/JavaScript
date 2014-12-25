/*
@abstract
@identifier org.meta.web.application.Module
@extend org.meta.Object
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
						error('Unsuppported Operation: Abstract type') ;
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
				
					// variables
					
					var top,
						component,
						children ;
					
					//
// console.log('Module#destroy (%s)', this.constructor.getType( )) ;
						top = ringAdd(null, {component: this.component}) ;
					
						do  // perform a queued breadth first traversal of the component tree
						{
						
								component = top.component ;

								enqueue({ // redrawing an entire component tree may block other processes, so we queue the individual steps
										callback: (function(component) { component.destroy( ) ; })
										.bind(null, component)
								}) ;
							
								if((children = component.children)) children.forEach(function(child) { ringAdd(top, {component: child}) ; }) ;

						}
						while((top = ringPop(top))) ;

						org.meta.web.application.Module.super.invoke('destroy', this) ;
//console.log('\t> destroyed-module:') ;
//console.dir(this) ;
				},
				/**
				* @implementation The component tree is traversed in breadth first traversal order using the queue in order to avoid blocking calls by filling the call stack.
				* @todo Confirm or disprove: enqueueing ensures the traversal order is the queued call order
				*/
				draw: function draw(style)
				{
// console.log('%s#draw', this.constructor.getType( )) ;
					//
					
					var top,
						component,
						children ;
					
					//
					
						top = ringAdd(null, {component: this.component/*, parent: this.component*/}) ;
					
						do // perform a breadth first traversal of the component tree and enqueue redraw individual components
						{
						
								component = top.component ;

								enqueue({ // redrawing an entire component tree may block other processes, so we queue the individual steps
										callback: (function(component) { component.draw(style) ; })
										.bind(null, component)
								}) ;
							
								if((children = component.children)) children.forEach(function(child) { ringAdd(top, {component: child/*, parent: component*/}) ; }) ;
//console.log('\t> child-count (%s): %s', component.constructor.getType( ), component.children.length) ;
						}
						while((top = ringPop(top))) ;
				
				}
		}
}