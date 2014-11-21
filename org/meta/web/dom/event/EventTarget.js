/*
@identifier org.meta.web.dom.event.EventTarget
@extend org.meta.logic.event.EventTarget
@require org.meta.web.dom.DOM, org.meta.web.dom.html.HTML
@todo should be moved to `org.meta.web.dom.event` since not only HTML documents have an event model (e.g. SVG documents too).
*/
{
		main: function main(target) { this.listeners = [ ] ; this.target = target ; },
		global:
		{
				EVENT_READY: 'ready',
				EVENT_LOAD: 'load',
				EVENT_UNLOAD: 'unload',
				create: function create(target, listeners)
				{
					
					// preconditions
					
						assert(DOM.isElement(target) || isWindow(target), 'Invalid type for formal parameter `target`.') ;

					// return
				
					return new this(target) ;

				}
		},
		local:
		{
				addListener: function addListener(name, listener)
				{
					
					//

						org.meta.logic.event.EventTarget.invoke('addListener', this, [name, listener]) ;

						/*Add the event listener to the target.*/

						HTML.addListener(name, listener, this.target) ;
				
				},
				removeListener: function removeListener(name, listener)
				{
				
					//
					
						org.meta.logic.event.EventTarget.invoke('removeListener', this, [name, listener]) ;
						
						HTML.removeListener(name, listener, this.target) ;
					
				},
				/**
				* Remove all listeners for a given name.
				*/
				removeAllListeners: function removeAllListeners(name)
				{

					// variables
					
					var a,
						i,
						l ;
						
					//

						if((a = this.listeners[name]))
						{
						
								i = a.length ;
								
								while(--i >= 0)
								{
								
										l = a[i] ;

										HTML.removeListener(name, l, this.target) ;
										
								}
								
						}
						
						delete this.listeners[name] ;

				},
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
				*/
				onReady: (function( ) {
				
					// variables
					
					var d ;
					
					//
					
						d = constant('DEFAULT_DOCUMENT') ;
					
						if(isSet('readyState', d)) return function onReady(listener)
						{
						
							// variables
							
							var target = this,
								d,
								f ;
								
							//
							
								d = constant('DEFAULT_DOCUMENT') ;
								f = function( ) { target.triggerEvent(EventTarget.EVENT_READY) ; } ;
														
								if(d.readyState === 'complete') f( ) ;
								else d.onreadystatechange = function( ) { if(d.readyState === 'complete') f( ) ; } ;
								
						}
						else return function onReady(listener)
						{
						
							// variables
							
							var target = this,
								d,
								l ;
								
							//
							
								d = constant('DEFAULT_DOCUMENT') ;
								l = EventListener.create(function( ) { target.triggerEvent(EventTarget.EVENT_READY) ; }) ;
								
								if(this.target === d) this.addListener('DOMContentLoaded', l, EventListener.ATTRIBUTE_EXECUTE_ONCE) ;
								else
								
										EventTarget.create(d)
										.addListener('DOMContentLoaded', l, EventListener.ATTRIBUTE_EXECUTE_ONCE) ;
						
						}
				})( )
		}
}