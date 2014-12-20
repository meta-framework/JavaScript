/*
@identifier org.meta.logic.event.EventTarget
@extend org.meta.logic.Setable
@require org.meta.logic.event.EventListener
@description Basic implementation of an Object which raises events in the event model.
*/
{
		local: {
				/**@type Object*/
				listeners: null,
				destroy: function destroy( )
				{

					//

						/*Destroy the listeners map.*/
						objectDestroy(this.listeners) ;

						EventTarget.super.invoke('destroy', this) ; // this implies a call to `org.meta.Object.prototype.destroy`
				
				},
				addListener: function addListener(name, listener)
				{

					// preconditions

						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
				
					// variables
					
					var a ;

					//

						if(! (a = this.listeners[name])) { this.listeners[name] = a = [] ; }
						
						/*Prevent duplicate listener registration.*/
						if(a.indexOf(listener) === -1) a[a.length] = listener ;

				},
				/**
				* Remove the given event listener from the event listener collection for the given event name.
				*
				* This operation will _not_ destroy the listener since the caller may want to reuse it.
				*
				* @return (EventListener) The removed event listener or `null` if none was removed.
				*/
				removeListener: function removeListener(name, listener)
				{

					// preconditions
					
						assert(isInstanceOf(EventListener, listener), 'Illegal Argument: object for formal parameter `listener` has invalid type.') ;
					
					// variables
					
					var a ;
					
					//
					
						if((a = this.listeners[name]))
								if((i = a.indexOf(listener)) !== -1)
										return arrayRemove(a, i) ;
					
					// return
					
					return null ;
					
				},
				/**
				* Remove all event listeners for the given event name.
				* @return (Array)
				* @todo refactor into `.destroy` since this has no real practical application.
				* @deprecated
				*/
				_removeAllListeners: function removeAllListeners(name)
				{
				
					// variables
					
					var a ;
					
					//
					
						a = this.listeners[name] || null ;
					
						delete this.listeners[name] ;
					
					// return
					
					return a ;

				},
				/**
				* @param (String) event The event name.
				* @param (Object) data An object containing event data.
				*/
				triggerEvent: function triggerEvent(event, data)
				{
				
					// variables
					
					var a,
						i = -1,
						l,
						b ;
					
					//
					
						if((a = this.listeners[event]))
						{

								while((l = a[++i]))
								{
								
										b = l.hasAttribute(EventListener.EXECUTE_ONCE) ;
										/*Remove handlers to be executed at most once (flagged with `once=== true`) must be removed from the `listeners` container for the given event name before being called.*/
										if(b)
										{
										
												a.splice(i,1) ;
												i-- ; // adjust index for removal of one element
											
										}
										
										l.handleEvent(data) ;
									
										/*Destroy the listener after handling the event.*/
										if(b) l.destroy( ) ;
								
								}

						}
						
					// return
					
					return this ;					
					
				}
		}
}