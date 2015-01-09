/*
@abstract
@identifier org.meta.web.dom.html.Module
@extend org.meta.web.dom.html.Container
@require org.meta.web.css.CSSStyleDeclaration, org.meta.web.dom.Module, org.meta.web.dom.html.HTML, org.meta.web.dom.html.Component
*/
{
		global:
		{
				/**
				* @param (Document) document
				*/
				create: function create(document, layout)
				{
				
					// variables
					
					var module,
						body ;
					
					//
					
						body = HTML.findFirst(document, 'body') ;
						module = new this(body, new CSSStyleDeclaration(body.style), layout) ;
						module.setAttribute('id', Component.createComponentID(module)) ;
						module.setAttribute('class', Component.createComponentClass(module)) ;
					
					// return
					
						return module ;

				}
		},
		local:
		{
				destroy: function destroy( ) { org.meta.web.dom.Module.invoke('destroy', this) ; }, // mix-in of the destructor of org.meta.web.dom.Module
				/**
				* @contract Draw the entire component tree condtained by this module.
				* @implementation The component tree is traversed in breadth first traversal order using the queue in order to avoid blocking calls by filling the call stack.
				* @todo Confirm or disprove: enqueueing ensures the traversal order is the queued call order
				* @todo Report an event "afterDraw" after drawing the component tree.
				*/
				drawModule: function drawModule(sheet)
				{

					//
					
					var self = this,
						top,
						component,
						children ;
					
					//
					
						this.setAttribute('style', 'display: none !important') ;

						top = ringAdd(null, {component: this}) ;
					
						do // perform a breadth first traversal of the component tree and enqueue drawing of individual components
						{
						
								component = top.component ;

								enqueue({ // redrawing an entire component tree may block other processes, so we queue the individual steps
										callback: (function(component) { component.draw(sheet) ; })
										.bind(null, component)
								}) ;
							
								if((children = component.children)) children.forEach(function(child) { ringAdd(top, {component: child}) ; }) ;

						}
						while((top = ringPop(top))) ;
					
						enqueue({callback: function( ) { self.removeAttribute('style') ; }}) ;
				
				},
				/**
				* @contract Redraw the entire component tree condtained by this module.
				*/
				redrawModule: function redraw(sheet)
				{

					//
					
					var top,
						component,
						children ;
					
					//
console.log('Module#redrawModule') ;
						top = ringAdd(null, {component: this}) ;
					
						do // perform a breadth first traversal of the component tree and enqueue drawing of individual components
						{
						
								component = top.component ;

								enqueue({ // redrawing an entire component tree may block other processes, so we queue the individual steps
										callback: (function(component) { console.log(component) ; component.redraw(sheet) ; })
										.bind(null, component)
								}) ;
							
								if((children = component.children)) children.forEach(function(child) { ringAdd(top, {component: child}) ; }) ;

						}
						while((top = ringPop(top))) ;
				
				}
		}
}