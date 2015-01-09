/*
@abstract
@identifier org.meta.web.dom.Module
@extend org.meta.web.dom.Component
@require org.meta.web.dom.Component
@description A modular (i.e., functional) component of a web based application.
@implementation This type is implemented as a sub type of "org.meta.web.dom.Component" wrapping the document body.
@contract Module instances must be top level controllers handling data, presentation and logic of an application function.
@todo A tree iterator might come in handy here.
*/
{
		global:
		{
				/**
				* @abstract
				*/
				create: function create(document) { }
		},
		local:
		{
				/**
				* The job stack of this component.
				*
				* @type Stack<Object>
				*/
				stack: null,
				destroy: function destroy( )
				{
				
					// variables
					
					var iterator,
						top,
						component,
						children,
						length, i = 0 ;
					
					//

						/*Remove event listeners.*/
						org.meta.web.dom.event.EventTarget.invoke('destroy', this) ; // skip the destructor of org.meta.web.dom.Component since we do not want to remove the body element from the document

						/*Iterate over all descendant components and destroy them.*/
						if((children = this.children))
						{
							
								if((length = children.length) > 0)
								{
								
										top = ringAdd(null, {component: children[0]}) ;
									
										while(++i < length) ringAdd(top, {component: children[i]}) ;
									
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
									
								}
							
						}

				}
		}
}