/*
@identifier org.meta.logic.event.EventTarget
@extend org.meta.standard.Settable
@require org.meta.logic.event.EventListener
@description Basic implementation of an Object which raises events in the event model.
*/
{
		local: {
				listeners: null,
				/*Add a `Listener` to the listener map. 
				*
				* To conform with this function the formal parameter `listener` must be an object which is an or inherits from `org.meta.logic.event.EventListener`. This makes sure that when removing listeners, the strict equality operator `===` may be used to remove the correct listener as well as making sure that no listener is added redundantly.
				* @bug: does not correctly inherit `destroy( ):void` when used as prototype.
				*/
				destroy: function destroy( )
				{

					//
				
						/*Remove all listeners.*/
						
						for(var name in this.listeners) this.removeAllListeners(name) ;

						if(this.super.destroy) this.super.destroy.call(this) ;
				
				},
				addListener: function addListener(name, listener)
				{

					// preconditions
console.log('org.meta.logic.event.EventTarget.addListener("%s", %s)', name, listener) ;					
						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
				
					// variables
					
					var a ;

					//

						if(! (a = this.listeners[name])) { this.listeners[name] = a = [] ; }
						
						/*Prevent duplicate listener registration.*/
						
						if(a.indexOf(listener) === -1) a[a.length] = listener ;
					
					// return
					
					return this ;

				},
				removeListener: function removeListener(name, listener)
				{

					// preconditions
					
						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
					
					// variables
					
					var a ;
					
					//
					
						if((a = this.listeners[name]))
								if((i = a.indexOf(listener)) !== -1) a.splice(i, 1) ;
					
				},
				removeAllListeners: function removeAllListeners(name)
				{
				
					//
					
						delete this.listeners[name] ;

				},
				triggerEvent: function triggerEvent(name, event)
				{
				
					// variables
					
					var a, i = -1, l ;
					
					//
					
						if((a = this.listeners[name])) {

								while((l = a[++i])) {
								
										/*Remove handlers to be executed at most once (flagged with `once=== true`) must be removed from the `listeners` container for the given event name before being called.*/
										
										if(l.hasAttribute(EventListener.ATTRIBUTE_EXCECUTE_ONCE)) { a.splice(i,1) ; i-- ; }
										
										l.handleEvent(event) ;
										l.destroy( ) ;
								
								}

						}
						
					// return
					
					return this ;					
					
				}
		}
}