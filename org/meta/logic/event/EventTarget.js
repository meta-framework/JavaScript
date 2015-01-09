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

						org.meta.logic.event.EventTarget.super.invoke('destroy', this) ; // this implies a call to `org.meta.Object.prototype.destroy`
				
				},
				addListener: function addListener(type, listener)
				{

					// preconditions

						assert(isFunction(listener) || isInstanceOf(EventListener, listener), 'Illegal Argument: Object for formal parameter `listener` must be `Function` or instance of `org.meta.logic.event.EventListener`.') ;
				
					// variables
					
					var listeners,
						ring,
						o ;

					//
					
						if(! (listeners = this.listeners)) listeners = this.listeners = { } ;
					
						o = {listener: listener} ;
					
						if(! (ring = listeners[type])) listeners[type] = ringAdd(null, o) ;
						else ringAdd(ring, o) ;

				},
				/**
				* Removes all instances of the given event listener from the event listener collection for the given event name.
				*
				* This operation will _not_ destroy the listener since the caller may want to reuse it.
				*
				* @return (Void)
				*/
				removeListener: function removeListener(type, listener)
				{

					// preconditions
					
						assert(isFunction(listener) || isInstanceOf(EventListener, listener), 'Illegal Argument: Object for formal parameter `listener` must be `Function` or instance of `org.meta.logic.event.EventListener`.') ;
					
					// variables
					
					var top, next,
						listener ;
					
					//
					
						if(! (top = this.listeners[type])) return ;
						else
						{
						
								next = top ;
							
								do
								{
										if(next.listener === listener) // element may be removed
												if(next === top) top = this.listeners[type] = ringPop(next) ; // if this is the top element, adjust the top element and cycle the reference to the top element
												else ringPop(next) ; // if this is not the top element, simply remove it
								}
								while(top && (next = next.next) !== top) ; // the test for the existence of the top element eliminates a fringe case, where a single top element was removed (this leads to infinite recursion, since `next.next` points to `next` and `top` does not equal `next` since `top` is undefined and `next` is an object).
							
								if(! top) this.listeners[type] = null ;
								if(objectEmpty(this.listeners)) this.listeners = null ;
							
						}

				},
				/**
				* @param (String) type The event name.
				* @param (Object) properties An object containing properties characterizing the event.
				*/
				triggerEvent: function triggerEvent(type, properties)
				{
// console.log('%s#triggerEvent (%s)', this.constructor.getType( ), type) ;
					// variables
					
					var top, next,
						event,
						listener,
						callback ;
					
					//
					
						if(! (top = this.listeners[type])) return ;
						else
						{
						
								event = {type: type, target: this, detail: properties.detail} ;
								next = top ;
							
								do
								{

										if((listener = next.listener).hasAttribute(EventListener.EXECUTE_ONCE)) // element may be removed
												if(next === top) top = this.listeners[type] = ringPop(next) ; // if this is the top element, adjust the top element and cycle the reference to the top element
												else ringPop(next) ; // if this is not the top element, simply remove it

										if(isFunction(listener)) listener.call(null, event) ;
										else listener.handleEvent(event) ;

								}
								while(top && (next = next.next) !== top) ; // the test for the existence of the top element eliminates a fringe case, where a single top element was removed (this leads to infinite recursion, since `next.next` points to `next` and `top` does not equal `next` since `top` is undefined and `next` is an object).

						}

				}
		}
}