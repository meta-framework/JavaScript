/*
@package org.meta.logic.event
@require org.meta.standard
@provide EventTarget, EventListener
*/
{
		/**Abstract Object providing the basic implementation of an Object that raises events and provides event listener registration.*/
		EventTarget: {
				extend: 'org.meta.standard.Object',
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
							
								Meta.assert(Meta.instanceOf(org.meta.logic.event.EventListener, listener), 'Invalid type for formal parameter `listener` (type="%s").', Meta.typeOf(listener)) ;
						
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
							
								Meta.assert( Meta.instanceOf(org.meta.logic.event.EventListener,listener), "Invalid type.") ;
							
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
												
												if(l.hasAttribute(org.meta.logic.event.EventListener.ATTRIBUTE_EXCECUTE_ONCE)) { a.splice(i,1) ; i-- ; }
												
												l.handleEvent(event) ;
												l.destroy( ) ;
										
										}

								}
								
							// return
							
							return this ;					
							
						}
				}
		},
		
		/**
		* An event listener.
		* @todo: Make Listener extend Callback. Implement `sleep` and `wake`.
		*/
		EventListener: {
				extend: 'org.meta.standard.Settable',
				main: function main(callback, parameter, attributes)
				{
						this.callback = callback ;
						this.parameter = parameter ;
						this.attributes = attributes ;
				},
				global:
				{
						ATTRIBUTE_EXCECUTE_ONCE: 1,
						create: function create(callback, parameter, attributes)
						{
				
							// preconditions
							
								Meta.assert(Meta.isFunction(callback), 'Invalid type for parameter `callback`.') ;
							
							// return
							
							return new this(callback, parameter || null, attributes || this.constructor.ATTRIBUTE_EXCECUTE_ONCE) ;

						}
				},
				local: {
						callback: null,
						parameter: null,
						attributes: 0,
						/**
						* Handle the event this listener is registered for.
						*
						* The callback handling the event for this listener is called with context fixed to this listener instance and receives an event object characterizing the event.
						*/
						handleEvent: function handleEvent(event) { this.callback.call(this, event) ; }
				}
		}
}