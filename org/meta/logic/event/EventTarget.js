/*
@identifier org.meta.logic.event.EventTarget
@extend org.meta.logic.Setable
@require org.meta.logic.event.EventListener
@description Basic implementation of an Object which raises events in the event model.
@todo test; prevent concurrent modification of listener collection
*/
{
		main: function main(argv)
		{
				this.listeners = { } ;
		},
		local: {
				/**@type Object*/
				listeners: null,
				destroy: function destroy( )
				{

					//

						/*Destroy the listeners map./
						objectDestroy(this.listeners) ;
*/
						org.meta.logic.event.EventTarget.super.invoke('destroy', this) ; // this implies a call to `org.meta.Object.prototype.destroy`
				
				},
				addListener: function addListener(event, listener)
				{
// console.log('%s#addListener (%s)', this.constructor.getType( ), event) ;
// console.log('listener-ring (pre):') ;
// console.dir(this.listeners[event]) ;
					// preconditions

						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
				
					// variables
					
					var listeners,
						o ;

					//
					
						o = {listener: listener} ;
					
						if(! (listeners = this.listeners[event])) this.listeners[event] = ringAdd(null, o) ;
						else ringAdd(listeners, o) ;
// console.log('listener-ring (post):') ;
// console.dir(this.listeners[event]) ;

//						if(! (a = this.listeners[name])) { this.listeners[name] = a = [ ] ; }
						
						/*Prevent duplicate listener registration.*/
//						if(a.indexOf(listener) === -1) a[a.length] = listener ;

				},
				/**
				* Removes all instances of the given event listener from the event listener collection for the given event name.
				*
				* This operation will _not_ destroy the listener since the caller may want to reuse it.
				*
				* @return (Void)
				*/
				removeListener: function removeListener(event, listener)
				{

					// preconditions
					
						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
					
					// variables
					
					var top, next,
						listener ;
					
					//
					
						if(! (top = this.listeners[event])) return ;
						else
						{
						
								next = top ;
							
								do
								{
										if(next.listener === listener) // element may be removed
												if(next === top) top = this.listeners[event] = ringPop(next) ; // adjust the top element and cycle the reference to the top element
												else ringPop(next) ; // simply remove the element (this can't be the top element therefore at least two elements exist)
								}
								while((next = next.next) !== top) ;
							
						}
/*@deprecated
						if((a = this.listeners[name]))
								if((i = a.indexOf(listener)) !== -1)
										return arrayRemove(a, i) ;
*/
				},
				/**
				* @param (String) event The event name.
				* @param (Object) detail An object the properties of which characterize the event.
				*/
				triggerEvent: function triggerEvent(event, detail)
				{
// console.log('%s#triggerEvent (%s)', this.constructor.getType( ), event) ;
// console.log('listener-ring:') ;
// console.dir(this.listeners[event]) ;
					// variables
					
					var top, next,
						data,
						listener ;
					
					//
					
						if(! (top = this.listeners[event])) return ;
						else
						{
						
								data = {type: event, target: this, detail: detail} ;
								next = top ;
							
								do
								{
										if((listener = next.listener).hasAttribute(EventListener.EXECUTE_ONCE)) // element may be removed
												if(next === top) top = this.listeners[event] = ringPop(next) ; // adjust the top element and cycle the reference to the top element
												else ringPop(next) ; // simply remove the element (this can't be the top element therefore at least two elements exist)
										listener.handleEvent(data) ;
								}
								while((next = next.next) !== top) ;

						}

				}
		}
}